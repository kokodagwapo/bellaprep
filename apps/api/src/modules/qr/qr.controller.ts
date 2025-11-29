import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QRService, CreateQRCodeDto } from './qr.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QRCodePurpose } from '@prisma/client';

@ApiTags('qr')
@Controller('qr')
export class QRController {
  constructor(private qrService: QRService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new QR code' })
  create(
    @Body() dto: CreateQRCodeDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.qrService.create(tenantId, userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all QR codes' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('purpose') purpose?: QRCodePurpose,
  ) {
    return this.qrService.findAll(tenantId, +page, +limit, purpose);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get QR code statistics' })
  getStats(@CurrentUser('tenantId') tenantId: string) {
    return this.qrService.getStats(tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get QR code by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.qrService.findOne(id, tenantId);
  }

  @Post(':code/scan')
  @Public()
  @ApiOperation({ summary: 'Scan a QR code' })
  scan(
    @Param('code') code: string,
    @Query('token') token: string,
    @Req() req: Request,
  ) {
    return this.qrService.scan(code, token, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
  }

  @Post(':id/revoke')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a QR code' })
  revoke(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.qrService.revoke(id, tenantId);
  }

  @Post(':id/regenerate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Regenerate a QR code' })
  regenerate(
    @Param('id') id: string,
    @Body('expiresInMinutes') expiresInMinutes: number,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.qrService.regenerate(id, tenantId, expiresInMinutes);
  }
}

