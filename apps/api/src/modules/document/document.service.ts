import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DocumentService {
  private s3: S3;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async generateUploadUrl(
    tenantId: string,
    loanId: string,
    fileName: string,
    mimeType: string,
    documentType: DocumentType,
  ) {
    // Verify loan exists and belongs to tenant
    const loan = await this.prisma.loan.findFirst({
      where: { id: loanId, tenantId },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    const key = `${tenantId}/${loanId}/${uuid()}-${fileName}`;
    const bucket = process.env.S3_BUCKET || 'bellaprep-documents';

    const url = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
      Expires: 300, // 5 minutes
    });

    // Create document record with pending status
    const document = await this.prisma.document.create({
      data: {
        tenantId,
        loanId,
        name: fileName,
        type: documentType,
        mimeType,
        storageKey: key,
        storageBucket: bucket,
        status: DocumentStatus.PENDING,
      },
    });

    return {
      uploadUrl: url,
      documentId: document.id,
      key,
    };
  }

  async confirmUpload(documentId: string, tenantId: string, size: number) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: DocumentStatus.UPLOADED,
        size,
        uploadedAt: new Date(),
      },
    });
  }

  async findAll(tenantId: string, loanId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (loanId) where.loanId = loanId;

    const [items, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          loan: { select: { id: true } },
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.document.count({ where }),
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
    const document = await this.prisma.document.findFirst({
      where: { id, tenantId },
      include: {
        loan: { select: { id: true } },
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        verifiedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async generateDownloadUrl(id: string, tenantId: string) {
    const document = await this.findOne(id, tenantId);

    const url = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: document.storageBucket,
      Key: document.storageKey,
      Expires: 3600, // 1 hour
    });

    return { url, expiresIn: 3600 };
  }

  async verify(id: string, tenantId: string, userId: string) {
    const document = await this.findOne(id, tenantId);

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.VERIFIED,
        verifiedById: userId,
        verifiedAt: new Date(),
      },
    });
  }

  async reject(id: string, tenantId: string, userId: string, reason: string) {
    const document = await this.findOne(id, tenantId);

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: reason,
      },
    });
  }

  async delete(id: string, tenantId: string) {
    const document = await this.findOne(id, tenantId);

    // Delete from S3
    try {
      await this.s3.deleteObject({
        Bucket: document.storageBucket,
        Key: document.storageKey,
      }).promise();
    } catch (error) {
      console.error('Error deleting from S3:', error);
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }

  async updateOcrData(id: string, tenantId: string, ocrData: any) {
    await this.findOne(id, tenantId);

    return this.prisma.document.update({
      where: { id },
      data: {
        ocrData,
        ocrProcessedAt: new Date(),
      },
    });
  }
}

