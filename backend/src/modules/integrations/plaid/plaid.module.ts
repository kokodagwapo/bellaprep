import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaidService } from './plaid.service';
import { PlaidController } from './plaid.controller';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PlaidController],
  providers: [PlaidService],
  exports: [PlaidService],
})
export class PlaidModule {}

