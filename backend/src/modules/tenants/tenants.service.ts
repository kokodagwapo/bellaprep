import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Tenant, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    subdomain: string;
    domain?: string;
    email?: string;
    plan?: SubscriptionPlan;
  }): Promise<Tenant> {
    // Check if subdomain already exists
    const existing = await this.prisma.tenant.findUnique({
      where: { subdomain: data.subdomain },
    });

    if (existing) {
      throw new ConflictException('Subdomain already exists');
    }

    // Create tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.name,
        subdomain: data.subdomain,
        domain: data.domain,
        email: data.email,
        plan: data.plan || SubscriptionPlan.FREE,
        subscriptionStatus: SubscriptionStatus.TRIALING,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
    });

    // TODO: Create default form templates
    // TODO: Create default products
    // TODO: Send welcome email

    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        tenantUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
    });
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async updateSettings(id: string, settings: any): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: { settings },
    });
  }

  async updateBranding(id: string, branding: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  }): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: branding,
    });
  }
}

