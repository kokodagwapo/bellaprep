import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { PlaidService } from './plaid.service';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('integrations')
@Controller('integrations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IntegrationController {
  constructor(
    private integrationService: IntegrationService,
    private plaidService: PlaidService,
    private calendarService: CalendarService,
  ) {}

  // General Integrations
  @Get()
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'List all integrations' })
  getIntegrations(@CurrentUser('tenantId') tenantId: string) {
    return this.integrationService.getIntegrations(tenantId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete integration' })
  deleteIntegration(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.integrationService.deleteIntegration(id, tenantId);
  }

  // Plaid Integration
  @Post('plaid/link-token')
  @ApiOperation({ summary: 'Create Plaid link token' })
  createPlaidLinkToken(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.createLinkToken(tenantId, userId);
  }

  @Post('plaid/exchange-token')
  @ApiOperation({ summary: 'Exchange Plaid public token' })
  exchangePlaidToken(
    @Body('publicToken') publicToken: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.exchangePublicToken(tenantId, userId, publicToken);
  }

  @Get('plaid/accounts')
  @ApiOperation({ summary: 'Get linked accounts' })
  getPlaidAccounts(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.getAccounts(tenantId, userId);
  }

  @Get('plaid/identity')
  @ApiOperation({ summary: 'Get identity data from Plaid' })
  getPlaidIdentity(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.getIdentity(tenantId, userId);
  }

  @Get('plaid/income')
  @ApiOperation({ summary: 'Get income data from Plaid' })
  getPlaidIncome(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.getIncome(tenantId, userId);
  }

  @Get('plaid/assets')
  @ApiOperation({ summary: 'Get assets data from Plaid' })
  getPlaidAssets(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.getAssets(tenantId, userId);
  }

  @Delete('plaid/unlink')
  @ApiOperation({ summary: 'Unlink Plaid account' })
  unlinkPlaid(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.plaidService.unlinkAccount(tenantId, userId);
  }

  // Calendar Integration
  @Get('calendar/google/auth-url')
  @ApiOperation({ summary: 'Get Google Calendar OAuth URL' })
  getGoogleAuthUrl(
    @Query('redirectUri') redirectUri: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.getGoogleAuthUrl(tenantId, userId, redirectUri);
  }

  @Post('calendar/google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  handleGoogleCallback(
    @Body('code') code: string,
    @Body('state') state: string,
    @Body('redirectUri') redirectUri: string,
  ) {
    return this.calendarService.handleGoogleCallback(code, state, redirectUri);
  }

  @Get('calendar/microsoft/auth-url')
  @ApiOperation({ summary: 'Get Microsoft Calendar OAuth URL' })
  getMicrosoftAuthUrl(
    @Query('redirectUri') redirectUri: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.getMicrosoftAuthUrl(tenantId, userId, redirectUri);
  }

  @Get('calendar/events')
  @ApiOperation({ summary: 'Get calendar events' })
  getCalendarEvents(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.getEvents(
      tenantId,
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('calendar/events')
  @ApiOperation({ summary: 'Create calendar event' })
  createCalendarEvent(
    @Body() event: { title: string; description?: string; start: string; end: string; attendees?: string[] },
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.createEvent(tenantId, userId, {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    });
  }

  @Delete('calendar/events/:eventId')
  @ApiOperation({ summary: 'Delete calendar event' })
  deleteCalendarEvent(
    @Param('eventId') eventId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.deleteEvent(tenantId, userId, eventId);
  }

  @Get('calendar/connections')
  @ApiOperation({ summary: 'Get calendar connections' })
  getCalendarConnections(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.getConnections(tenantId, userId);
  }

  @Delete('calendar/:provider/disconnect')
  @ApiOperation({ summary: 'Disconnect calendar' })
  disconnectCalendar(
    @Param('provider') provider: 'GOOGLE' | 'MICROSOFT',
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.calendarService.disconnect(tenantId, userId, provider);
  }
}

