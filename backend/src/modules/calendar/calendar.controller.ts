import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('events')
  @ApiOperation({ summary: 'Create calendar event' })
  async createEvent(
    @CurrentTenant() tenant: any,
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.calendarService.createEvent(tenant.id, {
      ...data,
      createdBy: userId,
    });
  }

  @Get('events')
  @ApiOperation({ summary: 'Get calendar events' })
  async getEvents(
    @CurrentTenant() tenant: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.calendarService.getEvents(
      tenant.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Put('events/:id')
  @ApiOperation({ summary: 'Update calendar event' })
  async updateEvent(@Param('id') id: string, @Body() data: any) {
    return this.calendarService.updateEvent(id, data);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete calendar event' })
  async deleteEvent(@Param('id') id: string) {
    return this.calendarService.deleteEvent(id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync events from external calendar' })
  async syncEvents(@CurrentTenant() tenant: any) {
    await this.calendarService.syncEvents(tenant.id);
    return { success: true };
  }
}

