import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsArray()
  @IsOptional()
  propertyTypes?: string[];

  @IsArray()
  @IsOptional()
  requiredFields?: string[];

  @IsObject()
  @IsOptional()
  conditionalLogic?: Record<string, any>;

  @IsArray()
  @IsOptional()
  checklists?: any[];

  @IsObject()
  @IsOptional()
  underwritingRules?: Record<string, any>;
}

