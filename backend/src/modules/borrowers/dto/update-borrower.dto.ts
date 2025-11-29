import { IsEmail, IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class UpdateBorrowerDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsObject()
  @IsOptional()
  formData?: Record<string, any>;

  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;
}

