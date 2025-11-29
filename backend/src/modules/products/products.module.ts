import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { EligibilityService } from './services/eligibility.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, EligibilityService],
  exports: [ProductsService, EligibilityService],
})
export class ProductsModule {}

