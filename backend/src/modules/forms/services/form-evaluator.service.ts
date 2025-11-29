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
  /**
   * Evaluate form template and return visible sections/fields based on context
   */
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
      // Check section visibility
      const sectionVisible = this.evaluateVisibilityRules(
        section.visibilityRules,
        section.products,
        context,
      );

      if (!sectionVisible) {
        continue;
      }

      // Evaluate fields in section
      const evaluatedFields: EvaluatedField[] = [];
      for (const field of section.fields || []) {
        const fieldVisible = this.evaluateVisibilityRules(
          field.visibilityRules,
          field.products,
          context,
        );

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

  /**
   * Evaluate visibility rules
   */
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
    // If no rules, always visible
    if (!rules && !products) {
      return true;
    }

    // Check product filter
    if (products && products.length > 0) {
      if (!context.selectedProduct || !products.includes(context.selectedProduct)) {
        return false;
      }
    }

    // Evaluate conditional rules
    if (rules && typeof rules === 'object') {
      for (const [key, rule] of Object.entries(rules)) {
        if (typeof rule === 'object' && rule.operator) {
          const fieldValue = this.getFieldValue(context.formData || {}, rule.field);
          const passed = this.evaluateRule(fieldValue, rule.operator, rule.value);

          // AND logic - all rules must pass
          if (!passed) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Evaluate a single rule
   */
  private evaluateRule(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case '>=':
        return Number(value) >= Number(expected);
      case '<=':
        return Number(value) <= Number(expected);
      case '>':
        return Number(value) > Number(expected);
      case '<':
        return Number(value) < Number(expected);
      case '===':
      case '==':
        return value === expected || String(value) === String(expected);
      case '!==':
      case '!=':
        return value !== expected && String(value) !== String(expected);
      case 'includes':
        return Array.isArray(value) && value.includes(expected);
      case 'in':
        return Array.isArray(expected) && expected.includes(value);
      case 'exists':
        return value !== undefined && value !== null && value !== '';
      case 'notExists':
        return value === undefined || value === null || value === '';
      default:
        return true;
    }
  }

  /**
   * Get field value from form data (supports nested paths)
   */
  private getFieldValue(formData: Record<string, any>, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value = formData;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  /**
   * Validate form data against template
   */
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

        // Check required
        if (field.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
          fieldErrors.push(`${field.label} is required`);
        }

        // Check validation rules
        if (field.validation && fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
          if (field.validation.minLength && String(fieldValue).length < field.validation.minLength) {
            fieldErrors.push(`${field.label} must be at least ${field.validation.minLength} characters`);
          }

          if (field.validation.maxLength && String(fieldValue).length > field.validation.maxLength) {
            fieldErrors.push(`${field.label} must be at most ${field.validation.maxLength} characters`);
          }

          if (field.validation.min !== undefined && Number(fieldValue) < field.validation.min) {
            fieldErrors.push(`${field.label} must be at least ${field.validation.min}`);
          }

          if (field.validation.max !== undefined && Number(fieldValue) > field.validation.max) {
            fieldErrors.push(`${field.label} must be at most ${field.validation.max}`);
          }

          if (field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(String(fieldValue))) {
              fieldErrors.push(`${field.label} format is invalid`);
            }
          }
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

  private getFieldValue(formData: Record<string, any>, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value = formData;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }
}

