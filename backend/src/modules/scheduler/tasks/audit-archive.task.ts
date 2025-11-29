import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class AuditArchiveTask {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleAuditArchive() {
    // Archive audit logs older than 90 days
    const archiveDate = new Date();
    archiveDate.setDate(archiveDate.getDate() - 90);

    // In production, this would move logs to cold storage
    // For now, just log the count
    const count = await this.prisma.auditLog.count({
      where: {
        createdAt: {
          lt: archiveDate,
        },
      },
    });

    console.log(`Found ${count} audit logs older than 90 days to archive`);
  }
}

