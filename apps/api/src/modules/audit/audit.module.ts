import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditGateway } from './audit.gateway';

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService, AuditGateway],
  exports: [AuditService],
})
export class AuditModule {}

