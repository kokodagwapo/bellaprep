import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  subdomain?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsObject()
  @IsOptional()
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

