import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BellaService } from './bella.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('bella')
@Controller('bella')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BellaController {
  constructor(private readonly bellaService: BellaService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with Bella' })
  async chat(@Body() chatMessageDto: ChatMessageDto, @Request() req) {
    return this.bellaService.chat(chatMessageDto, req.user.tenantId);
  }

  @Post('voice/session')
  @ApiOperation({ summary: 'Create voice session' })
  async createVoiceSession(@Request() req) {
    return this.bellaService.createVoiceSession(req.user.tenantId);
  }

  @Post('voice/process')
  @ApiOperation({ summary: 'Process voice input' })
  async processVoice(@Body() body: { audioData: string; sessionId: string }) {
    const audioBuffer = Buffer.from(body.audioData, 'base64');
    return this.bellaService.processVoice(audioBuffer, body.sessionId);
  }

  @Post('voice/generate')
  @ApiOperation({ summary: 'Generate voice response' })
  async generateVoiceResponse(@Body() body: { text: string }) {
    const audioBuffer = await this.bellaService.generateVoiceResponse(body.text);
    return {
      audioData: audioBuffer.toString('base64'),
    };
  }
}

