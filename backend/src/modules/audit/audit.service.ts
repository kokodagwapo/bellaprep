import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAuditLogDto: CreateAuditLogDto,
    tenantId?: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        borrowerId: createAuditLogDto.borrowerId,
        event: createAuditLogDto.event,
        module: createAuditLogDto.module,
        metadata: createAuditLogDto.metadata || {},
        ipAddress,
        userAgent,
      },
    });
  }

  async findAll(
    tenantId?: string,
    userId?: string,
    borrowerId?: string,
    module?: string,
    event?: string,
    limit: number = 100,
    offset: number = 0,
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(tenantId && { tenantId }),
        ...(userId && { userId }),
        ...(borrowerId && { borrowerId }),
        ...(module && { module }),
        ...(event && { event }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        borrower: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        borrower: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getStats(tenantId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [total, byModule, byEvent] = await Promise.all([
      this.prisma.auditLog.count({
        where: {
          ...(tenantId && { tenantId }),
          createdAt: { gte: startDate },
        },
      }),
      this.prisma.auditLog.groupBy({
        by: ['module'],
        where: {
          ...(tenantId && { tenantId }),
          createdAt: { gte: startDate },
        },
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['event'],
        where: {
          ...(tenantId && { tenantId }),
          createdAt: { gte: startDate },
        },
        _count: true,
        take: 10,
      }),
    ]);

    return {
      total,
      byModule: byModule.map((item) => ({
        module: item.module,
        count: item._count,
      })),
      byEvent: byEvent.map((item) => ({
        event: item.event,
        count: item._count,
      })),
    };
  }
}

