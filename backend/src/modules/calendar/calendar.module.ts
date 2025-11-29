import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { GoogleCalendarService } from './google-calendar.service';
import { MicrosoftCalendarService } from './microsoft-calendar.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService, GoogleCalendarService, MicrosoftCalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}

