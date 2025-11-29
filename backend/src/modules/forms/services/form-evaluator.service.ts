import { Injectable } from '@nestjs/common';

export interface EvaluatedForm {
  sections: EvaluatedSection[];
}

export interface EvaluatedSection {
  id: string;
  title: string;
  description?: string;
  visible: boolean;
  fields: EvaluatedField[];
}

export interface EvaluatedField {
  id: string;
  type: string;
  label: string;
  name: string;
  visible: boolean;
  required: boolean;
  validation?: Record<string, any>;
  placeholder?: string;
  options?: any[];
}

@Injectable()
export class FormEvaluatorService {
  evaluateForm(
    formTemplate: any,
    context: {
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
      formData?: Record<string, any>;
    },
  ): EvaluatedForm {
    const evaluatedSections: EvaluatedSection[] = [];

    for (const section of formTemplate.sections || []) {
      const sectionVisible = this.evaluateVisibilityRules(section.visibilityRules, section.products, context);

      if (!sectionVisible) {
        continue;
      }

      const evaluatedFields: EvaluatedField[] = [];
      for (const field of section.fields || []) {
        const fieldVisible = this.evaluateVisibilityRules(field.visibilityRules, field.products, context);

        if (!fieldVisible) {
          continue;
        }

        evaluatedFields.push({
          id: field.id,
          type: field.type,
          label: field.label,
          name: field.name,
          visible: true,
          required: field.validation?.required || false,
          validation: field.validation,
          placeholder: field.placeholder,
          options: field.options,
        });
      }

      evaluatedSections.push({
        id: section.id,
        title: section.title,
        description: section.description,
        visible: true,
        fields: evaluatedFields,
      });
    }

    return { sections: evaluatedSections };
  }

  private evaluateVisibilityRules(
    rules: Record<string, any> | undefined,
    products: string[] | undefined,
    context: {
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
      formData?: Record<string, any>;
    },
  ): boolean {
    if (!rules && !products) {
      return true;
    }

    if (products && products.length > 0) {
      if (!context.selectedProduct || !products.includes(context.selectedProduct)) {
        return false;
      }
    }

    return true;
  }

  private getFieldValue(formData: Record<string, any>, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value: any = formData;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  validateFormData(
    formTemplate: any,
    formData: Record<string, any>,
    context: {
      selectedProduct?: string;
      loanPurpose?: string;
      propertyType?: string;
    },
  ): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    const evaluatedForm = this.evaluateForm(formTemplate, { ...context, formData });

    for (const section of evaluatedForm.sections) {
      for (const field of section.fields) {
        const fieldValue = this.getFieldValue(formData, field.name);
        const fieldErrors: string[] = [];

        if (field.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
          fieldErrors.push(field.label + ' is required');
        }

        if (fieldErrors.length > 0) {
          errors[field.name] = fieldErrors;
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
