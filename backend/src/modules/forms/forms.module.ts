import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { FormEvaluatorService } from './services/form-evaluator.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormsController],
  providers: [FormsService, FormEvaluatorService],
  exports: [FormsService, FormEvaluatorService],
})
export class FormsModule {}

