import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditLogAction } from '@prisma/client';
import { AuditGateway } from './audit.gateway';

export interface AuditLogEntry {
  tenantId: string;
  userId?: string;
  action: AuditLogAction;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    private prisma: PrismaService,
    private auditGateway: AuditGateway,
  ) {}

  async log(entry: AuditLogEntry) {
    const auditLog = await this.prisma.auditLog.create({
      data: {
        tenantId: entry.tenantId,
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        details: entry.details || {},
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Broadcast to real-time listeners
    this.auditGateway.broadcastAuditLog(entry.tenantId, auditLog);

    return auditLog;
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 50,
    filters?: {
      userId?: string;
      action?: AuditLogAction;
      resource?: string;
      resourceId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.action) where.action = filters.action;
    if (filters?.resource) where.resource = filters.resource;
    if (filters?.resourceId) where.resourceId = filters.resourceId;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByResource(tenantId: string, resource: string, resourceId: string) {
    return this.prisma.auditLog.findMany({
      where: { tenantId, resource, resourceId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalActions,
      byAction,
      byResource,
      byUser,
      recentActivity,
    ] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['resource'],
        where,
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['userId'],
        where: { ...where, userId: { not: null } },
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      totalActions,
      byAction: byAction.reduce((acc, item) => {
        acc[item.action] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byResource: byResource.reduce((acc, item) => {
        acc[item.resource] = item._count;
        return acc;
      }, {} as Record<string, number>),
      topUsers: byUser,
      recentActivity,
    };
  }

  async export(
    tenantId: string,
    format: 'json' | 'csv',
    filters?: {
      startDate?: Date;
      endDate?: Date;
      action?: AuditLogAction;
      resource?: string;
    },
  ) {
    const where: any = { tenantId };
    if (filters?.action) where.action = filters.action;
    if (filters?.resource) where.resource = filters.resource;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (format === 'json') {
      return logs;
    }

    // CSV format
    const headers = [
      'ID',
      'Timestamp',
      'User Email',
      'User Name',
      'Action',
      'Resource',
      'Resource ID',
      'IP Address',
      'Details',
    ];

    const rows = logs.map(log => [
      log.id,
      log.createdAt.toISOString(),
      log.user?.email || '',
      log.user ? `${log.user.firstName} ${log.user.lastName}` : '',
      log.action,
      log.resource,
      log.resourceId || '',
      log.ipAddress || '',
      JSON.stringify(log.details),
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

