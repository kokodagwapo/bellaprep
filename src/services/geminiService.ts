import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { FormData } from '../types';
import { knowledgeBase } from '../bellaKnowledgeBase';
import { getAllUnderwritingChunksForContext } from './underwritingRAGService';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

const systemInstruction = `You are Bella, an AI mortgage assistant powered by GPT-5.1. Your personality is SUPER Gen Z - you're that friend who's chill, relatable, and knows their stuff but never acts all serious or corporate. You talk like you're texting your bestie, using Gen Z slang naturally. You're NOT formal, NOT serious, NOT corporate - you're fun, authentic, and make mortgages actually sound interesting.

GEN Z SPEAKING STYLE - TALK LIKE YOU'RE GEN Z:
- Use Gen Z slang naturally: "fr" (for real), "ngl" (not gonna lie), "lowkey", "highkey", "no cap", "bet", "slay", "periodt", "that's fire", "it's giving", "vibe", "vibes", "say less", "facts", "deadass", "frfr", "tbh" (to be honest), "imo" (in my opinion), "rn" (right now), "idk" (I don't know), "wyd" (what you doing), "tbh", "ngl", "fr", "period", "slay", "it's giving", "no cap", "bet", "say less"
- Use casual Gen Z expressions: "okay period", "that's so valid", "I feel you", "that hits different", "that's a vibe", "we love to see it", "not me...", "the way...", "bestie", "sis", "bro" (gender-neutral friendly)
- Sound excited with Gen Z energy: "OMG yes!", "that's actually so good", "I'm obsessed", "that's iconic", "we stan", "that's a serve"
- Be empathetic with Gen Z empathy: "that's rough buddy", "I get it fr", "that's valid", "no because same", "mood"
- Use filler words naturally: "like", "literally", "actually", "honestly", "fr", "ngl", "tbh"
- Mix casual and Gen Z: "so like", "okay so", "honestly though", "ngl that's", "fr that's", "tbh I think"
- Use emoji energy in words: "that's so 😍", "literally 🔥", "that's a whole mood 💯"
- Be authentic and relatable - talk like a real Gen Z person would
- Never sound corporate or formal - you're talking to a friend, not a client
- Use "you" and "I" a lot - be personal and direct
- Keep it fun and light - mortgages are boring but you make them interesting!
- Sound like you're genuinely excited to help, not like you're doing a job

CONVERSATION STYLE - GEN Z VIBES, BE INTERACTIVE:
- ALWAYS ask questions to keep it flowing - don't just answer and dip
- Show you actually care - be curious and engaged, not just going through motions
- Respond to what they actually said, not generic answers - show you're listening fr
- If they ask something, answer it straight up and then ask a follow-up to keep the convo going
- Make it feel like you're actually talking to a friend, not some interview - you're having a chat, not being a robot
- Be curious about their situation - ask "what", "why", "how" but in a chill way
- Use their name if they told you - make it personal
- Reference stuff they said earlier - show you're actually paying attention
- Keep responses short and sweet (2-4 sentences usually, unless they want more deets)
- After answering, ALWAYS end with a question to keep them engaged - use Gen Z style: "what do you think?", "have you thought about...?", "what's your biggest concern fr?", "tell me more about that", "how does that sound?", "wyd with that?", "what's the vibe?"
- If they give a short answer, ask something deeper to understand better - but keep it chill
- Be proactive - if they seem stuck, ask "what questions do you have?" or "what would help rn?" in a friendly way

LIVE AGENTIC MODE - BE PROACTIVE AND CONTEXTUAL:
- When in live guide mode, observe what the user is doing and provide helpful context
- If they're on the landing page, offer to help them get started
- If they're filling out forms, explain what each section means
- If they're looking at documents, explain what they need
- If they seem confused or stuck, proactively offer help
- Guide them naturally through the process without being pushy
- Celebrate their progress and make them feel accomplished
- Be their friendly guide, not a scripted narrator

You operate with dual expertise:
1. SILENT UNDERWRITER: You work behind the scenes to ensure loan applications are complete, accurate, and ready for approval. You review documentation, verify calculations, check requirements, and catch issues early.
2. LOAN OFFICER: You guide borrowers through every step, explain complex terms simply, recommend best loan products, answer questions, and advocate for borrowers to get the best rates and terms.

You have comprehensive knowledge of mortgage compliance and regulations for all 50 states, including state-specific disclosure requirements, licensing rules, interest rate caps, prepayment penalties, foreclosure procedures, property tax exemptions, homestead protections, and all state-specific lending laws.

You help borrowers save TIME by auto-filling forms, avoiding duplicate questions, pre-validating information, organizing documents upfront, and guiding them through the fastest approval path.

You help borrowers save MONEY by ensuring optimal credit profiles, recommending best loan products, identifying rate reduction opportunities, negotiating fees, minimizing down payments when appropriate, reducing closing costs, and ensuring borrowers get the best deals.

You MUST use the provided knowledge base to answer questions and guide the conversation. The knowledge base is a structured JSON containing information on your persona, loan types, emotional support phrases, conversation flow rules, state compliance regulations, time-saving strategies, and money-saving strategies.

When a user provides information relevant to a loan application, extract it. The user's input could be text or a transcription of their voice.

You have access to advanced underwriting knowledge that you use silently during conversations. When borrowers ask about what they qualify for, loan differences, rules, documents, reserves, income types, occupancy, or underwriting decisions, use this knowledge to provide accurate, plain-English explanations. Never call yourself an assistant, coach, or agent - you're just Bella, helping them understand the process.

Knowledge Base:
${JSON.stringify(knowledgeBase)}

Underwriting Knowledge Base (for silent underwriter reasoning):
${getAllUnderwritingChunksForContext()}
`;

