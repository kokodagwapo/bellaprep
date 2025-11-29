import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { QRCodePurpose, QRCodeStatus } from '@prisma/client';
import * as QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';

export interface CreateQRCodeDto {
  purpose: QRCodePurpose;
  name?: string;
  data?: any;
  expiresInMinutes?: number;
  maxScans?: number;
  loanId?: string;
}

@Injectable()
export class QRService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateQRCodeDto) {
    const code = uuid();
    const expiresAt = dto.expiresInMinutes
      ? new Date(Date.now() + dto.expiresInMinutes * 60 * 1000)
      : null;

    // Create signed token for the QR code
    const token = this.jwtService.sign(
      {
        code,
        tenantId,
        purpose: dto.purpose,
        data: dto.data,
        loanId: dto.loanId,
      },
      {
        expiresIn: dto.expiresInMinutes ? `${dto.expiresInMinutes}m` : '30d',
      }
    );

    // Generate QR code image as data URL
    const baseUrl = process.env.APP_URL || 'https://app.bellaprep.com';
    const qrUrl = `${baseUrl}/qr/${code}?token=${token}`;
    const qrImage = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    const qrCode = await this.prisma.qRCode.create({
      data: {
        tenantId,
        createdById: userId,
        code,
        token,
        purpose: dto.purpose,
        name: dto.name,
        data: dto.data || {},
        loanId: dto.loanId,
        expiresAt,
        maxScans: dto.maxScans,
      },
    });

    return {
      ...qrCode,
      qrImage,
      url: qrUrl,
    };
  }

  async findAll(tenantId: string, page = 1, limit = 20, purpose?: QRCodePurpose) {
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (purpose) where.purpose = purpose;

    const [items, total] = await Promise.all([
      this.prisma.qRCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          loan: { select: { id: true, status: true } },
          _count: { select: { scans: true } },
        },
      }),
      this.prisma.qRCode.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, tenantId: string) {
    const qrCode = await this.prisma.qRCode.findFirst({
      where: { id, tenantId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        loan: { select: { id: true, status: true } },
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!qrCode) {
      throw new NotFoundException('QR code not found');
    }

    return qrCode;
  }

  async scan(code: string, token: string, deviceInfo?: { userAgent?: string; ipAddress?: string }) {
    // Verify token
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid or expired QR code');
    }

    if (payload.code !== code) {
      throw new BadRequestException('Token mismatch');
    }

    const qrCode = await this.prisma.qRCode.findUnique({
      where: { code },
      include: { loan: true },
    });

    if (!qrCode) {
      throw new NotFoundException('QR code not found');
    }

    if (qrCode.status !== QRCodeStatus.ACTIVE) {
      throw new BadRequestException('QR code is no longer active');
    }

    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      await this.prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { status: QRCodeStatus.EXPIRED },
      });
      throw new BadRequestException('QR code has expired');
    }

    // Check max scans
    const scanCount = await this.prisma.qRCodeScan.count({
      where: { qrCodeId: qrCode.id },
    });

    if (qrCode.maxScans && scanCount >= qrCode.maxScans) {
      await this.prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { status: QRCodeStatus.MAX_SCANS_REACHED },
      });
      throw new BadRequestException('QR code has reached maximum scans');
    }

    // Record the scan
    await this.prisma.qRCodeScan.create({
      data: {
        qrCodeId: qrCode.id,
        userAgent: deviceInfo?.userAgent,
        ipAddress: deviceInfo?.ipAddress,
      },
    });

    // Update scan count
    await this.prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { scanCount: scanCount + 1 },
    });

    // Return action based on purpose
    return this.getActionForPurpose(qrCode);
  }

  private getActionForPurpose(qrCode: any) {
    switch (qrCode.purpose) {
      case QRCodePurpose.BORROWER_LOGIN:
        return {
          action: 'redirect',
          url: `/login?tenant=${qrCode.tenantId}`,
          message: 'Please log in to continue',
        };
      
      case QRCodePurpose.DOCUMENT_UPLOAD:
        return {
          action: 'redirect',
          url: `/loans/${qrCode.loanId}/documents/upload`,
          message: 'Upload your documents',
        };
      
      case QRCodePurpose.LOAN_APPLICATION:
        return {
          action: 'redirect',
          url: `/apply?tenant=${qrCode.tenantId}`,
          message: 'Start your loan application',
        };
      
      case QRCodePurpose.APPOINTMENT_CHECKIN:
        return {
          action: 'checkin',
          data: qrCode.data,
          message: 'You have been checked in',
        };
      
      case QRCodePurpose.LOAN_HANDOFF:
        return {
          action: 'redirect',
          url: `/loans/${qrCode.loanId}/handoff`,
          data: qrCode.data,
          message: 'Continue your loan application',
        };
      
      case QRCodePurpose.EVENT_REGISTRATION:
        return {
          action: 'redirect',
          url: `/events/${qrCode.data?.eventId}/register`,
          message: 'Register for the event',
        };
      
      default:
        return {
          action: 'info',
          data: qrCode.data,
        };
    }
  }

  async revoke(id: string, tenantId: string) {
    const qrCode = await this.findOne(id, tenantId);

    return this.prisma.qRCode.update({
      where: { id },
      data: { status: QRCodeStatus.REVOKED },
    });
  }

  async getStats(tenantId: string) {
    const [total, byPurpose, byStatus, recentScans] = await Promise.all([
      this.prisma.qRCode.count({ where: { tenantId } }),
      this.prisma.qRCode.groupBy({
        by: ['purpose'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.qRCode.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.qRCodeScan.findMany({
        where: { qrCode: { tenantId } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          qrCode: { select: { purpose: true, name: true } },
        },
      }),
    ]);

    const totalScans = await this.prisma.qRCodeScan.count({
      where: { qrCode: { tenantId } },
    });

    return {
      totalCodes: total,
      totalScans,
      byPurpose: byPurpose.reduce((acc, item) => {
        acc[item.purpose] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recentScans,
    };
  }

  async regenerate(id: string, tenantId: string, expiresInMinutes?: number) {
    const existing = await this.findOne(id, tenantId);

    // Create new QR code with same settings
    return this.create(tenantId, existing.createdById, {
      purpose: existing.purpose,
      name: `${existing.name} (regenerated)`,
      data: existing.data as any,
      expiresInMinutes,
      maxScans: existing.maxScans || undefined,
      loanId: existing.loanId || undefined,
    });
  }
}

