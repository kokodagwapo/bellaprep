import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService, CreateProductDto, UpdateProductDto, EligibilityCheckRequest } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Create a new loan product' })
  create(
    @Body() dto: CreateProductDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all loan products' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    return this.productService.findAll(tenantId, activeOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update product' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.update(id, tenantId, dto);
  }

  @Post(':id/toggle-active')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Toggle product active status' })
  toggleActive(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.toggleActive(id, tenantId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete product' })
  delete(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.delete(id, tenantId);
  }

  @Post('check-eligibility')
  @ApiOperation({ summary: 'Check eligibility for all products' })
  checkEligibility(
    @Body() request: EligibilityCheckRequest,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.checkEligibility(tenantId, request);
  }
}

