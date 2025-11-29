import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IntegrationType } from '@prisma/client';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<any[]> {
    return this.prisma.integration.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsert(tenantId: string, type: IntegrationType, config: any): Promise<any> {
    const existing = await this.prisma.integration.findFirst({
      where: { tenantId, type },
    });

    if (existing) {
      return this.prisma.integration.update({
        where: { id: existing.id },
        data: { config, enabled: true },
      });
    }

    return this.prisma.integration.create({
      data: {
        tenantId,
        type,
        config,
        enabled: true,
      },
    });
  }

  async disconnect(integrationId: string): Promise<void> {
    await this.prisma.integration.update({
      where: { id: integrationId },
      data: { enabled: false },
    });
  }

  async testConnection(integrationId: string): Promise<boolean> {
    this.logger.log('Testing connection for integration: ' + integrationId);
    return true;
  }

  getIntegrationName(type: IntegrationType): string {
    const names: Record<string, string> = {
      PLAID: 'Plaid',
      GOOGLE_CALENDAR: 'Google Calendar',
      OFFICE365: 'Office 365',
      SENDGRID: 'SendGrid',
      TWILIO: 'Twilio',
      ENCOMPASS: 'Encompass LOS',
      SALESFORCE: 'Salesforce CRM',
    };

    return names[type] || type;
  }
}
