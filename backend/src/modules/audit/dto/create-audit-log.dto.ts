import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  event: string;

  @IsString()
  module: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  borrowerId?: string;
}

