import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  borrowerId?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

