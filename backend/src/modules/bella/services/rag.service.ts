import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class RAGService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  /**
   * Search knowledge base (simplified - in production would use vector DB)
   */
  async searchKnowledgeBase(query: string, tenantId: string): Promise<string[]> {
    // In production, this would query a vector database (Pinecone, Weaviate, etc.)
    // For now, return empty array
    return [];
  }

  /**
   * Generate RAG-enhanced response
   */
  async generateResponse(
    message: string,
    knowledgeBase: string[],
    context?: Record<string, any>,
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(knowledgeBase, context);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
  }

  private buildSystemPrompt(knowledgeBase: string[], context?: Record<string, any>): string {
    let prompt = `You are Bella, a helpful mortgage loan assistant. You help borrowers understand the loan process, answer questions about forms, and provide guidance.

Knowledge Base:
${knowledgeBase.length > 0 ? knowledgeBase.join('\n') : 'No specific knowledge base entries found.'}

`;

    if (context) {
      prompt += `Current Context:\n${JSON.stringify(context, null, 2)}\n\n`;
    }

    prompt += `Be friendly, empathetic, and helpful. Provide accurate information based on the knowledge base.`;

    return prompt;
  }
}

