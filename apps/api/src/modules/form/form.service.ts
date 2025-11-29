import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { FormType } from '@prisma/client';

export interface CreateFormTemplateDto {
  name: string;
  type: FormType;
  description?: string;
  sections?: any[];
}

export interface UpdateFormTemplateDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  sections?: any[];
}

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(tenantId: string, dto: CreateFormTemplateDto) {
    return this.prisma.formTemplate.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        description: dto.description,
        sections: dto.sections ? {
          create: dto.sections.map((section, idx) => ({
            name: section.name,
            description: section.description,
            displayOrder: idx,
            isCollapsible: section.isCollapsible ?? true,
            isCollapsedByDefault: section.isCollapsedByDefault ?? false,
            visibilityRules: section.visibilityRules || [],
            fields: section.fields ? {
              create: section.fields.map((field: any, fieldIdx: number) => ({
                key: field.key,
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                helpText: field.helpText,
                displayOrder: fieldIdx,
                required: field.required ?? false,
                validationRules: field.validationRules || [],
                options: field.options || [],
                visibilityRules: field.visibilityRules || [],
                productRules: field.productRules || [],
                width: field.width || 'FULL',
                dataPath: field.dataPath,
                autoFillSource: field.autoFillSource,
              })),
            } : undefined,
          })),
        } : undefined,
      },
      include: {
        sections: {
          include: { fields: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async findAllTemplates(tenantId: string, type?: FormType) {
    const where: any = { tenantId };
    if (type) where.type = type;

    return this.prisma.formTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sections: {
          include: { fields: true },
          orderBy: { displayOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
    });
  }

  async findTemplate(id: string, tenantId: string) {
    const template = await this.prisma.formTemplate.findFirst({
      where: { id, tenantId },
      include: {
        sections: {
          include: { 
            fields: { orderBy: { displayOrder: 'asc' } },
          },
          orderBy: { displayOrder: 'asc' },
        },
        products: { select: { id: true, name: true } },
      },
    });

    if (!template) {
      throw new NotFoundException('Form template not found');
    }

    return template;
  }

  async updateTemplate(id: string, tenantId: string, dto: UpdateFormTemplateDto) {
    await this.findTemplate(id, tenantId);

    // If sections are provided, delete existing and recreate
    if (dto.sections) {
      await this.prisma.formSection.deleteMany({
        where: { templateId: id },
      });

      await this.prisma.formTemplate.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          isActive: dto.isActive,
          sections: {
            create: dto.sections.map((section, idx) => ({
              name: section.name,
              description: section.description,
              displayOrder: idx,
              isCollapsible: section.isCollapsible ?? true,
              isCollapsedByDefault: section.isCollapsedByDefault ?? false,
              visibilityRules: section.visibilityRules || [],
              fields: section.fields ? {
                create: section.fields.map((field: any, fieldIdx: number) => ({
                  key: field.key,
                  label: field.label,
                  type: field.type,
                  placeholder: field.placeholder,
                  helpText: field.helpText,
                  displayOrder: fieldIdx,
                  required: field.required ?? false,
                  validationRules: field.validationRules || [],
                  options: field.options || [],
                  visibilityRules: field.visibilityRules || [],
                  productRules: field.productRules || [],
                  width: field.width || 'FULL',
                  dataPath: field.dataPath,
                  autoFillSource: field.autoFillSource,
                })),
              } : undefined,
            })),
          },
        },
      });
    } else {
      await this.prisma.formTemplate.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          isActive: dto.isActive,
        },
      });
    }

    return this.findTemplate(id, tenantId);
  }

  async deleteTemplate(id: string, tenantId: string) {
    const template = await this.findTemplate(id, tenantId);

    // Check if template is in use
    const productCount = await this.prisma.loanProduct.count({
      where: { formTemplateId: id },
    });

    if (productCount > 0) {
      throw new BadRequestException('Cannot delete template in use by products');
    }

    return this.prisma.formTemplate.delete({
      where: { id },
    });
  }

  async duplicateTemplate(id: string, tenantId: string, newName: string) {
    const template = await this.findTemplate(id, tenantId);

    return this.createTemplate(tenantId, {
      name: newName,
      type: template.type,
      description: template.description || undefined,
      sections: template.sections.map(section => ({
        name: section.name,
        description: section.description,
        isCollapsible: section.isCollapsible,
        isCollapsedByDefault: section.isCollapsedByDefault,
        visibilityRules: section.visibilityRules,
        fields: section.fields.map(field => ({
          key: field.key,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          helpText: field.helpText,
          required: field.required,
          validationRules: field.validationRules,
          options: field.options,
          visibilityRules: field.visibilityRules,
          productRules: field.productRules,
          width: field.width,
          dataPath: field.dataPath,
          autoFillSource: field.autoFillSource,
        })),
      })),
    });
  }

  async setDefaultTemplate(id: string, tenantId: string) {
    const template = await this.findTemplate(id, tenantId);

    // Unset existing default for this type
    await this.prisma.formTemplate.updateMany({
      where: { tenantId, type: template.type, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    return this.prisma.formTemplate.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  // Section operations
  async addSection(templateId: string, tenantId: string, sectionData: any) {
    await this.findTemplate(templateId, tenantId);

    const maxOrder = await this.prisma.formSection.findFirst({
      where: { templateId },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    return this.prisma.formSection.create({
      data: {
        templateId,
        name: sectionData.name,
        description: sectionData.description,
        displayOrder: (maxOrder?.displayOrder ?? -1) + 1,
        isCollapsible: sectionData.isCollapsible ?? true,
        isCollapsedByDefault: sectionData.isCollapsedByDefault ?? false,
        visibilityRules: sectionData.visibilityRules || [],
      },
      include: { fields: true },
    });
  }

  async updateSection(sectionId: string, tenantId: string, sectionData: any) {
    const section = await this.prisma.formSection.findUnique({
      where: { id: sectionId },
      include: { template: true },
    });

    if (!section || section.template.tenantId !== tenantId) {
      throw new NotFoundException('Section not found');
    }

    return this.prisma.formSection.update({
      where: { id: sectionId },
      data: {
        name: sectionData.name,
        description: sectionData.description,
        isCollapsible: sectionData.isCollapsible,
        isCollapsedByDefault: sectionData.isCollapsedByDefault,
        visibilityRules: sectionData.visibilityRules,
      },
      include: { fields: true },
    });
  }

  async deleteSection(sectionId: string, tenantId: string) {
    const section = await this.prisma.formSection.findUnique({
      where: { id: sectionId },
      include: { template: true },
    });

    if (!section || section.template.tenantId !== tenantId) {
      throw new NotFoundException('Section not found');
    }

    return this.prisma.formSection.delete({
      where: { id: sectionId },
    });
  }

  // Field operations
  async addField(sectionId: string, tenantId: string, fieldData: any) {
    const section = await this.prisma.formSection.findUnique({
      where: { id: sectionId },
      include: { template: true },
    });

    if (!section || section.template.tenantId !== tenantId) {
      throw new NotFoundException('Section not found');
    }

    const maxOrder = await this.prisma.formField.findFirst({
      where: { sectionId },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    return this.prisma.formField.create({
      data: {
        sectionId,
        key: fieldData.key,
        label: fieldData.label,
        type: fieldData.type,
        placeholder: fieldData.placeholder,
        helpText: fieldData.helpText,
        displayOrder: (maxOrder?.displayOrder ?? -1) + 1,
        required: fieldData.required ?? false,
        validationRules: fieldData.validationRules || [],
        options: fieldData.options || [],
        visibilityRules: fieldData.visibilityRules || [],
        productRules: fieldData.productRules || [],
        width: fieldData.width || 'FULL',
        dataPath: fieldData.dataPath,
        autoFillSource: fieldData.autoFillSource,
      },
    });
  }

  async updateField(fieldId: string, tenantId: string, fieldData: any) {
    const field = await this.prisma.formField.findUnique({
      where: { id: fieldId },
      include: { section: { include: { template: true } } },
    });

    if (!field || field.section.template.tenantId !== tenantId) {
      throw new NotFoundException('Field not found');
    }

    return this.prisma.formField.update({
      where: { id: fieldId },
      data: fieldData,
    });
  }

  async deleteField(fieldId: string, tenantId: string) {
    const field = await this.prisma.formField.findUnique({
      where: { id: fieldId },
      include: { section: { include: { template: true } } },
    });

    if (!field || field.section.template.tenantId !== tenantId) {
      throw new NotFoundException('Field not found');
    }

    return this.prisma.formField.delete({
      where: { id: fieldId },
    });
  }

  async reorderSections(templateId: string, tenantId: string, sectionIds: string[]) {
    await this.findTemplate(templateId, tenantId);

    await Promise.all(
      sectionIds.map((id, index) =>
        this.prisma.formSection.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    return this.findTemplate(templateId, tenantId);
  }

  async reorderFields(sectionId: string, tenantId: string, fieldIds: string[]) {
    const section = await this.prisma.formSection.findUnique({
      where: { id: sectionId },
      include: { template: true },
    });

    if (!section || section.template.tenantId !== tenantId) {
      throw new NotFoundException('Section not found');
    }

    await Promise.all(
      fieldIds.map((id, index) =>
        this.prisma.formField.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    return this.prisma.formSection.findUnique({
      where: { id: sectionId },
      include: { fields: { orderBy: { displayOrder: 'asc' } } },
    });
  }
}

