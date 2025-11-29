import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(createProductDto, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products for tenant' })
  async findAll(@Request() req) {
    return this.productsService.findAll(req.user.tenantId);
  }

  @Get('eligible')
  @ApiOperation({ summary: 'Get eligible products based on form data' })
  async getEligibleProducts(
    @Request() req,
    @Query('loanPurpose') loanPurpose?: string,
    @Query('propertyType') propertyType?: string,
    @Body() formData?: Record<string, any>,
  ) {
    return this.productsService.getEligibleProducts(
      req.user.tenantId,
      formData || {},
      loanPurpose,
      propertyType,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.productsService.findOne(id, req.user.tenantId);
  }

  @Post(':id/check-eligibility')
  @ApiOperation({ summary: 'Check eligibility for a product' })
  async checkEligibility(
    @Param('id') id: string,
    @Request() req,
    @Body() formData: Record<string, any>,
    @Query('loanPurpose') loanPurpose?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    return this.productsService.checkEligibility(
      id,
      req.user.tenantId,
      formData,
      loanPurpose,
      propertyType,
    );
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Update product (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.tenantId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(id, req.user.tenantId);
  }
}

