import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoanProductType, PropertyType, OccupancyType } from '@prisma/client';

export interface ProductEligibility {
  allowedPropertyTypes: PropertyType[];
  allowedOccupancyTypes: OccupancyType[];
  minLoanAmount: number;
  maxLoanAmount: number;
  maxLtv: number;
  maxCltv?: number;
  minCreditScore: number;
  maxDti: number;
  maxFrontEndDti?: number;
  requiresMilitaryStatus?: boolean;
  requiresFirstTimeBuyer?: boolean;
  allowsNonWarrantableCondo?: boolean;
  allowedStates?: string[];
  excludedStates?: string[];
  customRules?: any[];
}

export interface CreateProductDto {
  name: string;
  type: LoanProductType;
  description?: string;
  eligibility: ProductEligibility;
  requiredFields?: string[];
  requiredDocuments?: string[];
  order?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  eligibility?: Partial<ProductEligibility>;
  requiredFields?: string[];
  requiredDocuments?: string[];
  formTemplateId?: string;
  order?: number;
}

export interface EligibilityCheckRequest {
  loanAmount: number;
  propertyValue: number;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  creditScore: number;
  dti: number;
  isMilitary?: boolean;
  isFirstTimeBuyer?: boolean;
  state: string;
}

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateProductDto) {
    // Check if product name exists in tenant
    const existing = await this.prisma.loanProduct.findFirst({
      where: { tenantId, name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Product name already exists');
    }

    return this.prisma.loanProduct.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        description: dto.description,
        eligibility: dto.eligibility,
        requiredFields: dto.requiredFields || [],
        requiredDocuments: dto.requiredDocuments || [],
        displayOrder: dto.order || 0,
      },
    });
  }

  async findAll(tenantId: string, activeOnly = false) {
    const where: any = { tenantId };
    if (activeOnly) where.isActive = true;

    return this.prisma.loanProduct.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        formTemplate: { select: { id: true, name: true } },
        _count: { select: { loans: true } },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const product = await this.prisma.loanProduct.findFirst({
      where: { id, tenantId },
      include: {
        formTemplate: true,
        _count: { select: { loans: true } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, tenantId: string, dto: UpdateProductDto) {
    const product = await this.findOne(id, tenantId);

    // Merge eligibility if partial update
    let eligibility = product.eligibility;
    if (dto.eligibility) {
      eligibility = { ...product.eligibility as object, ...dto.eligibility };
    }

    return this.prisma.loanProduct.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
        eligibility,
        requiredFields: dto.requiredFields,
        requiredDocuments: dto.requiredDocuments,
        formTemplateId: dto.formTemplateId,
        displayOrder: dto.order,
      },
    });
  }

  async delete(id: string, tenantId: string) {
    const product = await this.findOne(id, tenantId);

    // Check if product has loans
    const loanCount = await this.prisma.loan.count({
      where: { productId: id },
    });

    if (loanCount > 0) {
      throw new BadRequestException('Cannot delete product with existing loans');
    }

    return this.prisma.loanProduct.delete({
      where: { id },
    });
  }

  async toggleActive(id: string, tenantId: string) {
    const product = await this.findOne(id, tenantId);

    return this.prisma.loanProduct.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  }

  async checkEligibility(tenantId: string, request: EligibilityCheckRequest) {
    const products = await this.findAll(tenantId, true);
    const results: Array<{
      productId: string;
      productName: string;
      eligible: boolean;
      reasons: string[];
      warnings: string[];
    }> = [];

    const ltv = (request.loanAmount / request.propertyValue) * 100;

    for (const product of products) {
      const eligibility = product.eligibility as ProductEligibility;
      const reasons: string[] = [];
      const warnings: string[] = [];
      let eligible = true;

      // Check property type
      if (eligibility.allowedPropertyTypes && 
          !eligibility.allowedPropertyTypes.includes(request.propertyType)) {
        eligible = false;
        reasons.push(`Property type ${request.propertyType} not allowed`);
      }

      // Check occupancy type
      if (eligibility.allowedOccupancyTypes &&
          !eligibility.allowedOccupancyTypes.includes(request.occupancyType)) {
        eligible = false;
        reasons.push(`Occupancy type ${request.occupancyType} not allowed`);
      }

      // Check loan amount
      if (request.loanAmount < eligibility.minLoanAmount) {
        eligible = false;
        reasons.push(`Loan amount below minimum of $${eligibility.minLoanAmount.toLocaleString()}`);
      }
      if (request.loanAmount > eligibility.maxLoanAmount) {
        eligible = false;
        reasons.push(`Loan amount exceeds maximum of $${eligibility.maxLoanAmount.toLocaleString()}`);
      }

      // Check LTV
      if (ltv > eligibility.maxLtv) {
        eligible = false;
        reasons.push(`LTV of ${ltv.toFixed(1)}% exceeds maximum of ${eligibility.maxLtv}%`);
      }

      // Check credit score
      if (request.creditScore < eligibility.minCreditScore) {
        eligible = false;
        reasons.push(`Credit score of ${request.creditScore} below minimum of ${eligibility.minCreditScore}`);
      }

      // Check DTI
      if (request.dti > eligibility.maxDti) {
        eligible = false;
        reasons.push(`DTI of ${request.dti.toFixed(1)}% exceeds maximum of ${eligibility.maxDti}%`);
      }

      // Check military requirement
      if (eligibility.requiresMilitaryStatus && !request.isMilitary) {
        eligible = false;
        reasons.push('Military status required');
      }

      // Check first-time buyer requirement
      if (eligibility.requiresFirstTimeBuyer && !request.isFirstTimeBuyer) {
        eligible = false;
        reasons.push('First-time buyer status required');
      }

      // Check state restrictions
      if (eligibility.excludedStates?.includes(request.state)) {
        eligible = false;
        reasons.push(`State ${request.state} not eligible`);
      }
      if (eligibility.allowedStates && 
          eligibility.allowedStates.length > 0 &&
          !eligibility.allowedStates.includes(request.state)) {
        eligible = false;
        reasons.push(`State ${request.state} not in allowed list`);
      }

      // Add warnings for borderline cases
      if (eligible) {
        if (ltv > eligibility.maxLtv * 0.9) {
          warnings.push('LTV is close to maximum - may require additional review');
        }
        if (request.dti > eligibility.maxDti * 0.9) {
          warnings.push('DTI is close to maximum - may require compensating factors');
        }
        if (request.creditScore < eligibility.minCreditScore + 20) {
          warnings.push('Credit score is close to minimum - may affect pricing');
        }
      }

      results.push({
        productId: product.id,
        productName: product.name,
        eligible,
        reasons,
        warnings,
      });
    }

    return {
      request,
      calculatedLtv: ltv,
      results,
      eligibleProducts: results.filter(r => r.eligible),
      ineligibleProducts: results.filter(r => !r.eligible),
    };
  }
}

