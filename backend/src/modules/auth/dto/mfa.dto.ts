import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyMfaDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class SetupMfaDto {
  @IsString()
  @IsNotEmpty()
  type: 'totp' | 'sms' | 'email';
}

export class EnableMfaDto {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

