import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { PlaidService } from './plaid.service';
import { CalendarService } from './calendar.service';

@Module({
  controllers: [IntegrationController],
  providers: [IntegrationService, PlaidService, CalendarService],
  exports: [IntegrationService, PlaidService, CalendarService],
})
export class IntegrationModule {}

