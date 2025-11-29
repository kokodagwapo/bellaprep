import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

@Injectable()
export class PlaidService {
  private plaidClient: PlaidApi;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[this.configService.get('PLAID_ENV') || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.configService.get('PLAID_CLIENT_ID'),
          'PLAID-SECRET': this.configService.get('PLAID_SECRET'),
        },
      },
    });

    this.plaidClient = new PlaidApi(configuration);
  }

  async createLinkToken(userId: string) {
    const response = await this.plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'BellaPrep',
      products: ['identity', 'auth', 'transactions', 'income'],
      country_codes: ['US'],
      language: 'en',
    });

    return { linkToken: response.data.link_token };
  }

  async exchangePublicToken(publicToken: string, borrowerId: string) {
    const response = await this.plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information
    const accountsResponse = await this.plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Store in database
    for (const account of accountsResponse.data.accounts) {
      await this.prisma.plaidAccount.upsert({
        where: {
          borrowerId_accountId: {
            borrowerId,
            accountId: account.account_id,
          },
        },
        create: {
          borrowerId,
          plaidItemId: itemId,
          accessToken, // In production, encrypt this
          accountId: account.account_id,
          accountType: account.type,
          accountData: account as any,
        },
        update: {
          accessToken,
          accountData: account as any,
        },
      });
    }

    return { success: true, itemId };
  }

  async syncAccounts(borrowerId: string) {
    const plaidAccounts = await this.prisma.plaidAccount.findMany({
      where: { borrowerId },
    });

    const syncedAccounts = [];

    for (const account of plaidAccounts) {
      try {
        const accountsResponse = await this.plaidClient.accountsGet({
          access_token: account.accessToken,
        });

        const balancesResponse = await this.plaidClient.accountsBalanceGet({
          access_token: account.accessToken,
        });

        const updated = await this.prisma.plaidAccount.update({
          where: { id: account.id },
          data: {
            accountData: {
              ...accountsResponse.data.accounts.find((a) => a.account_id === account.accountId),
              balance: balancesResponse.data.accounts.find((a) => a.account_id === account.accountId)
                ?.balances,
            },
            syncedAt: new Date(),
          },
        });

        syncedAccounts.push(updated);
      } catch (error) {
        console.error(`Error syncing account ${account.id}:`, error);
      }
    }

    return syncedAccounts;
  }

  async getIncomeVerification(borrowerId: string) {
    const plaidAccounts = await this.prisma.plaidAccount.findMany({
      where: { borrowerId },
    });

    if (plaidAccounts.length === 0) {
      return null;
    }

    // Use first account's access token
    const accessToken = plaidAccounts[0].accessToken;

    try {
      const incomeResponse = await this.plaidClient.incomeVerificationPaystubsGet({
        access_token: accessToken,
      });

      return incomeResponse.data;
    } catch (error) {
      console.error('Error getting income verification:', error);
      return null;
    }
  }
}

