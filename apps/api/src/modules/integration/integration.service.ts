import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IntegrationType } from '@prisma/client';

@Injectable()
export class IntegrationService {
  constructor(private prisma: PrismaService) {}

  async getIntegrations(tenantId: string) {
    return this.prisma.integration.findMany({
      where: { tenantId },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
        // Don't expose credentials
      },
    });
  }

  async getIntegration(id: string, tenantId: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, tenantId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  async createIntegration(
    tenantId: string,
    type: IntegrationType,
    name: string,
    credentials: any,
    config?: any,
  ) {
    return this.prisma.integration.create({
      data: {
        tenantId,
        type,
        name,
        credentials,
        config: config || {},
        isActive: true,
      },
    });
  }

  async updateIntegration(
    id: string,
    tenantId: string,
    data: {
      name?: string;
      credentials?: any;
      config?: any;
      isActive?: boolean;
    },
  ) {
    await this.getIntegration(id, tenantId);

    return this.prisma.integration.update({
      where: { id },
      data,
    });
  }

  async deleteIntegration(id: string, tenantId: string) {
    await this.getIntegration(id, tenantId);

    return this.prisma.integration.delete({
      where: { id },
    });
  }

  async updateLastSync(id: string) {
    return this.prisma.integration.update({
      where: { id },
      data: { lastSyncAt: new Date() },
    });
  }

  async getActiveIntegration(tenantId: string, type: IntegrationType) {
    return this.prisma.integration.findFirst({
      where: { tenantId, type, isActive: true },
    });
  }
}

