import { IsEnum, IsOptional, IsObject, IsNumber, Min } from 'class-validator';
import { QRType } from '@prisma/client';

export class CreateQRDto {
  @IsEnum(QRType)
  type: QRType;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsNumber()
  @Min(1)
  @IsOptional()
  expiresInMinutes?: number; // Default 24 hours
}

