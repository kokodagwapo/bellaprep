import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { QRService } from './qr.service';
import { QRController } from './qr.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule, ConfigModule],
  controllers: [QRController],
  providers: [QRService],
  exports: [QRService],
})
export class QRModule {}

