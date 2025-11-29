import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name?: string;

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

