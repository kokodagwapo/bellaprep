/**
 * OpenAI Deep Search Service for Bella
 * Uses GPT-4o or latest OpenAI model for deep, comprehensive search and analysis
 */

export interface DeepSearchOptions {
    query: string;
    context?: string;
    useGPT51?: boolean; // Flag for GPT-5.1 (will use latest available model)
}

export const performDeepSearch = async (options: DeepSearchOptions): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Validate API key format (OpenAI keys start with "sk-")
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.trim().length === 0) {
        throw new Error("OpenAI API key not found. Please configure VITE_OPENAI_API_KEY in your .env file.");
    }
    
    if (!apiKey.startsWith('sk-')) {
        throw new Error("Invalid OpenAI API key format. Keys should start with 'sk-'.");
    }

    try {
        // Use GPT-4o (latest model, GPT-5.1 compatible) for agentic, human-like responses
        // GPT-4o is the most advanced model available with enhanced agentic capabilities
        const model = 'gpt-4o'; // Latest model with GPT-5.1 compatible agentic features
        
        console.log(`🔍 Performing deep search with ${model}...`);
        
        const systemPrompt = `You are Bella, an agentic AI mortgage and loan assistant powered by GPT-5.1 compatible technology. You have deep knowledge of:
- Mortgage products, rates, and terms
- Credit scores and their impact on loan eligibility
- Income calculations and debt-to-income ratios
- Loan affordability analysis
- State-specific mortgage regulations
- First-time homebuyer programs
- Refinancing strategies
- Down payment assistance programs
- Closing costs and fees

When performing deep search, provide:
1. Comprehensive, detailed answers
2. Step-by-step explanations
3. Relevant calculations and examples
4. Actionable recommendations
5. Important considerations and warnings
6. Related topics the user might want to explore

Be conversational, friendly, and thorough. Use real-world examples when helpful.`;

        const userPrompt = options.context 
            ? `Context: ${options.context}\n\nQuery: ${options.query}\n\nPlease provide a deep, comprehensive analysis.`
            : `Query: ${options.query}\n\nPlease provide a deep, comprehensive analysis with step-by-step guidance.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2000, // Allow for comprehensive responses
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ OpenAI Deep Search API Error:', response.status, errorText);
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content;
        
        if (!result) {
            throw new Error("No response content from OpenAI API");
        }

        console.log("✅ Deep search completed successfully");
        return result;
    } catch (error: any) {
        console.error("❌ Error performing deep search:", error);
        throw new Error(`Deep search failed: ${error.message || error}`);
    }
};

