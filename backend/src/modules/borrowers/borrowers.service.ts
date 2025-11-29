import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { LoanStatus } from '@prisma/client';

@Injectable()
export class BorrowersService {
  constructor(private prisma: PrismaService) {}

  async create(createBorrowerDto: CreateBorrowerDto, tenantId: string) {
    return this.prisma.borrower.create({
      data: {
        ...createBorrowerDto,
        tenantId,
        status: createBorrowerDto.status || LoanStatus.DRAFT,
        formData: createBorrowerDto.formData || {},
      },
      include: {
        product: true,
      },
    });
  }

  async findAll(tenantId: string, status?: LoanStatus) {
    return this.prisma.borrower.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            documents: true,
            plaidAccounts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const borrower = await this.prisma.borrower.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        product: true,
        documents: true,
        plaidAccounts: true,
      },
    });

    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    return borrower;
  }

  async update(id: string, updateBorrowerDto: UpdateBorrowerDto, tenantId: string) {
    // Verify borrower belongs to tenant
    await this.findOne(id, tenantId);

    return this.prisma.borrower.update({
      where: { id },
      data: updateBorrowerDto,
      include: {
        product: true,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    // Verify borrower belongs to tenant
    await this.findOne(id, tenantId);

    await this.prisma.borrower.delete({
      where: { id },
    });

    return { success: true };
  }

  async submitForm(id: string, submitFormDto: SubmitFormDto, tenantId: string) {
    const borrower = await this.findOne(id, tenantId);

    // Update form data and status
    const updated = await this.prisma.borrower.update({
      where: { id },
      data: {
        formData: {
          ...(borrower.formData as Record<string, any>),
          ...submitFormDto.formData,
        },
        status: LoanStatus.SUBMITTED,
        submittedAt: new Date(),
        ...(submitFormDto.productId && { productId: submitFormDto.productId }),
      },
      include: {
        product: true,
      },
    });

    return updated;
  }

  async updateStatus(id: string, status: LoanStatus, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.borrower.update({
      where: { id },
      data: { status },
      include: {
        product: true,
      },
    });
  }
}

