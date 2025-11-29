import { Injectable } from '@nestjs/common';

export interface EligibilityCheck {
  eligible: boolean;
  reasons: string[];
  missingFields: string[];
  warnings: string[];
}

@Injectable()
export class EligibilityService {
  /**
   * Check if a borrower is eligible for a product based on form data
   */
  checkEligibility(
    product: any,
    formData: Record<string, any>,
    loanPurpose?: string,
    propertyType?: string,
  ): EligibilityCheck {
    const result: EligibilityCheck = {
      eligible: true,
      reasons: [],
      missingFields: [],
      warnings: [],
    };

    // Check if product is enabled
    if (!product.enabled) {
      result.eligible = false;
      result.reasons.push('Product is not enabled');
      return result;
    }

    // Check property type eligibility
    if (propertyType && product.propertyTypes && Array.isArray(product.propertyTypes)) {
      if (!product.propertyTypes.includes(propertyType)) {
        result.eligible = false;
        result.reasons.push(`Property type "${propertyType}" is not supported for this product`);
        return result;
      }
    }

    // Check required fields
    if (product.requiredFields && Array.isArray(product.requiredFields)) {
      for (const field of product.requiredFields) {
        if (!this.hasField(formData, field)) {
          result.eligible = false;
          result.missingFields.push(field);
        }
      }

      if (result.missingFields.length > 0) {
        result.reasons.push(`Missing required fields: ${result.missingFields.join(', ')}`);
      }
    }

    // Evaluate conditional logic
    if (product.conditionalLogic && typeof product.conditionalLogic === 'object') {
      const logicResult = this.evaluateConditionalLogic(product.conditionalLogic, formData);
      if (!logicResult.passed) {
        result.eligible = false;
        result.reasons.push(...logicResult.reasons);
      }
      if (logicResult.warnings.length > 0) {
        result.warnings.push(...logicResult.warnings);
      }
    }

    // Check underwriting rules
    if (product.underwritingRules && typeof product.underwritingRules === 'object') {
      const rulesResult = this.evaluateUnderwritingRules(product.underwritingRules, formData);
      if (!rulesResult.passed) {
        result.eligible = false;
        result.reasons.push(...rulesResult.reasons);
      }
      if (rulesResult.warnings.length > 0) {
        result.warnings.push(...rulesResult.warnings);
      }
    }

    return result;
  }

  /**
   * Get eligible products for a borrower based on form data
   */
  getEligibleProducts(
    products: any[],
    formData: Record<string, any>,
    loanPurpose?: string,
    propertyType?: string,
  ): any[] {
    return products.filter((product) => {
      const check = this.checkEligibility(product, formData, loanPurpose, propertyType);
      return check.eligible;
    });
  }

  /**
   * Evaluate conditional logic rules
   */
  private evaluateConditionalLogic(
    logic: Record<string, any>,
    formData: Record<string, any>,
  ): { passed: boolean; reasons: string[]; warnings: string[] } {
    const result = { passed: true, reasons: [], warnings: [] };

    // Simple rule evaluation
    // Supports: { field: 'creditScore', operator: '>=', value: 640 }
    for (const [key, rule] of Object.entries(logic)) {
      if (typeof rule === 'object' && rule.operator) {
        const fieldValue = this.getFieldValue(formData, rule.field);
        const passed = this.evaluateRule(fieldValue, rule.operator, rule.value);

        if (!passed) {
          result.passed = false;
          result.reasons.push(`Condition not met: ${rule.field} ${rule.operator} ${rule.value}`);
        }
      }
    }

    return result;
  }

  /**
   * Evaluate underwriting rules
   */
  private evaluateUnderwritingRules(
    rules: Record<string, any>,
    formData: Record<string, any>,
  ): { passed: boolean; reasons: string[]; warnings: string[] } {
    const result = { passed: true, reasons: [], warnings: [] };

    for (const [key, rule] of Object.entries(rules)) {
      if (typeof rule === 'object' && rule.operator) {
        const fieldValue = this.getFieldValue(formData, rule.field);
        const passed = this.evaluateRule(fieldValue, rule.operator, rule.value);

        if (!passed) {
          if (rule.severity === 'warning') {
            result.warnings.push(`Warning: ${rule.message || key}`);
          } else {
            result.passed = false;
            result.reasons.push(rule.message || `Rule failed: ${key}`);
          }
        }
      }
    }

    return result;
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
      default:
        return false;
    }
  }

  /**
   * Check if form data has a field (supports nested paths)
   */
  private hasField(formData: Record<string, any>, fieldPath: string): boolean {
    const value = this.getFieldValue(formData, fieldPath);
    return value !== undefined && value !== null && value !== '';
  }

  /**
   * Get field value from form data (supports nested paths like 'borrower.creditScore')
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
}

