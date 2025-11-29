import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlaidService } from './plaid.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('plaid')
@Controller('plaid')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {}

  @Post('link-token')
  @ApiOperation({ summary: 'Create Plaid Link token' })
  async createLinkToken(@Request() req) {
    return this.plaidService.createLinkToken(req.user.id);
  }

  @Post('exchange-token')
  @ApiOperation({ summary: 'Exchange public token for access token' })
  async exchangePublicToken(
    @Body() body: { publicToken: string; borrowerId: string },
    @Request() req,
  ) {
    return this.plaidService.exchangePublicToken(body.publicToken, body.borrowerId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync Plaid accounts' })
  async syncAccounts(@Body() body: { borrowerId: string }) {
    return this.plaidService.syncAccounts(body.borrowerId);
  }

  @Post('income-verification')
  @ApiOperation({ summary: 'Get income verification' })
  async getIncomeVerification(@Body() body: { borrowerId: string }) {
    return this.plaidService.getIncomeVerification(body.borrowerId);
  }
}

