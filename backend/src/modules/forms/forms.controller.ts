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
import { FormsService } from './forms.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('forms')
@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Create a new form template (Admin only)' })
  async create(@Body() createFormTemplateDto: CreateFormTemplateDto, @Request() req) {
    return this.formsService.create(createFormTemplateDto, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all form templates for tenant' })
  async findAll(@Request() req, @Query('type') type?: string) {
    return this.formsService.findAll(req.user.tenantId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get form template by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.formsService.findOne(id, req.user.tenantId);
  }

  @Post(':id/evaluate')
  @ApiOperation({ summary: 'Evaluate form template for runtime rendering' })
  async evaluateForm(
    @Param('id') id: string,
    @Request() req,
    @Body() context: {
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
      formData?: Record<string, any>;
    },
  ) {
    return this.formsService.evaluateForm(id, req.user.tenantId, context);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate form data against template' })
  async validateFormData(
    @Param('id') id: string,
    @Request() req,
    @Body() body: {
      formData: Record<string, any>;
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
    },
  ) {
    return this.formsService.validateFormData(
      id,
      req.user.tenantId,
      body.formData,
      {
        selectedProduct: body.selectedProduct,
        loanPurpose: body.loanPurpose,
        propertyType: body.propertyType,
      },
    );
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Update form template (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateFormTemplateDto: UpdateFormTemplateDto,
    @Request() req,
  ) {
    return this.formsService.update(id, updateFormTemplateDto, req.user.tenantId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Delete form template (Admin only)' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.formsService.remove(id, req.user.tenantId);
  }
}

