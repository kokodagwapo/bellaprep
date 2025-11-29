import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { QRCleanupTask } from './tasks/qr-cleanup.task';
import { AuditArchiveTask } from './tasks/audit-archive.task';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [QRCleanupTask, AuditArchiveTask],
})
export class SchedulerModule {}

