import { IsObject, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SubmitFormDto {
  @IsObject()
  @IsNotEmpty()
  formData: Record<string, any>;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  formTemplateId?: string;
}

