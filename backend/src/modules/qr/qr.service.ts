import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateQRDto } from './dto/create-qr.dto';
import { QRType } from '@prisma/client';
import * as QRCode from 'qrcode';

@Injectable()
export class QRService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(createQRDto: CreateQRDto, tenantId: string) {
    const expiresInMinutes = createQRDto.expiresInMinutes || 24 * 60; // Default 24 hours
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    // Generate JWT token for QR code
    const token = this.jwtService.sign(
      {
        tenantId,
        type: createQRDto.type,
        metadata: createQRDto.metadata,
        qrId: 'temp', // Will be updated after creation
      },
      {
        expiresIn: `${expiresInMinutes}m`,
      },
    );

    // Create QR code record
    const qrCode = await this.prisma.qRCode.create({
      data: {
        tenantId,
        type: createQRDto.type,
        token,
        expiresAt,
        metadata: createQRDto.metadata || {},
        scans: [],
      },
    });

    // Update token with actual QR ID
    const finalToken = this.jwtService.sign(
      {
        qrId: qrCode.id,
        tenantId,
        type: createQRDto.type,
        metadata: createQRDto.metadata,
      },
      {
        expiresIn: `${expiresInMinutes}m`,
      },
    );

    // Update QR code with final token
    const updated = await this.prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { token: finalToken },
    });

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(finalToken, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
    });

    return {
      ...updated,
      qrCodeImage: qrCodeDataURL,
    };
  }

  async findAll(tenantId: string) {
    return this.prisma.qRCode.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const qrCode = await this.prisma.qRCode.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!qrCode) {
      throw new NotFoundException('QR code not found');
    }

    return qrCode;
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const qrCode = await this.prisma.qRCode.findUnique({
        where: { token },
      });

      if (!qrCode) {
        throw new NotFoundException('QR code not found');
      }

      if (new Date() > qrCode.expiresAt) {
        throw new BadRequestException('QR code has expired');
      }

      return {
        valid: true,
        qrCode,
        payload,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  async scanToken(
    token: string,
    scanData: {
      ipAddress?: string;
      userAgent?: string;
      userId?: string;
      borrowerId?: string;
    },
  ) {
    const validation = await this.validateToken(token);

    if (!validation.valid) {
      throw new BadRequestException('Invalid QR code token');
    }

    const qrCode = validation.qrCode;
    const scans = (qrCode.scans as any[]) || [];

    // Add scan event
    scans.push({
      timestamp: new Date().toISOString(),
      ...scanData,
    });

    // Update QR code with scan
    return this.prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { scans },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.qRCode.delete({
      where: { id },
    });

    return { success: true };
  }
}

