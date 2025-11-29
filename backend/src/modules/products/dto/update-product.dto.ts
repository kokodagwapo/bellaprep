import { IsString, IsBoolean, IsOptional, IsArray, IsObject } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

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

