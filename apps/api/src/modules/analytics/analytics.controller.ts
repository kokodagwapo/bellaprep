import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // Lender Admin Dashboard
  @Get('lender-dashboard')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Get lender admin dashboard data' })
  getLenderDashboard(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getLenderDashboard(tenantId, dateRange);
  }

  // Super Admin Dashboard
  @Get('super-admin-dashboard')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get super admin dashboard data' })
  getSuperAdminDashboard(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getSuperAdminDashboard(dateRange);
  }

  // Loan Statistics
  @Get('loan-stats')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Get loan statistics' })
  getLoanStats(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getLoanStats(tenantId, dateRange);
  }

  // Pipeline by Status
  @Get('pipeline-status')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Get pipeline by status' })
  getPipelineByStatus(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getPipelineByStatus(tenantId, dateRange);
  }

  // Pipeline by Product
  @Get('pipeline-product')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Get pipeline by product type' })
  getPipelineByProduct(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getPipelineByProduct(tenantId, dateRange);
  }

  // LO Performance
  @Get('lo-performance')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Get loan officer performance' })
  getLoPerformance(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getLoPerformance(tenantId, dateRange);
  }

  // Document Statistics
  @Get('document-stats')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'PROCESSOR')
  @ApiOperation({ summary: 'Get document statistics' })
  getDocumentStats(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getDocumentStats(tenantId, dateRange);
  }

  // Conversion Metrics
  @Get('conversion-metrics')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Get conversion funnel metrics' })
  getConversionMetrics(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getConversionMetrics(tenantId, dateRange);
  }

  // Loan Trend
  @Get('loan-trend')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Get loan trend over time' })
  getLoanTrend(
    @CurrentUser('tenantId') tenantId: string,
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
    @Query('count') count = 12,
  ) {
    return this.analyticsService.getLoanTrend(tenantId, period, +count);
  }

  // Bella Analytics
  @Get('bella')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Get Bella AI assistant analytics' })
  getBellaAnalytics(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getBellaAnalytics(tenantId, dateRange);
  }

  // QR Analytics
  @Get('qr')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Get QR code analytics' })
  getQrAnalytics(
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getQrAnalytics(tenantId, dateRange);
  }

  // Tenant Usage (Super Admin only)
  @Get('tenant-usage')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get tenant usage statistics' })
  getTenantUsage(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getTenantUsage(dateRange);
  }

  // Product Adoption (Super Admin only)
  @Get('product-adoption')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get product adoption statistics' })
  getProductAdoption(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange = startDate && endDate
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;
    return this.analyticsService.getProductAdoption(dateRange);
  }

  // System Health (Super Admin only)
  @Get('system-health')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get system health metrics' })
  getSystemHealth() {
    return this.analyticsService.getSystemHealth();
  }
}

