import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoanStatus, LoanProductType } from '@prisma/client';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // LENDER ADMIN DASHBOARD
  // ==========================================

  async getLenderDashboard(tenantId: string, dateRange?: DateRange) {
    const [
      loanStats,
      pipelineByStatus,
      pipelineByProduct,
      recentLoans,
      loPerformance,
      documentStats,
      conversionMetrics,
    ] = await Promise.all([
      this.getLoanStats(tenantId, dateRange),
      this.getPipelineByStatus(tenantId, dateRange),
      this.getPipelineByProduct(tenantId, dateRange),
      this.getRecentLoans(tenantId),
      this.getLoPerformance(tenantId, dateRange),
      this.getDocumentStats(tenantId, dateRange),
      this.getConversionMetrics(tenantId, dateRange),
    ]);

    return {
      loanStats,
      pipelineByStatus,
      pipelineByProduct,
      recentLoans,
      loPerformance,
      documentStats,
      conversionMetrics,
    };
  }

  async getLoanStats(tenantId: string, dateRange?: DateRange) {
    const where: any = { tenantId };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [total, thisMonth, thisWeek, closed, totalValue] = await Promise.all([
      this.prisma.loan.count({ where }),
      this.prisma.loan.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.loan.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.loan.count({
        where: { ...where, status: LoanStatus.CLOSED },
      }),
      this.prisma.loan.aggregate({
        where: { ...where, status: LoanStatus.CLOSED },
        _sum: { loanAmount: true },
      }),
    ]);

    return {
      total,
      thisMonth,
      thisWeek,
      closed,
      totalValue: totalValue._sum.loanAmount || 0,
    };
  }

  async getPipelineByStatus(tenantId: string, dateRange?: DateRange) {
    const where: any = { tenantId };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const result = await this.prisma.loan.groupBy({
      by: ['status'],
      where,
      _count: true,
      _sum: { loanAmount: true },
    });

    return result.map(item => ({
      status: item.status,
      count: item._count,
      value: item._sum.loanAmount || 0,
    }));
  }

  async getPipelineByProduct(tenantId: string, dateRange?: DateRange) {
    const where: any = { tenantId };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const result = await this.prisma.loan.groupBy({
      by: ['productType'],
      where,
      _count: true,
      _sum: { loanAmount: true },
    });

    return result.map(item => ({
      productType: item.productType,
      count: item._count,
      value: item._sum.loanAmount || 0,
    }));
  }

  async getRecentLoans(tenantId: string, limit = 10) {
    return this.prisma.loan.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        borrower: { select: { id: true, firstName: true, lastName: true } },
        product: { select: { id: true, name: true, type: true } },
        loanOfficer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async getLoPerformance(tenantId: string, dateRange?: DateRange) {
    const where: any = { tenantId, loanOfficerId: { not: null } };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const result = await this.prisma.loan.groupBy({
      by: ['loanOfficerId'],
      where,
      _count: true,
      _sum: { loanAmount: true },
    });

    // Get LO details
    const loIds = result.map(r => r.loanOfficerId).filter(Boolean) as string[];
    const los = await this.prisma.user.findMany({
      where: { id: { in: loIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    const loMap = new Map(los.map(lo => [lo.id, lo]));

    return result.map(item => ({
      loanOfficer: loMap.get(item.loanOfficerId!) || null,
      count: item._count,
      value: item._sum.loanAmount || 0,
    })).sort((a, b) => b.count - a.count);
  }

  async getDocumentStats(tenantId: string, dateRange?: DateRange) {
    const where: any = { loan: { tenantId } };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [total, verified, pending, byType] = await Promise.all([
      this.prisma.loanDocument.count({ where }),
      this.prisma.loanDocument.count({ where: { ...where, verified: true } }),
      this.prisma.loanDocument.count({ where: { ...where, verified: false } }),
      this.prisma.loanDocument.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      verified,
      pending,
      verificationRate: total > 0 ? (verified / total) * 100 : 0,
      byType: byType.map(item => ({
        type: item.type,
        count: item._count,
      })),
    };
  }

  async getConversionMetrics(tenantId: string, dateRange?: DateRange) {
    const where: any = { tenantId };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [
      totalCreated,
      submitted,
      approved,
      closed,
      denied,
      withdrawn,
    ] = await Promise.all([
      this.prisma.loan.count({ where }),
      this.prisma.loan.count({ where: { ...where, status: { not: LoanStatus.DRAFT } } }),
      this.prisma.loan.count({ where: { ...where, status: { in: [LoanStatus.APPROVED, LoanStatus.CLOSED] } } }),
      this.prisma.loan.count({ where: { ...where, status: LoanStatus.CLOSED } }),
      this.prisma.loan.count({ where: { ...where, status: LoanStatus.DENIED } }),
      this.prisma.loan.count({ where: { ...where, status: LoanStatus.WITHDRAWN } }),
    ]);

    return {
      totalCreated,
      submitted,
      approved,
      closed,
      denied,
      withdrawn,
      submissionRate: totalCreated > 0 ? (submitted / totalCreated) * 100 : 0,
      approvalRate: submitted > 0 ? (approved / submitted) * 100 : 0,
      closeRate: approved > 0 ? (closed / approved) * 100 : 0,
      falloutRate: submitted > 0 ? ((denied + withdrawn) / submitted) * 100 : 0,
    };
  }

  // ==========================================
  // SUPER ADMIN DASHBOARD
  // ==========================================

  async getSuperAdminDashboard(dateRange?: DateRange) {
    const [
      tenantStats,
      globalLoanStats,
      tenantUsage,
      productAdoption,
      systemHealth,
    ] = await Promise.all([
      this.getTenantStats(dateRange),
      this.getGlobalLoanStats(dateRange),
      this.getTenantUsage(dateRange),
      this.getProductAdoption(dateRange),
      this.getSystemHealth(),
    ]);

    return {
      tenantStats,
      globalLoanStats,
      tenantUsage,
      productAdoption,
      systemHealth,
    };
  }

  async getTenantStats(dateRange?: DateRange) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [total, active, thisMonth] = await Promise.all([
      this.prisma.tenant.count({ where }),
      this.prisma.tenant.count({ where: { ...where, isActive: true } }),
      this.prisma.tenant.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return { total, active, thisMonth };
  }

  async getGlobalLoanStats(dateRange?: DateRange) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [total, closed, totalValue] = await Promise.all([
      this.prisma.loan.count({ where }),
      this.prisma.loan.count({ where: { ...where, status: LoanStatus.CLOSED } }),
      this.prisma.loan.aggregate({
        where: { ...where, status: LoanStatus.CLOSED },
        _sum: { loanAmount: true },
      }),
    ]);

    return {
      total,
      closed,
      totalValue: totalValue._sum.loanAmount || 0,
    };
  }

  async getTenantUsage(dateRange?: DateRange) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const result = await this.prisma.loan.groupBy({
      by: ['tenantId'],
      where,
      _count: true,
      _sum: { loanAmount: true },
    });

    // Get tenant details
    const tenantIds = result.map(r => r.tenantId);
    const tenants = await this.prisma.tenant.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, name: true, slug: true },
    });

    const tenantMap = new Map(tenants.map(t => [t.id, t]));

    return result
      .map(item => ({
        tenant: tenantMap.get(item.tenantId) || null,
        loanCount: item._count,
        loanValue: item._sum.loanAmount || 0,
      }))
      .sort((a, b) => b.loanCount - a.loanCount);
  }

  async getProductAdoption(dateRange?: DateRange) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const result = await this.prisma.loan.groupBy({
      by: ['productType'],
      where,
      _count: true,
    });

    const total = result.reduce((sum, item) => sum + item._count, 0);

    return result.map(item => ({
      productType: item.productType,
      count: item._count,
      percentage: total > 0 ? (item._count / total) * 100 : 0,
    }));
  }

  async getSystemHealth() {
    const [
      totalUsers,
      activeUsers,
      totalLoans,
      recentAuditLogs,
      errorLogs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.loan.count(),
      this.prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          action: { in: ['LOGIN_FAILED', 'MFA_FAILED'] },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalLoans,
      last24hAuditLogs: recentAuditLogs,
      last24hErrors: errorLogs,
      status: errorLogs > 100 ? 'warning' : 'healthy',
    };
  }

  // ==========================================
  // BELLA ANALYTICS
  // ==========================================

  async getBellaAnalytics(tenantId: string, dateRange?: DateRange) {
    // This would track Bella usage - for now return mock data
    return {
      totalConversations: 0,
      averageSessionDuration: 0,
      topQuestions: [],
      satisfactionScore: 0,
      voiceVsChat: { voice: 0, chat: 0 },
    };
  }

  // ==========================================
  // QR ANALYTICS
  // ==========================================

  async getQrAnalytics(tenantId: string, dateRange?: DateRange) {
    const where: any = { tenantId };
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [
      totalCodes,
      activeCodes,
      totalScans,
      byPurpose,
    ] = await Promise.all([
      this.prisma.qRCode.count({ where }),
      this.prisma.qRCode.count({ where: { ...where, status: 'ACTIVE' } }),
      this.prisma.qRCodeScan.count({
        where: { qrCode: { tenantId } },
      }),
      this.prisma.qRCode.groupBy({
        by: ['purpose'],
        where,
        _count: true,
        _sum: { scanCount: true },
      }),
    ]);

    return {
      totalCodes,
      activeCodes,
      totalScans,
      byPurpose: byPurpose.map(item => ({
        purpose: item.purpose,
        codeCount: item._count,
        scanCount: item._sum.scanCount || 0,
      })),
    };
  }

  // ==========================================
  // TIME SERIES DATA
  // ==========================================

  async getLoanTrend(tenantId: string, period: 'day' | 'week' | 'month', count = 12) {
    const now = new Date();
    const data: Array<{ period: string; count: number; value: number }> = [];

    for (let i = count - 1; i >= 0; i--) {
      let startDate: Date;
      let endDate: Date;
      let label: string;

      if (period === 'day') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
        label = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'week') {
        startDate = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        label = `Week ${count - i}`;
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        label = startDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }

      const result = await this.prisma.loan.aggregate({
        where: {
          tenantId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        _count: true,
        _sum: { loanAmount: true },
      });

      data.push({
        period: label,
        count: result._count || 0,
        value: Number(result._sum.loanAmount || 0),
      });
    }

    return data;
  }
}

