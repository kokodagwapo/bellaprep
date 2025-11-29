import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoanStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPipelineMetrics(tenantId: string) {
    const borrowers = await this.prisma.borrower.findMany({
      where: { tenantId },
      select: {
        status: true,
        productId: true,
        createdAt: true,
        submittedAt: true,
      },
    });

    const byStatus = borrowers.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byProduct = borrowers.reduce((acc, b) => {
      const productId = b.productId || 'none';
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: borrowers.length,
      byStatus,
      byProduct,
    };
  }

  async getFunnelAnalytics(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const borrowers = await this.prisma.borrower.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate },
      },
      select: {
        status: true,
        createdAt: true,
        submittedAt: true,
      },
    });

    const funnel = {
      started: borrowers.length,
      submitted: borrowers.filter((b) => b.status !== LoanStatus.DRAFT).length,
      inReview: borrowers.filter((b) => b.status === LoanStatus.IN_REVIEW).length,
      approved: borrowers.filter((b) => b.status === LoanStatus.APPROVED).length,
      closed: borrowers.filter((b) => b.status === LoanStatus.CLOSED).length,
    };

    return funnel;
  }

  async getLOPerformance(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get borrowers with assigned LO (would need to add LO assignment to schema)
    const borrowers = await this.prisma.borrower.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate },
      },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    // Group by LO (placeholder - would need LO assignment)
    return {
      totalBorrowers: borrowers.length,
      avgDocumentsPerBorrower:
        borrowers.reduce((sum, b) => sum + b._count.documents, 0) / borrowers.length || 0,
    };
  }

  async getDocumentCompletionStats(tenantId: string) {
    const borrowers = await this.prisma.borrower.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    return {
      totalBorrowers: borrowers.length,
      borrowersWithDocuments: borrowers.filter((b) => b._count.documents > 0).length,
      avgDocumentsPerBorrower:
        borrowers.reduce((sum, b) => sum + b._count.documents, 0) / borrowers.length || 0,
    };
  }

  async getBellaUsageStats(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const auditLogs = await this.prisma.auditLog.findMany({
      where: {
        tenantId,
        module: 'bella',
        createdAt: { gte: startDate },
      },
    });

    const byEvent = auditLogs.reduce((acc, log) => {
      acc[log.event] = (acc[log.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInteractions: auditLogs.length,
      byEvent,
    };
  }

  async getSuperAdminStats() {
    const [tenants, users, borrowers, products] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.user.count(),
      this.prisma.borrower.count(),
      this.prisma.product.count(),
    ]);

    return {
      totalTenants: tenants,
      totalUsers: users,
      totalBorrowers: borrowers,
      totalProducts: products,
    };
  }
}