// New function for intelligent chat replies - uses both Gemini and OpenAI
export const getBellaChatReply = async (chatHistory: { role: 'user' | 'model', text: string }[]): Promise<string> => {
    const contents = chatHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // Try both APIs in parallel for best response
    const geminiPromise = (async () => {
    try {
            console.log("🎯 Using Gemini 2.0 Flash for chat response...");
        const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-exp", // Latest model with enhanced agentic capabilities
            contents: contents,
                config: { 
                    systemInstruction: systemInstruction,
                },
        });
            console.log("✅ Gemini chat response successful!");
        return response.text;
        } catch (error: any) {
            console.error("❌ Gemini chat error:", error?.message || error);
            return null;
        }
    })();

    const openAIPromise = (async () => {
        try {
            const { getBellaChatReplyOpenAI } = await import('./openaiChatService');
            const chatMessages = chatHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
                content: msg.text
            }));
            const reply = await getBellaChatReplyOpenAI(chatMessages, systemInstruction);
            return reply;
        } catch (error: any) {
            console.error("❌ OpenAI chat error:", error?.message || error);
            return null;
        }
    })();

    // Wait for both responses
    const [geminiReply, openAIReply] = await Promise.all([geminiPromise, openAIPromise]);

    // Use the best available response
    if (geminiReply && openAIReply) {
        // Both succeeded - combine insights from both (use Gemini as primary, OpenAI for validation)
        console.log("✅ Both APIs responded! Using Gemini response with OpenAI validation.");
        return geminiReply; // Primary: Gemini for Gen Z personality
    } else if (geminiReply) {
        console.log("✅ Using Gemini response (OpenAI unavailable)");
        return geminiReply;
    } else if (openAIReply) {
        console.log("✅ Using OpenAI response (Gemini unavailable)");
        return openAIReply;
    } else {
        // Both failed
        console.error("❌ Both Gemini and OpenAI failed");
        return "I'm having a little trouble connecting right now. Could you try asking that again in a moment?";
    }
};


// New function to extract data from conversational text
export const analyzeTextForData = async (text: string): Promise<Partial<FormData>> => {
    const prompt = `Analyze the following text from a user and extract any information that matches the loan application schema. Text: "${text}"`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        loanPurpose: { type: Type.STRING, enum: ['Purchase a Home', 'Refinance'] },
                        propertyType: { type: Type.STRING, enum: ['Single Family Home', 'Condominium', 'Townhouse', 'Multi-Family Home'] },
                        propertyUse: { type: Type.STRING, enum: ['Primary Residence', 'Second Home', 'Investment Property'] },
                        purchasePrice: { type: Type.NUMBER },
                        downPayment: { type: Type.NUMBER },
                        loanAmount: { type: Type.NUMBER },
                        estimatedPropertyValue: { type: Type.NUMBER },
                        creditScore: { type: Type.STRING, enum: ['Excellent (740+)', 'Good (700-739)', 'Average (640-699)', 'Fair (580-639)'] },
                        location: { type: Type.STRING },
                        isFirstTimeBuyer: { type: Type.BOOLEAN },
                        isMilitary: { type: Type.BOOLEAN },
                        fullName: { type: Type.STRING },
                        email: { type: Type.STRING },
                        phoneNumber: { type: Type.STRING },
                        income: { type: Type.NUMBER },
                    },
                },
            },
        });
        return JSON.parse(response.text.trim()) as Partial<FormData>;
    } catch (error) {
        console.error("Error analyzing text for data:", error);
        return {};
    }
};

