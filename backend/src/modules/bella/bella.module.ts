import { Module } from '@nestjs/common';
import { BellaService } from './bella.service';
import { BellaController } from './bella.controller';
import { RAGService } from './services/rag.service';
import { RealtimeService } from './services/realtime.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [BellaController],
  providers: [BellaService, RAGService, RealtimeService],
  exports: [BellaService],
})
export class BellaModule {}

