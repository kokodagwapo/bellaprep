/**
 * OCR Service for Document Extraction
 * Primary: Google Vision API (via Gemini AI)
 * Backup: OpenAI Vision API
 */

import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { Type } from '@google/genai';
import type { FormData } from '../types';

interface OCRFile {
  data: string; // base64 encoded
  mimeType: string;
}

/**
 * Extract data from document using Google Vision API (Gemini) - Primary
 */
const extractWithGeminiVision = async (file: OCRFile): Promise<Partial<FormData>> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("Gemini API key not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const normalizedMimeType = file.mimeType.toLowerCase();

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
      model: "gemini-1.5-flash",
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
            },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini Vision API");
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
    console.error("Gemini Vision OCR error:", error);
    throw error;
  }
};

/**
 * Extract data from document using OpenAI Vision API - Backup
 */
const extractWithOpenAIVision = async (file: OCRFile): Promise<Partial<FormData>> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("OpenAI API key not configured");
  }

  if (!apiKey.startsWith('sk-')) {
    throw new Error("Invalid OpenAI API key format");
  }

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  // Convert base64 to data URL for OpenAI
  const dataUrl = `data:${file.mimeType};base64,${file.data}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an OCR (Optical Character Recognition) expert. Analyze documents and extract structured data. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the attached document using OCR. The document could be:
- Driver's License or State ID
- W-2 Form (tax document)
- Paystub or Pay Statement
- Bank Statement

Extract ALL visible text and information, then identify and extract the following fields for a mortgage application:
1. Full Name: The person's complete legal name (first, middle if present, last)
2. Income: Primary gross income/wage amount. For W-2 forms, use the annual income. For paystubs, calculate monthly income by multiplying weekly/biweekly amounts appropriately.
3. Address: Current home/residential address (street, city, state, zip code)
4. Date of Birth (DOB): Birth date in MM/DD/YYYY format

Be thorough in reading all text on the document. If a field is not found, return null for that field. Only return data that you can clearly identify from the document.

Respond with a JSON object with the following structure:
{
  "fullName": "string or null",
  "income": number or null,
  "borrowerAddress": "string or null",
  "dob": "string or null",
}`
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI Vision API");
    }

    const parsedData = JSON.parse(content) as Partial<FormData>;

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
    console.error("OpenAI Vision OCR error:", error);
    throw error;
  }
};

/**
 * Extract data from document with fallback logic
 * Primary: Google Vision API (Gemini)
 * Backup: OpenAI Vision API
 */
export const extractDataFromDocument = async (file: OCRFile): Promise<Partial<FormData>> => {
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

  // Try Gemini Vision first (primary)
  try {
    console.log("🔍 Attempting OCR with Google Vision API (Gemini)...");
    const result = await extractWithGeminiVision(file);
    console.log("✅ Successfully extracted data using Google Vision API");
    return result;
  } catch (primaryError: any) {
    console.warn("⚠️ Google Vision API failed, trying OpenAI Vision API as backup...", primaryError.message);
    
    // Fallback to OpenAI Vision
    try {
      const result = await extractWithOpenAIVision(file);
      console.log("✅ Successfully extracted data using OpenAI Vision API (backup)");
      return result;
    } catch (backupError: any) {
      console.error("❌ Both OCR services failed");
      
      // Provide more specific error messages
      if (primaryError.message?.includes('API key') || backupError.message?.includes('API key')) {
        throw new Error("API configuration error. Please check your API keys.");
      } else if (primaryError.message?.includes('quota') || primaryError.message?.includes('rate limit') || 
                 backupError.message?.includes('quota') || backupError.message?.includes('rate limit')) {
        throw new Error("Service temporarily unavailable. Please try again in a moment.");
      } else if (primaryError.message?.includes('parse') || primaryError.message?.includes('JSON') ||
                 backupError.message?.includes('parse') || backupError.message?.includes('JSON')) {
        throw new Error("Could not parse document data. The document may be unclear or corrupted.");
      } else {
        const errorMsg = backupError.message || primaryError.message || "Failed to analyze the document";
        throw new Error(`OCR failed: ${errorMsg}. Please ensure the file is clear and readable, then try again.`);
      }
    }
  }
};

