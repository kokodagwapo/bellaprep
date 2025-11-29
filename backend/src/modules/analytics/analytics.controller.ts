import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('pipeline')
  @ApiOperation({ summary: 'Get pipeline metrics' })
  async getPipelineMetrics(@Request() req) {
    return this.analyticsService.getPipelineMetrics(req.user.tenantId);
  }

  @Get('funnel')
  @ApiOperation({ summary: 'Get borrower funnel analytics' })
  async getFunnelAnalytics(@Request() req, @Query('days') days?: number) {
    return this.analyticsService.getFunnelAnalytics(req.user.tenantId, days ? Number(days) : 30);
  }

  @Get('lo-performance')
  @ApiOperation({ summary: 'Get LO performance metrics' })
  async getLOPerformance(@Request() req, @Query('days') days?: number) {
    return this.analyticsService.getLOPerformance(req.user.tenantId, days ? Number(days) : 30);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get document completion stats' })
  async getDocumentCompletionStats(@Request() req) {
    return this.analyticsService.getDocumentCompletionStats(req.user.tenantId);
  }

  @Get('bella-usage')
  @ApiOperation({ summary: 'Get Bella usage statistics' })
  async getBellaUsageStats(@Request() req, @Query('days') days?: number) {
    return this.analyticsService.getBellaUsageStats(req.user.tenantId, days ? Number(days) : 30);
  }

  @Get('super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get super admin statistics' })
  async getSuperAdminStats() {
    return this.analyticsService.getSuperAdminStats();
  }
}

