import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { FormEvaluatorService } from './services/form-evaluator.service';

@Injectable()
export class FormsService {
  constructor(
    private prisma: PrismaService,
    private formEvaluator: FormEvaluatorService,
  ) {}

  async create(createFormTemplateDto: CreateFormTemplateDto, tenantId: string) {
    return this.prisma.formTemplate.create({
      data: {
        name: createFormTemplateDto.name,
        type: createFormTemplateDto.type,
        tenantId,
        sections: createFormTemplateDto.sections as any,
      },
    });
  }

  async findAll(tenantId: string, type?: string) {
    return this.prisma.formTemplate.findMany({
      where: {
        tenantId,
        ...(type && { type: type as any }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const template = await this.prisma.formTemplate.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!template) {
      throw new NotFoundException('Form template not found');
    }

    return template;
  }

  async update(id: string, updateFormTemplateDto: UpdateFormTemplateDto, tenantId: string) {
    // Verify template belongs to tenant
    await this.findOne(id, tenantId);

    return this.prisma.formTemplate.update({
      where: { id },
      data: {
        ...updateFormTemplateDto,
        ...(updateFormTemplateDto.sections && {
          sections: updateFormTemplateDto.sections as any,
        }),
      },
    });
  }

  async remove(id: string, tenantId: string) {
    // Verify template belongs to tenant
    await this.findOne(id, tenantId);

    await this.prisma.formTemplate.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Evaluate form template for runtime rendering
   */
  async evaluateForm(
    id: string,
    tenantId: string,
    context: {
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
      formData?: Record<string, any>;
    },
  ) {
    const template = await this.findOne(id, tenantId);
    return this.formEvaluator.evaluateForm(template, context);
  }

  /**
   * Validate form data against template
   */
  async validateFormData(
    id: string,
    tenantId: string,
    formData: Record<string, any>,
    context: {
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
    },
  ) {
    const template = await this.findOne(id, tenantId);
    return this.formEvaluator.validateFormData(template, formData, context);
  }
}