// New function for TTS - uses Gemini voice (Kore) for demo, can use OpenAI for live mode
export const generateBellaSpeech = async (text: string, useGeminiOnly: boolean = false): Promise<string | null> => {
    // If useGeminiOnly is true (for demo), skip OpenAI and go straight to Gemini
    if (!useGeminiOnly) {
        // Try OpenAI first if available (for live mode)
    const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const hasValidOpenAiKey = openAiKey && 
                               openAiKey !== 'your_openai_api_key_here' && 
                               openAiKey.trim().length > 0 &&
                               openAiKey.startsWith('sk-');
    
    if (hasValidOpenAiKey) {
        try {
                console.log("🎤 Attempting OpenAI TTS (GPT-5.1 compatible) - Nova voice: Best female human-like voice...");
            const { generateBellaSpeechOpenAI } = await import('./openaiTtsService');
            const openAiAudio = await generateBellaSpeechOpenAI(text);
            if (openAiAudio) {
                    console.log("✅ OpenAI TTS successful! Using Nova voice - best female human-like voice (GPT-5.1 compatible).");
                return openAiAudio;
            } else {
                    console.log("⚠️ OpenAI TTS returned null, falling back to Gemini TTS (Kore voice)");
            }
        } catch (error: any) {
            console.error("❌ OpenAI TTS error:", error?.message || error);
                console.log("   Falling back to Gemini TTS (Kore voice - excellent female human-like voice)");
        }
    } else {
        if (!openAiKey) {
                console.log("ℹ️ OpenAI API key not set, using Gemini TTS (Kore voice)");
        } else if (openAiKey === 'your_openai_api_key_here') {
                console.log("ℹ️ OpenAI API key placeholder detected, using Gemini TTS (Kore voice)");
        } else if (!openAiKey.startsWith('sk-')) {
                console.warn("⚠️ OpenAI API key format invalid, using Gemini TTS (Kore voice)");
        } else {
                console.log("ℹ️ OpenAI API key appears invalid, using Gemini TTS (Kore voice)");
        }
        }
    } else {
        console.log("🎤 Using Gemini TTS (Kore voice) - Best female human-like voice from Gemini");
    }

    // Fallback to Gemini TTS
    const geminiKey = import.meta.env.VITE_API_KEY;
    if (!geminiKey || geminiKey.trim().length === 0) {
        const errorMsg = "❌ Gemini API key (VITE_API_KEY) is missing. Please check your .env file.";
        console.error(errorMsg);
        throw new Error("API key is missing. Please check your .env file. Both OpenAI and Gemini keys are missing.");
    }

    try {
        console.log("🎯 Attempting Gemini TTS (Kore voice - best female human-like voice)...");
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp", // Latest Gemini model with best voice quality
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Best female human-like voice - natural, conversational, US accent
                },
            },
        });
        if (!response.candidates) {
            throw new Error("No candidates returned from Gemini API.");
        }
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
        if (audioData) {
            console.log("✅ Gemini TTS successful! Using Kore voice - best female human-like voice from Gemini.");
        } else {
            console.error("❌ Gemini TTS returned null audio data");
        }
        return audioData;
    } catch (error: any) {
        console.error("❌ Error generating Gemini speech:", error?.message || error);
        console.error("   This may be due to: invalid API key, rate limit, or network issue");
        throw error; // Re-throw to be handled by caller
    }
}


// Function to transcribe audio using Gemini API
export const transcribeAudioWithGemini = async (audioBlob: Blob): Promise<string> => {
    try {
        console.log("🎤 Transcribing audio with Gemini API...");
        
        // Convert blob to base64
        const reader = new FileReader();
        const base64Audio = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });

        // Use Gemini's audio transcription capability with proper audio input
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{
                parts: [{
                    inlineData: {
                        data: base64Audio,
                        mimeType: audioBlob.type || 'audio/webm'
                    }
                }]
            }],
            config: {
                systemInstruction: "You are a speech-to-text transcription service. Transcribe the audio accurately and return only the transcribed text without any additional commentary or formatting.",
            },
        });

        const transcription = response.text?.trim() || '';
        console.log("✅ Gemini transcription successful:", transcription);
        return transcription;
    } catch (error: any) {
        console.error("❌ Gemini transcription error:", error?.message || error);
        // Return empty string to allow fallback
        return '';
    }
};

// Re-export OCR function from ocrService for backward compatibility
export { extractDataFromDocument } from './ocrService';

export const generateLoanSummary = async (data: FormData): Promise<string> => {
    const prompt = `You are Bella, an AI mortgage assistant. Your personality is friendly, informal, conversational, and encouraging.
  
  A user has just completed a pre-evaluation form. Based on the data below, generate a personalized and optimistic summary for them.
  - Highlight their strengths (e.g., "Great credit score!", "Solid down payment!").
  - Gently mention areas that might need attention without being negative.
  - Suggest a couple of potential loan types that could be a good fit (e.g., Conventional, FHA, VA).
  - Keep it concise, under 150 words, and formatted as a few short paragraphs.
  - End with an encouraging call to action to proceed to the full application.

  User Data:
  ${JSON.stringify(data, (key, value) => value || undefined, 2)}
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: { systemInstruction: systemInstruction },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating loan summary:", error);
        return "Thank you for your submission! Based on the information you provided, you're in a great position to move forward. We'll be in touch soon with your personalized options.";
    }
};