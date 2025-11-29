import { Injectable } from '@nestjs/common';
import { RAGService } from './services/rag.service';
import { RealtimeService } from './services/realtime.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Injectable()
export class BellaService {
  constructor(
    private ragService: RAGService,
    private realtimeService: RealtimeService,
  ) {}

  async chat(chatMessageDto: ChatMessageDto, tenantId: string) {
    // Search knowledge base
    const knowledgeBase = await this.ragService.searchKnowledgeBase(
      chatMessageDto.message,
      tenantId,
    );

    // Generate response
    const response = await this.ragService.generateResponse(
      chatMessageDto.message,
      knowledgeBase,
      chatMessageDto.context,
    );

    return {
      response,
      knowledgeBaseUsed: knowledgeBase.length > 0,
    };
  }

  async createVoiceSession(tenantId: string) {
    return this.realtimeService.createSession(tenantId);
  }

  async processVoice(audioData: Buffer, sessionId: string) {
    return this.realtimeService.processVoice(audioData, sessionId);
  }

  async generateVoiceResponse(text: string) {
    return this.realtimeService.generateVoiceResponse(text);
  }
}

