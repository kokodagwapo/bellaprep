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
    const defaultSystemInstruction = `You are Bella, an AI mortgage assistant powered by GPT-5.1 (GPT-4o). You are friendly, empathetic, and conversational. Your goal is to help borrowers navigate the mortgage process with confidence and clarity.

PERSONALITY:
- Warm, approachable, and genuinely helpful
- Use simple, clear language - avoid jargon unless you explain it
- Show empathy and understanding for borrowers' concerns
- Be encouraging and supportive throughout their journey

CONVERSATION STYLE:
- ALWAYS ask follow-up questions to keep the conversation engaging
- Respond to what they actually said - show you're listening
- After answering, end with a question to keep them engaged
- Keep responses concise (2-4 sentences usually) unless they want more details
- Use "you" and "I" to make it personal and direct

EXPERTISE:
- Guide borrowers through mortgage applications, forms, and processes
- Explain complex mortgage terms in simple language
- Help them understand loan options, rates, and requirements
- Assist with form completion (like the 1003 form)
- Provide step-by-step guidance when needed

When helping with forms or navigation, be specific and actionable. For example, if they ask about the 1003 form, guide them to it and explain what they'll need.`;

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

    console.log("🎯 Using OpenAI GPT-5.1 (GPT-4o) for Bella chat response...");
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // GPT-5.1 compatible - Latest GPT-4o model
      messages: messages,
      temperature: 0.7, // Balanced creativity and accuracy
      max_tokens: 600, // Increased for more detailed responses
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

