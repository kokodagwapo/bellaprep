import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationType } from '@prisma/client';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private prisma: PrismaService) {}

  async createEvent(
    tenantId: string,
    data: {
      title: string;
      description?: string;
      startTime: Date;
      endTime: Date;
      location?: string;
      attendees?: string[];
      createdBy?: string;
    },
  ): Promise<any> {
    return {
      id: 'evt_' + Date.now(),
      tenantId,
      ...data,
      createdAt: new Date(),
    };
  }

  async getEvents(tenantId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    return [];
  }

  async updateEvent(id: string, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }

  async deleteEvent(id: string): Promise<void> {
    this.logger.log('Deleting event ' + id);
  }

  async syncEvents(tenantId: string): Promise<void> {
    const integration = await this.getActiveIntegration(tenantId);
    if (!integration) {
      return;
    }
    this.logger.log('Syncing calendar for tenant ' + tenantId);
  }

  private async getActiveIntegration(tenantId: string): Promise<any> {
    return this.prisma.integration.findFirst({
      where: {
        tenantId,
        type: {
          in: [IntegrationType.GOOGLE_CALENDAR, IntegrationType.OFFICE365],
        },
        enabled: true,
      },
    });
  }
}
