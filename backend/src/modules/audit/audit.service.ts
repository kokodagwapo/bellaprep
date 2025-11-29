import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateAuditLogDto {
  tenantId?: string;
  userId?: string;
  borrowerId?: string;
  event: string;
  module: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAuditLogDto) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          tenantId: dto.tenantId,
          userId: dto.userId,
          borrowerId: dto.borrowerId,
          event: dto.event,
          module: dto.module,
          metadata: dto.metadata,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      throw error;
    }
  }

  async log(dto: CreateAuditLogDto) {
    return this.create(dto);
  }

  async findByTenant(tenantId: string, options?: { skip?: number; take?: number }) {
    return this.prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      skip: options?.skip ?? 0,
      take: options?.take ?? 50,
    });
  }

  async findByUser(userId: string, options?: { skip?: number; take?: number }) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: options?.skip ?? 0,
      take: options?.take ?? 50,
    });
  }

  async findByBorrower(borrowerId: string, options?: { skip?: number; take?: number }) {
    return this.prisma.auditLog.findMany({
      where: { borrowerId },
      orderBy: { createdAt: 'desc' },
      skip: options?.skip ?? 0,
      take: options?.take ?? 50,
    });
  }

  async getStats(tenantId: string) {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, last24hCount, last7dCount, byEvent] = await Promise.all([
      this.prisma.auditLog.count({ where: { tenantId } }),
      this.prisma.auditLog.count({
        where: { tenantId, createdAt: { gte: last24h } },
      }),
      this.prisma.auditLog.count({
        where: { tenantId, createdAt: { gte: last7d } },
      }),
      this.prisma.auditLog.groupBy({
        by: ['event'],
        where: { tenantId, createdAt: { gte: last7d } },
        _count: true,
        orderBy: { _count: { event: 'desc' } },
      }),
    ]);

    return {
      total,
      last24h: last24hCount,
      last7d: last7dCount,
      byEvent: byEvent.slice(0, 10).map((item) => ({
        event: item.event,
        count: item._count,
      })),
    };
  }
}
