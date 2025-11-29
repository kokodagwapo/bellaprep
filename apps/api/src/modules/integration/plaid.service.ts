import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IntegrationService } from './integration.service';

// Note: In production, you would use the official @plaid/plaid-node package
// This is a simplified implementation for structure demonstration

interface PlaidConfig {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

@Injectable()
export class PlaidService {
  private config: PlaidConfig;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private integrationService: IntegrationService,
  ) {
    this.config = {
      clientId: this.configService.get('PLAID_CLIENT_ID') || '',
      secret: this.configService.get('PLAID_SECRET') || '',
      environment: this.configService.get('PLAID_ENV') || 'sandbox',
    };
  }

  async createLinkToken(tenantId: string, userId: string) {
    // In production, call Plaid API to create link token
    // For now, return mock data
    return {
      linkToken: `link-${tenantId}-${userId}-${Date.now()}`,
      expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  async exchangePublicToken(tenantId: string, userId: string, publicToken: string) {
    // In production, exchange public token for access token via Plaid API
    // Store the access token securely
    
    const accessToken = `access-${publicToken}-${Date.now()}`;
    const itemId = `item-${Date.now()}`;

    // Store in database
    await this.prisma.plaidLink.create({
      data: {
        tenantId,
        userId,
        accessToken, // In production, encrypt this
        itemId,
        status: 'ACTIVE',
      },
    });

    return {
      success: true,
      itemId,
    };
  }

  async getAccounts(tenantId: string, userId: string) {
    const plaidLink = await this.prisma.plaidLink.findFirst({
      where: { tenantId, userId, status: 'ACTIVE' },
    });

    if (!plaidLink) {
      throw new BadRequestException('No active Plaid link found');
    }

    // In production, call Plaid API to get accounts
    // Return mock data for demonstration
    return {
      accounts: [
        {
          accountId: 'acc-1',
          name: 'Checking Account',
          type: 'depository',
          subtype: 'checking',
          mask: '1234',
          balances: {
            available: 5000,
            current: 5500,
          },
        },
        {
          accountId: 'acc-2',
          name: 'Savings Account',
          type: 'depository',
          subtype: 'savings',
          mask: '5678',
          balances: {
            available: 25000,
            current: 25000,
          },
        },
      ],
    };
  }

  async getIdentity(tenantId: string, userId: string) {
    const plaidLink = await this.prisma.plaidLink.findFirst({
      where: { tenantId, userId, status: 'ACTIVE' },
    });

    if (!plaidLink) {
      throw new BadRequestException('No active Plaid link found');
    }

    // In production, call Plaid Identity API
    // Return mock data
    return {
      identity: {
        names: ['John Doe'],
        emails: [{ data: 'john@example.com', primary: true }],
        phones: [{ data: '555-1234', primary: true }],
        addresses: [
          {
            data: {
              street: '123 Main St',
              city: 'Anytown',
              region: 'CA',
              postalCode: '12345',
            },
            primary: true,
          },
        ],
      },
    };
  }

  async getIncome(tenantId: string, userId: string) {
    const plaidLink = await this.prisma.plaidLink.findFirst({
      where: { tenantId, userId, status: 'ACTIVE' },
    });

    if (!plaidLink) {
      throw new BadRequestException('No active Plaid link found');
    }

    // In production, call Plaid Income API
    // Return mock data
    return {
      income: {
        lastYearIncome: 85000,
        lastYearIncomeBeforeTax: 95000,
        projectedYearlyIncome: 90000,
        projectedYearlyIncomeBeforeTax: 100000,
        incomeStreams: [
          {
            name: 'ACME Corporation',
            income: 7500,
            frequency: 'MONTHLY',
            confidence: 0.95,
          },
        ],
      },
    };
  }

  async getAssets(tenantId: string, userId: string) {
    const plaidLink = await this.prisma.plaidLink.findFirst({
      where: { tenantId, userId, status: 'ACTIVE' },
    });

    if (!plaidLink) {
      throw new BadRequestException('No active Plaid link found');
    }

    // Return summarized asset data
    const accounts = await this.getAccounts(tenantId, userId);
    
    return {
      totalAssets: accounts.accounts.reduce(
        (sum, acc) => sum + (acc.balances.current || 0),
        0
      ),
      accounts: accounts.accounts,
    };
  }

  async unlinkAccount(tenantId: string, userId: string) {
    const plaidLink = await this.prisma.plaidLink.findFirst({
      where: { tenantId, userId, status: 'ACTIVE' },
    });

    if (!plaidLink) {
      throw new BadRequestException('No active Plaid link found');
    }

    // In production, call Plaid to remove item
    
    await this.prisma.plaidLink.update({
      where: { id: plaidLink.id },
      data: { status: 'UNLINKED' },
    });

    return { success: true };
  }
}

