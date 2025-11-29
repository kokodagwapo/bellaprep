import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(tenantId?: string): Promise<User[]> {
    if (tenantId) {
      const tenantUsers = await this.prisma.tenantUser.findMany({
        where: { tenantId },
        include: {
          user: true,
        },
      });
      return tenantUsers.map(tu => tu.user);
    }

    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async assignToTenant(userId: string, tenantId: string, role: UserRole): Promise<void> {
    await this.prisma.tenantUser.create({
      data: {
        userId,
        tenantId,
        role,
      },
    });
  }

  async removeFromTenant(userId: string, tenantId: string): Promise<void> {
    await this.prisma.tenantUser.deleteMany({
      where: {
        userId,
        tenantId,
      },
    });
  }
}

