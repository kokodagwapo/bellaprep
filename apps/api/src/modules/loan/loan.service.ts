import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoanStatus, LoanPurpose, PropertyType, OccupancyType, TimelineEventType } from '@prisma/client';

export interface CreateLoanDto {
  productId: string;
  purpose: LoanPurpose;
  propertyStreet?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  propertyType?: PropertyType;
  occupancyType?: OccupancyType;
  propertyValue?: number;
  loanAmount?: number;
  downPayment?: number;
  formData?: any;
}

export interface UpdateLoanDto {
  status?: LoanStatus;
  loanOfficerId?: string;
  processorId?: string;
  underwriterId?: string;
  closerId?: string;
  propertyStreet?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  propertyType?: PropertyType;
  occupancyType?: OccupancyType;
  propertyValue?: number;
  loanAmount?: number;
  downPayment?: number;
  interestRate?: number;
  term?: number;
  formData?: any;
}

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, borrowerId: string, dto: CreateLoanDto) {
    // Validate product exists and belongs to tenant
    const product = await this.prisma.loanProduct.findFirst({
      where: { id: dto.productId, tenantId, isActive: true },
    });

    if (!product) {
      throw new BadRequestException('Invalid or inactive product');
    }

    const loan = await this.prisma.loan.create({
      data: {
        tenantId,
        borrowerId,
        productId: dto.productId,
        productType: product.type,
        purpose: dto.purpose,
        propertyStreet: dto.propertyStreet,
        propertyCity: dto.propertyCity,
        propertyState: dto.propertyState,
        propertyZip: dto.propertyZip,
        propertyType: dto.propertyType,
        occupancyType: dto.occupancyType,
        propertyValue: dto.propertyValue,
        loanAmount: dto.loanAmount,
        downPayment: dto.downPayment,
        formData: dto.formData || {},
        timeline: {
          create: {
            type: TimelineEventType.CREATED,
            title: 'Application Created',
            description: 'Loan application was created',
            userId: borrowerId,
          },
        },
      },
      include: {
        product: true,
        borrower: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return loan;
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 20,
    filters?: {
      status?: LoanStatus;
      productId?: string;
      borrowerId?: string;
      loanOfficerId?: string;
    },
  ) {
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (filters?.status) where.status = filters.status;
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.borrowerId) where.borrowerId = filters.borrowerId;
    if (filters?.loanOfficerId) where.loanOfficerId = filters.loanOfficerId;

    const [items, total] = await Promise.all([
      this.prisma.loan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, type: true } },
          borrower: { select: { id: true, firstName: true, lastName: true, email: true } },
          loanOfficer: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.loan.count({ where }),
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
    const loan = await this.prisma.loan.findFirst({
      where: { id, tenantId },
      include: {
        product: true,
        borrower: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        loanOfficer: { select: { id: true, firstName: true, lastName: true, email: true } },
        processor: { select: { id: true, firstName: true, lastName: true, email: true } },
        underwriter: { select: { id: true, firstName: true, lastName: true, email: true } },
        closer: { select: { id: true, firstName: true, lastName: true, email: true } },
        documents: true,
        timeline: { orderBy: { createdAt: 'desc' } },
        conditions: true,
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async update(id: string, tenantId: string, dto: UpdateLoanDto, userId?: string) {
    const loan = await this.findOne(id, tenantId);
    const oldStatus = loan.status;

    const updateData: any = {
      ...dto,
      updatedAt: new Date(),
    };

    // Handle status changes
    if (dto.status && dto.status !== oldStatus) {
      if (dto.status === LoanStatus.SUBMITTED) {
        updateData.submittedDate = new Date();
      } else if (dto.status === LoanStatus.APPROVED) {
        updateData.approvedDate = new Date();
      } else if (dto.status === LoanStatus.CLOSED) {
        updateData.closedDate = new Date();
      }
    }

    const updated = await this.prisma.loan.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        borrower: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // Add timeline event for status change
    if (dto.status && dto.status !== oldStatus) {
      await this.prisma.loanTimelineEvent.create({
        data: {
          loanId: id,
          type: TimelineEventType.STATUS_CHANGED,
          title: `Status changed to ${dto.status}`,
          description: `Status changed from ${oldStatus} to ${dto.status}`,
          userId,
          metadata: { oldStatus, newStatus: dto.status },
        },
      });
    }

    return updated;
  }

  async updateFormData(id: string, tenantId: string, formData: any, userId?: string) {
    await this.findOne(id, tenantId);

    return this.prisma.loan.update({
      where: { id },
      data: { formData, updatedAt: new Date() },
    });
  }

  async assign(
    id: string,
    tenantId: string,
    assignmentType: 'loanOfficer' | 'processor' | 'underwriter' | 'closer',
    assigneeId: string,
    userId?: string,
  ) {
    const loan = await this.findOne(id, tenantId);

    const fieldMap = {
      loanOfficer: 'loanOfficerId',
      processor: 'processorId',
      underwriter: 'underwriterId',
      closer: 'closerId',
    };

    const updated = await this.prisma.loan.update({
      where: { id },
      data: { [fieldMap[assignmentType]]: assigneeId },
    });

    // Add timeline event
    await this.prisma.loanTimelineEvent.create({
      data: {
        loanId: id,
        type: TimelineEventType.ASSIGNED,
        title: `${assignmentType} assigned`,
        userId,
        metadata: { assignmentType, assigneeId },
      },
    });

    return updated;
  }

  async addNote(id: string, tenantId: string, content: string, authorId: string, isPrivate = false) {
    await this.findOne(id, tenantId);

    const note = await this.prisma.loanNote.create({
      data: {
        loanId: id,
        content,
        authorId,
        isPrivate,
      },
    });

    // Add timeline event
    await this.prisma.loanTimelineEvent.create({
      data: {
        loanId: id,
        type: TimelineEventType.NOTE_ADDED,
        title: 'Note added',
        userId: authorId,
      },
    });

    return note;
  }

  async addCondition(id: string, tenantId: string, title: string, description?: string, category?: string) {
    await this.findOne(id, tenantId);

    const condition = await this.prisma.loanCondition.create({
      data: {
        loanId: id,
        title,
        description,
        category,
      },
    });

    await this.prisma.loanTimelineEvent.create({
      data: {
        loanId: id,
        type: TimelineEventType.CONDITION_ADDED,
        title: `Condition added: ${title}`,
      },
    });

    return condition;
  }

  async clearCondition(conditionId: string, tenantId: string, userId: string) {
    const condition = await this.prisma.loanCondition.findUnique({
      where: { id: conditionId },
      include: { loan: true },
    });

    if (!condition || condition.loan.tenantId !== tenantId) {
      throw new NotFoundException('Condition not found');
    }

    const updated = await this.prisma.loanCondition.update({
      where: { id: conditionId },
      data: {
        isCleared: true,
        clearedById: userId,
        clearedAt: new Date(),
      },
    });

    await this.prisma.loanTimelineEvent.create({
      data: {
        loanId: condition.loanId,
        type: TimelineEventType.CONDITION_CLEARED,
        title: `Condition cleared: ${condition.title}`,
        userId,
      },
    });

    return updated;
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.loan.delete({
      where: { id },
    });
  }

  async getStats(tenantId: string) {
    const [
      total,
      byStatus,
      byProduct,
      thisMonth,
    ] = await Promise.all([
      this.prisma.loan.count({ where: { tenantId } }),
      this.prisma.loan.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.loan.groupBy({
        by: ['productType'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.loan.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      total,
      thisMonth,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byProduct: byProduct.reduce((acc, item) => {
        acc[item.productType] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

