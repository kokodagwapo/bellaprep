/**
 * OpenAI Chat Service for Bella
 * Uses GPT-4o for conversational chat responses
 * Complements Gemini for a hybrid AI approach
 */

import OpenAI from 'openai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const getBellaChatReplyOpenAI = async (
  chatHistory: ChatMessage[],
  systemInstruction?: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.trim().length === 0) {
    console.warn("⚠️ OpenAI API key not found. Falling back to Gemini.");
    throw new Error("OpenAI API key not configured");
  }
  
  if (!apiKey.startsWith('sk-')) {
    console.error("❌ Invalid OpenAI API key format. Keys should start with 'sk-'.");
    throw new Error("Invalid OpenAI API key format");
  }

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const defaultSystemInstruction = `You are Bella, an AI mortgage assistant powered by GPT-4o. Your personality is friendly, conversational, and helpful. You guide borrowers through the mortgage process with empathy and expertise. Always ask follow-up questions to keep the conversation engaging.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemInstruction || defaultSystemInstruction
      },
      ...chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[]
    ];

    console.log("🎯 Using OpenAI GPT-4o for chat response...");
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Latest GPT-4o model
      messages: messages,
      temperature: 0.7, // Balanced creativity and accuracy
      max_tokens: 500, // Reasonable response length
    });

    const reply = response.choices[0]?.message?.content;
    if (!reply) {
      throw new Error("No reply received from OpenAI");
    }

    console.log("✅ OpenAI chat response successful!");
    return reply;
  } catch (error: any) {
    console.error("❌ Error getting OpenAI chat reply:", error?.message || error);
    throw error;
  }
};

