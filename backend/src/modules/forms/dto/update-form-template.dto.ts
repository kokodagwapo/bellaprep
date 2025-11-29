import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FormSectionDto } from './create-form-template.dto';

export class UpdateFormTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormSectionDto)
  @IsOptional()
  sections?: FormSectionDto[];
}

