import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('auth-url')
  @ApiOperation({ summary: 'Get Google Calendar OAuth URL' })
  async getAuthUrl(@Request() req, @Query('redirectUri') redirectUri: string) {
    return this.calendarService.getAuthUrl(req.user.tenantId, redirectUri);
  }

  @Post('callback')
  @ApiOperation({ summary: 'Handle OAuth callback' })
  async handleCallback(@Body() body: { code: string }, @Request() req) {
    return this.calendarService.handleCallback(body.code, req.user.tenantId);
  }

  @Post('appointment')
  @ApiOperation({ summary: 'Create calendar appointment' })
  async createAppointment(
    @Body()
    body: {
      accessToken: string;
      summary: string;
      startTime: string;
      endTime: string;
      attendeeEmail?: string;
    },
  ) {
    return this.calendarService.createAppointment(
      body.accessToken,
      body.summary,
      new Date(body.startTime),
      new Date(body.endTime),
      body.attendeeEmail,
    );
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Get upcoming appointments' })
  async getUpcomingAppointments(
    @Query('accessToken') accessToken: string,
    @Query('maxResults') maxResults?: number,
  ) {
    return this.calendarService.getUpcomingAppointments(accessToken, maxResults);
  }
}

