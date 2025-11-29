import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createEvent(integrationId: string, data: any): Promise<string> {
    this.logger.log('Creating Google Calendar event for integration: ' + integrationId);
    return 'google_evt_' + Date.now();
  }

  async getEvents(integrationId: string): Promise<any[]> {
    this.logger.log('Getting Google Calendar events for integration: ' + integrationId);
    return [];
  }

  async updateEvent(integrationId: string, eventId: string, data: any): Promise<void> {
    this.logger.log('Updating Google Calendar event: ' + eventId);
  }

  async deleteEvent(integrationId: string, eventId: string): Promise<void> {
    this.logger.log('Deleting Google Calendar event: ' + eventId);
  }
}
