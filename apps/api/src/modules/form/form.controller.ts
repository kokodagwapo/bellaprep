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
import { FormService, CreateFormTemplateDto, UpdateFormTemplateDto } from './form.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FormType } from '@prisma/client';

@ApiTags('forms')
@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FormController {
  constructor(private formService: FormService) {}

  // Template operations
  @Post('templates')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Create a new form template' })
  createTemplate(
    @Body() dto: CreateFormTemplateDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.createTemplate(tenantId, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List all form templates' })
  findAllTemplates(
    @CurrentUser('tenantId') tenantId: string,
    @Query('type') type?: FormType,
  ) {
    return this.formService.findAllTemplates(tenantId, type);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get form template by ID' })
  findTemplate(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.findTemplate(id, tenantId);
  }

  @Patch('templates/:id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update form template' })
  updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateFormTemplateDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.updateTemplate(id, tenantId, dto);
  }

  @Delete('templates/:id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete form template' })
  deleteTemplate(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.deleteTemplate(id, tenantId);
  }

  @Post('templates/:id/duplicate')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Duplicate form template' })
  duplicateTemplate(
    @Param('id') id: string,
    @Body('name') name: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.duplicateTemplate(id, tenantId, name);
  }

  @Post('templates/:id/set-default')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Set template as default for its type' })
  setDefaultTemplate(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.setDefaultTemplate(id, tenantId);
  }

  // Section operations
  @Post('templates/:templateId/sections')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Add section to template' })
  addSection(
    @Param('templateId') templateId: string,
    @Body() sectionData: any,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.addSection(templateId, tenantId, sectionData);
  }

  @Patch('sections/:sectionId')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update section' })
  updateSection(
    @Param('sectionId') sectionId: string,
    @Body() sectionData: any,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.updateSection(sectionId, tenantId, sectionData);
  }

  @Delete('sections/:sectionId')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete section' })
  deleteSection(
    @Param('sectionId') sectionId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.deleteSection(sectionId, tenantId);
  }

  @Post('templates/:templateId/reorder-sections')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Reorder sections' })
  reorderSections(
    @Param('templateId') templateId: string,
    @Body('sectionIds') sectionIds: string[],
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.reorderSections(templateId, tenantId, sectionIds);
  }

  // Field operations
  @Post('sections/:sectionId/fields')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Add field to section' })
  addField(
    @Param('sectionId') sectionId: string,
    @Body() fieldData: any,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.addField(sectionId, tenantId, fieldData);
  }

  @Patch('fields/:fieldId')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update field' })
  updateField(
    @Param('fieldId') fieldId: string,
    @Body() fieldData: any,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.updateField(fieldId, tenantId, fieldData);
  }

  @Delete('fields/:fieldId')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete field' })
  deleteField(
    @Param('fieldId') fieldId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.deleteField(fieldId, tenantId);
  }

  @Post('sections/:sectionId/reorder-fields')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Reorder fields' })
  reorderFields(
    @Param('sectionId') sectionId: string,
    @Body('fieldIds') fieldIds: string[],
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.formService.reorderFields(sectionId, tenantId, fieldIds);
  }
}

