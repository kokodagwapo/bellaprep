import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { FormData } from '../types';
import { knowledgeBase } from '../bellaKnowledgeBase';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

const systemInstruction = `You are Bella, an AI mortgage assistant. Your personality is friendly, informal, conversational, and occasionally humorous. Your goal is to make the mortgage process feel less stressful and more human. You are an expert in all aspects of mortgage lending.

You MUST use the provided knowledge base to answer questions and guide the conversation. The knowledge base is a structured JSON containing information on your persona, loan types, emotional support phrases, and conversation flow rules.

When a user provides information relevant to a loan application, extract it. The user's input could be be text or a transcription of their voice.

Knowledge Base:
${JSON.stringify(knowledgeBase)}
`;

// New function for intelligent chat replies
export const getBellaChatReply = async (chatHistory: { role: 'user' | 'model', text: string }[]): Promise<string> => {
    const contents = chatHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: { systemInstruction: systemInstruction },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting Bella chat reply:", error);
        return "I'm having a little trouble connecting right now. Could you try asking that again in a moment?";
    }
};


// New function to extract data from conversational text
export const analyzeTextForData = async (text: string): Promise<Partial<FormData>> => {
    const prompt = `Analyze the following text from a user and extract any information that matches the loan application schema. Text: "${text}"`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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

// New function for TTS
export const generateBellaSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Female, US accent
                },
            },
        });
        if (!response.candidates) {
            return null;
        }
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
}


export const extractDataFromDocument = async (file: { data: string, mimeType: string }): Promise<Partial<FormData>> => {
    // Validate MIME type
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
    const normalizedMimeType = file.mimeType.toLowerCase();
    
    if (!validMimeTypes.some(type => normalizedMimeType.includes(type.split('/')[1]))) {
        throw new Error(`Unsupported file type: ${file.mimeType}. Please upload PDF, JPG, or PNG files.`);
    }

    // Validate base64 data exists
    if (!file.data || file.data.length === 0) {
        throw new Error("File data is empty. Please try uploading the file again.");
    }

    const documentPart = { inlineData: { data: file.data, mimeType: normalizedMimeType } };
    const textPart = { 
        text: `Analyze the attached document using OCR (Optical Character Recognition). The document could be:
- Driver's License or State ID
- W-2 Form (tax document)
- Paystub or Pay Statement
- Bank Statement

Extract ALL visible text and information, then identify and extract the following fields for a mortgage application:
1. Full Name: The person's complete legal name (first, middle if present, last)
2. Income: Primary gross income/wage amount. For W-2 forms, use the annual income. For paystubs, calculate monthly income by multiplying weekly/biweekly amounts appropriately.
3. Address: Current home/residential address (street, city, state, zip code)
4. Date of Birth (DOB): Birth date in MM/DD/YYYY format

Be thorough in reading all text on the document. If a field is not found, return null for that field. Only return data that you can clearly identify from the document.` 
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, documentPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fullName: { 
                            type: Type.STRING, 
                            description: "The full legal name of the person as it appears on the document. Return null if not found." 
                        },
                        income: { 
                            type: Type.NUMBER, 
                            description: "The primary gross income/wage. For W-2: annual income. For paystub: calculate monthly income. Return null if not found." 
                        },
                        borrowerAddress: { 
                            type: Type.STRING, 
                            description: "The person's full residential/home address including street, city, state, and zip code. Return null if not found." 
                        },
                        dob: { 
                            type: Type.STRING, 
                            description: "The person's date of birth in MM/DD/YYYY format. Return null if not found." 
                        }
                    },
                },
            },
        });

        if (!response.text) {
            throw new Error("No response from OCR service.");
        }

        const parsedData = JSON.parse(response.text.trim()) as Partial<FormData>;
        
        // Validate and clean the parsed data
        const cleanedData: Partial<FormData> = {};
        
        if (parsedData.fullName && typeof parsedData.fullName === 'string' && parsedData.fullName.trim() !== 'null') {
            cleanedData.fullName = parsedData.fullName.trim();
        }
        
        if (parsedData.income && typeof parsedData.income === 'number' && parsedData.income > 0) {
            cleanedData.income = parsedData.income;
        }
        
        if (parsedData.borrowerAddress && typeof parsedData.borrowerAddress === 'string' && parsedData.borrowerAddress.trim() !== 'null') {
            cleanedData.borrowerAddress = parsedData.borrowerAddress.trim();
        }
        
        if (parsedData.dob && typeof parsedData.dob === 'string' && parsedData.dob.trim() !== 'null') {
            cleanedData.dob = parsedData.dob.trim();
        }

        return cleanedData;
    } catch (error: any) {
        console.error("Error extracting data from document:", error);
        
        // Provide more specific error messages
        if (error.message?.includes('API key')) {
            throw new Error("API configuration error. Please check your API key.");
        } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
            throw new Error("Service temporarily unavailable. Please try again in a moment.");
        } else if (error.message?.includes('parse') || error.message?.includes('JSON')) {
            throw new Error("Could not parse document data. The document may be unclear or corrupted.");
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to analyze the document. Please ensure the file is clear and readable, then try again.");
        }
    }
};

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
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: systemInstruction },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating loan summary:", error);
    return "Thank you for your submission! Based on the information you provided, you're in a great position to move forward. We'll be in touch soon with your personalized options.";
  }
};