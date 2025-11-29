import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    // Check if subdomain is already taken
    if (createTenantDto.subdomain) {
      const existing = await this.prisma.tenant.findUnique({
        where: { subdomain: createTenantDto.subdomain },
      });

      if (existing) {
        throw new BadRequestException('Subdomain already taken');
      }
    }

    return this.prisma.tenant.create({
      data: createTenantDto,
    });
  }

  async findAll(userRole: string, userTenantId?: string) {
    // Super admin can see all tenants
    if (userRole === 'SUPER_ADMIN') {
      return this.prisma.tenant.findMany({
        include: {
          _count: {
            select: {
              users: true,
              borrowers: true,
              products: true,
            },
          },
        },
      });
    }

    // Regular users can only see their own tenant
    if (!userTenantId) {
      throw new ForbiddenException('Tenant ID required');
    }

    return this.prisma.tenant.findUnique({
      where: { id: userTenantId },
      include: {
        _count: {
          select: {
            users: true,
            borrowers: true,
            products: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userRole: string, userTenantId?: string) {
    // Super admin can access any tenant
    if (userRole === 'SUPER_ADMIN') {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              createdAt: true,
            },
          },
          products: true,
          formTemplates: true,
        },
      });

      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }

      return tenant;
    }

    // Regular users can only access their own tenant
    if (userTenantId !== id) {
      throw new ForbiddenException('Access denied');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
        },
        products: true,
        formTemplates: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async findBySubdomain(subdomain: string) {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
    });
  }

  async update(id: string, updateTenantDto: UpdateTenantDto, userRole: string, userTenantId?: string) {
    // Check access
    await this.findOne(id, userRole, userTenantId);

    // Check subdomain uniqueness if updating
    if (updateTenantDto.subdomain) {
      const existing = await this.prisma.tenant.findFirst({
        where: {
          subdomain: updateTenantDto.subdomain,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException('Subdomain already taken');
      }
    }

    return this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  async remove(id: string, userRole: string) {
    // Only super admin can delete tenants
    if (userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admin can delete tenants');
    }

    await this.prisma.tenant.delete({
      where: { id },
    });

    return { success: true };
  }
}

