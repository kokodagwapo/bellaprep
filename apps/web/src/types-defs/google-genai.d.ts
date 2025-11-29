declare module '@google/genai' {
  export enum Type {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    OBJECT = 'object',
    ARRAY = 'array',
  }

  export enum Modality {
    AUDIO = 'audio',
    TEXT = 'text',
  }

  export interface Blob {
    data: string;
    mimeType: string;
  }

  export interface GenerateContentConfig {
    systemInstruction?: string;
    responseMimeType?: string;
    responseSchema?: {
      type: Type;
      properties?: Record<string, any>;
      description?: string;
    };
    responseModalities?: Modality[];
    speechConfig?: {
      voiceConfig?: {
        prebuiltVoiceConfig?: {
          voiceName: string;
        };
      };
    };
  }

  export interface GenerateContentRequest {
    model: string;
    contents: any;
    config?: GenerateContentConfig;
  }

  export interface GenerateContentResponse {
    text: string;
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: {
            data: string;
          };
          text?: string;
        }>;
      };
    }>;
  }

  export interface LiveServerMessage {
    serverContent?: {
      modelTurn?: {
        parts?: Array<{
          inlineData?: {
            data: string;
          };
        }>;
      };
      inputTranscription?: {
        text: string;
      };
      outputTranscription?: {
        text: string;
      };
      turnComplete?: boolean;
      interrupted?: boolean;
    };
  }

  export interface LiveSessionCallbacks {
    onopen?: () => void;
    onmessage?: (message: LiveServerMessage) => void | Promise<void>;
    onerror?: (error: ErrorEvent) => void;
    onclose?: (event: CloseEvent) => void;
  }

  export interface LiveConnectConfig {
    model: string;
    config?: {
      responseModalities?: Modality[];
      inputAudioTranscription?: Record<string, any>;
      outputAudioTranscription?: Record<string, any>;
    };
    callbacks?: LiveSessionCallbacks;
  }

  export interface LiveSession {
    sendRealtimeInput: (input: { media: Blob }) => void;
    close: () => void;
  }

  export interface Models {
    generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse>;
  }

  export interface Live {
    connect(config: LiveConnectConfig): Promise<LiveSession>;
  }

  export class GoogleGenAI {
    constructor(config: { apiKey?: string });
    models: Models;
    live: Live;
  }
}

