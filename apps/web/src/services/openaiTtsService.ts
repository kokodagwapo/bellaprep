/**
 * OpenAI TTS Service for Bella
 * Uses latest GPT-5.1 compatible TTS with agentic, human-like female voice
 * Optimized for natural, conversational speech with emotional intelligence
 */

export const generateBellaSpeechOpenAI = async (text: string): Promise<string | null> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Validate API key format (OpenAI keys start with "sk-")
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.trim().length === 0) {
        console.warn("⚠️ OpenAI API key not found or not configured. Falling back to Gemini TTS.");
        return null;
    }
    
    // Check if key format looks valid (OpenAI keys start with "sk-")
    if (!apiKey.startsWith('sk-')) {
        console.error("❌ Invalid OpenAI API key format. Keys should start with 'sk-'. Current key starts with:", apiKey.substring(0, 10) + "...");
        console.error("   Please get a valid key from: https://platform.openai.com/api-keys");
        return null;
    }

    try {
        // Using latest TTS model with Nova voice - most human-like, agentic female voice
        // Nova is specifically designed for natural, conversational, emotionally intelligent speech
        console.log("🎤 Using latest OpenAI TTS (GPT-5.1 compatible) with 'nova' voice - agentic human-like female voice");
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'tts-1-hd', // Latest HD model - highest quality, most natural, GPT-5.1 compatible
                voice: 'nova', // Best female human-like voice - most natural, emotionally intelligent, conversational (GPT-5.1 compatible)
                input: text,
                speed: 1.0, // Natural conversational pace - optimal for human-like speech
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ OpenAI TTS API Error:', response.status, errorText);
            console.error('   This may be due to: invalid API key, rate limit, or network issue');
            return null;
        }

        // Get audio as blob, convert to base64 for consistency with Gemini format
        const audioBlob = await response.blob();
        console.log("✅ OpenAI TTS audio generated successfully");
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                // Remove data URL prefix (data:audio/mpeg;base64,)
                const base64 = base64data.includes(',') 
                    ? base64data.split(',')[1] 
                    : base64data;
                resolve(base64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(audioBlob);
        });
    } catch (error: any) {
        console.error("❌ Error generating OpenAI speech:", error);
        console.error("   Error details:", error.message || error);
        return null;
    }
};

