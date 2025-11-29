import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    // Check if slug exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existingTenant) {
      throw new BadRequestException('Tenant slug already exists');
    }

    // Create tenant with admin user
    const passwordHash = await bcrypt.hash(dto.adminPassword, 12);

    const tenant = await this.prisma.$transaction(async (prisma) => {
      const newTenant = await prisma.tenant.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          settings: dto.settings || {},
        },
      });

      // Create admin user
      await prisma.user.create({
        data: {
          email: dto.adminEmail,
          passwordHash,
          firstName: 'Admin',
          lastName: dto.name,
          role: 'LENDER_ADMIN',
          tenantId: newTenant.id,
        },
      });

      return newTenant;
    });

    return tenant;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              loans: true,
              products: true,
            },
          },
        },
      }),
      this.prisma.tenant.count(),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            loans: true,
            products: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.findOne(id);

    return this.prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        name: dto.name,
        logo: dto.logo,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
        settings: dto.settings ? { ...tenant.settings as object, ...dto.settings } : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.tenant.delete({
      where: { id },
    });
  }

  async getStats(tenantId: string) {
    const [
      totalLoans,
      activeLoans,
      totalUsers,
      activeProducts,
    ] = await Promise.all([
      this.prisma.loan.count({ where: { tenantId } }),
      this.prisma.loan.count({
        where: {
          tenantId,
          status: { notIn: ['CLOSED', 'DENIED', 'WITHDRAWN'] },
        },
      }),
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.loanProduct.count({ where: { tenantId, isActive: true } }),
    ]);

    return {
      totalLoans,
      activeLoans,
      totalUsers,
      activeProducts,
    };
  }
}

