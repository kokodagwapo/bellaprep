import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EligibilityService } from './services/eligibility.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private eligibilityService: EligibilityService,
  ) {}

  async create(createProductDto: CreateProductDto, tenantId: string) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        tenantId,
        propertyTypes: createProductDto.propertyTypes || [],
        requiredFields: createProductDto.requiredFields || [],
        conditionalLogic: createProductDto.conditionalLogic || {},
        checklists: createProductDto.checklists || [],
        underwritingRules: createProductDto.underwritingRules || {},
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.product.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, tenantId: string) {
    // Verify product belongs to tenant
    await this.findOne(id, tenantId);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string, tenantId: string) {
    // Verify product belongs to tenant
    await this.findOne(id, tenantId);

    await this.prisma.product.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Check eligibility for a product
   */
  async checkEligibility(
    productId: string,
    tenantId: string,
    formData: Record<string, any>,
    loanPurpose?: string,
    propertyType?: string,
  ) {
    const product = await this.findOne(productId, tenantId);
    return this.eligibilityService.checkEligibility(product, formData, loanPurpose, propertyType);
  }

  /**
   * Get eligible products for form data
   */
  async getEligibleProducts(
    tenantId: string,
    formData: Record<string, any>,
    loanPurpose?: string,
    propertyType?: string,
  ) {
    const products = await this.findAll(tenantId);
    return this.eligibilityService.getEligibleProducts(products, formData, loanPurpose, propertyType);
  }
}

