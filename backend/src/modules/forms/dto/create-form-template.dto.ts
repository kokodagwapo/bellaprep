import { IsString, IsNotEmpty, IsEnum, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FormType } from '@prisma/client';

export class FormFieldDto {
  @IsString()
  id: string;

  @IsString()
  type: string; // 'text', 'number', 'select', 'date', 'boolean', 'multiselect'

  @IsString()
  label: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmpty()
  validation?: Record<string, any>;

  @IsObject()
  @IsNotEmpty()
  visibilityRules?: Record<string, any>;

  @IsArray()
  @IsNotEmpty()
  products?: string[];

  @IsString()
  @IsNotEmpty()
  placeholder?: string;

  @IsArray()
  @IsNotEmpty()
  options?: any[];
}

export class FormSectionDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[];

  @IsObject()
  @IsNotEmpty()
  visibilityRules?: Record<string, any>;

  @IsArray()
  @IsNotEmpty()
  products?: string[];
}

export class CreateFormTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FormType)
  type: FormType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormSectionDto)
  sections: FormSectionDto[];
}

