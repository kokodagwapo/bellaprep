import React, { useState, FormEvent, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Paperclip, LayoutList, MessageSquare, X, ArrowLeft, Send, StopCircle, AiIcon } from "./icons";
import { cn } from "../lib/utils";
import type { FormData } from '../types';
import { decode, decodeAudioData, encode } from '../utils/audioUtils';
import { knowledgeBase } from "../bellaKnowledgeBase";
import { 
    getBellaChatReply, 
    analyzeTextForData,
    generateBellaSpeech,
    extractDataFromDocument 
} from '../services/geminiService';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from "@google/genai";
import VoiceAgentView from './VoiceAgentView';


type Sender = "bella" | "user";

interface Message {
  id: number;
  sender: Sender;
  text: string;
}

type ViewMode = "chat" | "form";

interface BellaChatWidgetProps {
    onClose: () => void;
    onDataExtracted: (data: Partial<FormData>) => void;
    formData: FormData;
}

function ChatBubble({ message }: { message: Message; [key: string]: any; }) {
  const isBella = message.sender === "bella";
  return (
    <div className={cn("flex items-end gap-2", isBella ? "" : "justify-end")}>
      {isBella && ( <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"><AiIcon className="h-4 w-4 text-primary"/></div> )}
      <div className={cn("max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm", isBella ? "bg-primary/10 text-foreground rounded-bl-sm" : "bg-card border border-border text-foreground rounded-br-sm")}>{message.text}</div>
    </div>
  );
}

const FormField = ({ label, value }: { label: string, value: string | number | boolean | null | undefined }) => {
    const displayValue = 
        value === null || value === undefined || value === ''
        ? ''
        : typeof value === 'boolean'
        ? value ? 'Yes' : 'No'
        : typeof value === 'number' && value > 0
        ? `$${value.toLocaleString()}`
        : String(value);

    if (!displayValue) return null;

    return (
        <div>
            <label className="block text-muted-foreground/80 font-medium text-[11px]">{label}</label>
            <p className="text-foreground text-xs mt-0.5 font-medium">{String(displayValue)}</p>
        </div>
    );
};


export default function BellaChatWidget({ onClose, onDataExtracted, formData }: BellaChatWidgetProps) {
  const [view, setView] = useState<ViewMode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Live conversation state
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const aiRef = useRef<GoogleGenAI | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const userInputTranscriptionRef = useRef('');
  const bellaOutputTranscriptionRef = useRef('');
  const hasInitialized = useRef(false);

  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY || import.meta.env.VITE_API_KEY || '' });
    outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    inputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    if (!hasInitialized.current) {
        hasInitialized.current = true;
        const greetings = knowledgeBase.chunks.filter(c => c.tags.includes("avatar_click"));
        const randomGreeting = greetings.length > 0
          ? greetings[Math.floor(Math.random() * greetings.length)].content
          : "Hi! I'm Bella. How can I help you today?";

        const initialMsg: Message = { id: 0, sender: "bella", text: randomGreeting };
        setMessages([initialMsg]);
        playAudio(randomGreeting);
    }

    return () => {
        stopLiveConversation();
        inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const playAudio = async (text: string) => {
    const audioContext = outputAudioContextRef.current;
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    
    const audioData = await generateBellaSpeech(text);
    if (audioData) {
      const buffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  };

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing || isLive) return;

    const userText = input.trim();
    const userMsg: Message = { id: nextId, sender: "user", text: userText };
    setMessages(prev => [...prev, userMsg]);
    setNextId(id => id + 1);
    setInput("");
    setIsProcessing(true);

    const typingMsg: Message = { id: nextId + 1, sender: "bella", text: "Bella is typing..." };
    setMessages(prev => [...prev, typingMsg]);

    const chatHistory = [...messages, userMsg].map(m => ({ role: m.sender === 'bella' ? 'model' : 'user' as 'user' | 'model', text: m.text }));

    const bellaReplyText = await getBellaChatReply(chatHistory);
    
    const [extractedData, audioData] = await Promise.all([
        analyzeTextForData(userText),
        generateBellaSpeech(bellaReplyText)
    ]);
    
    if (Object.keys(extractedData).length > 0) {
        onDataExtracted(extractedData);
    }

    const bellaMsg: Message = { id: nextId + 1, sender: "bella", text: bellaReplyText };
    
    // Replace "typing..." with the actual message
    setMessages(prev => [...prev.slice(0, -1), bellaMsg]);
    setNextId(id => id + 2);
    
    if (audioData && outputAudioContextRef.current) {
        if (outputAudioContextRef.current.state === 'suspended') {
            await outputAudioContextRef.current.resume();
        }
        const buffer = await decodeAudioData(decode(audioData), outputAudioContextRef.current, 24000, 1);
        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(outputAudioContextRef.current.destination);
        source.start();
    }

    setIsProcessing(false);
  };
  
  const stopLiveConversation = async () => {
    setIsLive(false);
    setIsConnecting(false);
    setLiveTranscription('');

    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close()).catch(console.error);
      sessionPromiseRef.current = null;
    }

    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
  };

  const startLiveConversation = async () => {
    if (!aiRef.current || !inputAudioContextRef.current || !outputAudioContextRef.current) return;
    
    setIsConnecting(true);
    setInput('');
    setLiveTranscription('Waiting for microphone...');

    try {
        if (inputAudioContextRef.current.state === 'suspended') await inputAudioContextRef.current.resume();
        if (outputAudioContextRef.current.state === 'suspended') await outputAudioContextRef.current.resume();

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        
        setLiveTranscription('Connecting to live session...');

        const inputCtx = inputAudioContextRef.current;
        
        // This sink node is necessary to keep the audio graph processing without creating an audible feedback loop.
        const sinkNode = inputCtx.createGain();
        sinkNode.gain.value = 0;
        sinkNode.connect(inputCtx.destination);
        
        mediaStreamSourceRef.current = inputCtx.createMediaStreamSource(stream);
        scriptProcessorRef.current = inputCtx.createScriptProcessor(4096, 1, 1);
        
        const createBlob = (data: Float32Array): Blob => {
            const l = data.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
                int16[i] = data[i] * 32768;
            }
            return {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
            };
        };

        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };

        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(sinkNode);
        
        sessionPromiseRef.current = aiRef.current.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
            callbacks: {
                onopen: () => {
                    setIsConnecting(false);
                    setIsLive(true);
                    setLiveTranscription('Listening...');
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContextRef.current && outputAudioContextRef.current.state === 'running') {
                        const outputCtx = outputAudioContextRef.current;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputCtx.destination);
                        source.addEventListener('ended', () => { audioSourcesRef.current.delete(source); });
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        audioSourcesRef.current.add(source);
                    }
                    
                    if (message.serverContent?.inputTranscription) {
                        userInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                    }
                    if (message.serverContent?.outputTranscription) {
                        bellaOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                    }

                    setLiveTranscription(userInputTranscriptionRef.current);

                    if (message.serverContent?.turnComplete) {
                        const userText = userInputTranscriptionRef.current.trim();
                        const bellaText = bellaOutputTranscriptionRef.current.trim();
                        let newMessages: Message[] = [];
                        let idCounter = nextId;

                        if (userText) {
                            newMessages.push({ id: idCounter++, sender: "user", text: userText });
                            analyzeTextForData(userText)
                                .then(onDataExtracted)
                                .catch(err => console.error("Error analyzing user transcription:", err));
                        }
                        if (bellaText) {
                            newMessages.push({ id: idCounter++, sender: "bella", text: bellaText });
                        }
                        if (newMessages.length > 0) {
                            setMessages(prev => [...prev, ...newMessages]);
                            setNextId(idCounter);
                        }
                        
                        userInputTranscriptionRef.current = '';
                        bellaOutputTranscriptionRef.current = '';
                        setLiveTranscription('Listening...');
                    }

                    if (message.serverContent?.interrupted) {
                        audioSourcesRef.current.forEach(source => source.stop());
                        audioSourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Live session error:', e);
                    const errorMsg: Message = { id: nextId, sender: "bella", text: "Sorry, there was a connection error. Please try again." };
                    setMessages(prev => [...prev, errorMsg]);
                    setNextId(id => id + 1);
                    stopLiveConversation();
                },
                onclose: (e: CloseEvent) => {
                    stopLiveConversation();
                }
            }
        });

    } catch (err) {
        console.error("Error starting live conversation:", err);
        const errorText = "I can't access your microphone. Please grant permission in your browser settings and try again.";
        setMessages(prev => [...prev, { id: nextId, sender: "bella", text: errorText }]);
        setNextId(id => id + 1);
        playAudio(errorText);
        stopLiveConversation();
    }
  };

  const handleLiveToggle = () => {
    if (isLive || isConnecting) {
      stopLiveConversation();
    } else {
      startLiveConversation();
    }
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
    const fileType = file.type.toLowerCase();
    const isValidType = validTypes.some(type => fileType.includes(type.split('/')[1]));

    if (!isValidType) {
        const errorMsg: Message = { id: nextId, sender: "bella", text: "I can only read PDF, JPG, or PNG files. Please try uploading a different file." };
        setMessages(prev => [...prev, errorMsg]);
        setNextId(id => id + 1);
        playAudio(errorMsg.text);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    if (file.size > maxFileSize) {
        const errorMsg: Message = { id: nextId, sender: "bella", text: "That file is too large (max 10MB). Please try a smaller file." };
        setMessages(prev => [...prev, errorMsg]);
        setNextId(id => id + 1);
        playAudio(errorMsg.text);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    setIsProcessing(true);
    const bellaThinkingMsg: Message = { id: nextId, sender: "bella", text: "Reading your document with OCR..." };
    setMessages(prev => [...prev, bellaThinkingMsg]);
    setNextId(id => id + 1);

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const result = reader.result as string;
            if (!result || !result.includes(',')) {
                throw new Error('Failed to read file');
            }
            const base64Data = result.split(',')[1];
            if (!base64Data) {
                throw new Error('Invalid file data');
            }

            const bellaProcessingMsg: Message = { id: nextId, sender: "bella", text: "Extracting information from your document..." };
            setMessages(prev => [...prev.slice(0, -1), bellaProcessingMsg]);
            setNextId(id => id + 1);

            const ocrData = await extractDataFromDocument({ 
                data: base64Data, 
                mimeType: file.type || 'application/octet-stream' 
            });
            
            const hasData = Object.keys(ocrData).length > 0;
            if (hasData) {
                onDataExtracted(ocrData);
                const extractedFields = Object.keys(ocrData).join(', ');
                const bellaMsg: Message = { 
                    id: nextId, 
                    sender: "bella", 
                    text: `Thanks! I've analyzed your document and extracted: ${extractedFields}. I've pre-filled this information for you. What should we tackle next?` 
                };
                setMessages(prev => [...prev.slice(0, -1), bellaMsg]);
                playAudio(bellaMsg.text);
            } else {
                const bellaMsg: Message = { 
                    id: nextId, 
                    sender: "bella", 
                    text: "I've processed your document, but couldn't find extractable information. Make sure the document is clear and readable, or try uploading a different file." 
                };
                setMessages(prev => [...prev.slice(0, -1), bellaMsg]);
                playAudio(bellaMsg.text);
            }
        };
        reader.onerror = () => {
            throw new Error('File reading error');
        };
        reader.readAsDataURL(file);
    } catch (error: any) {
        console.error("Error processing file in chat:", error);
        const errorMsg: Message = { 
            id: nextId, 
            sender: "bella", 
            text: error.message || "I had trouble reading that document. Please make sure it's clear and readable, then try again." 
        };
        setMessages(prev => [...prev.slice(0, -1), errorMsg]);
        playAudio(errorMsg.text);
    } finally {
        setIsProcessing(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 z-50">
      <div className="w-full h-full sm:w-[380px] sm:max-w-full rounded-none sm:rounded-3xl shadow-2xl bg-card border-border flex flex-col overflow-hidden text-foreground sm:h-[700px]">
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="relative h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/80 shadow-sm">
            <AiIcon className="h-6 w-6 text-white"/>
          </div>
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-1"><span className="font-semibold text-sm">Bella</span><span className="ml-1 rounded-full bg-white/15 px-2 py-[2px] text-[10px] font-medium">AI Assistant</span></div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Close"><X className="h-4 w-4 text-white/90" /></button>
        </div>

        <div className="relative flex-1 bg-background overflow-hidden">
          <AnimatePresence mode="wait">
            {isLive || isConnecting ? (
                <VoiceAgentView
                    key="voice-view"
                    isConnecting={isConnecting}
                    transcription={liveTranscription}
                    onStop={stopLiveConversation}
                />
            ) : view === "chat" ? (
              <motion.div key="chat-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {messages.map((msg) => ( <ChatBubble key={msg.id} message={msg} /> ))}
                   {isProcessing && messages[messages.length - 1]?.text.includes("typing") && (
                    <ChatBubble key="typing" message={{ id: 999, sender: "bella", text: "Bella is typing..." }} />
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSend} className="border-t border-border bg-card p-2.5">
                  <div className="flex items-end gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground" disabled={isLive || isConnecting}><Paperclip className="h-5 w-5" /></button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                    <div className="flex-1 flex items-center rounded-2xl border border-border bg-background px-3 py-1.5 min-h-[40px]">
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground resize-none"
                        placeholder="Type or use voice..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isLive || isConnecting}
                      />
                      <button type="button" onClick={handleLiveToggle} className={cn("ml-2 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-white", isLive ? "animate-pulse bg-red-500" : "bg-primary hover:bg-primary/90", isConnecting ? "bg-muted cursor-not-allowed" : "")} title={isLive ? "Stop conversation" : "Start live conversation"} disabled={isConnecting}>
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                    <button type="submit" className={cn("h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-medium text-primary-foreground transition-colors", (input.trim() && !isLive) ? "bg-primary hover:bg-primary/90" : "bg-muted cursor-not-allowed")} disabled={!input.trim() || isLive || isConnecting}><Send className="h-4 w-4"/></button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="form-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col h-full bg-card">
                 <div className="flex items-center justify-between px-4 py-3 border-b border-border text-foreground flex-shrink-0">
                    <button className="flex items-center gap-1 text-xs" onClick={() => setView("chat")}><ArrowLeft className="h-4 w-4" /><span>Back to Chat</span></button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <h2 className="text-sm font-semibold text-foreground text-center mb-4">Application Summary</h2>
                    <div className="space-y-4 text-xs border border-border bg-background rounded-xl p-4">
                        <FormField label="Full Name" value={formData.fullName} />
                        <FormField label="Email" value={formData.email} />
                        <FormField label="Phone Number" value={formData.phoneNumber} />
                        <FormField label="Annual Income" value={formData.income} />
                        <FormField label="Loan Purpose" value={formData.loanPurpose} />
                        <FormField label="Property Type" value={formData.propertyType} />
                        <FormField label="Property Use" value={formData.propertyUse} />
                        <FormField label="Purchase Price" value={formData.purchasePrice} />
                        <FormField label="Down Payment" value={formData.downPayment} />
                        <FormField label="Credit Score" value={formData.creditScore} />
                        <FormField label="Location" value={formData.location} />
                        <FormField label="First Time Buyer" value={formData.isFirstTimeBuyer} />
                        <FormField label="Military Service" value={formData.isMilitary} />
                    </div>
                    <p className="text-center text-muted-foreground text-[11px] mt-4">This form updates automatically as you chat with Bella.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isLive && !isConnecting && (
        <div className="flex items-stretch border-t border-border bg-card text-[11px] flex-shrink-0">
          <button type="button" onClick={() => setView("chat")} className={cn("flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5", view === "chat" ? "text-primary" : "text-muted-foreground")}><MessageSquare className="h-3.5 w-3.5" /><span>Chat</span></button>
          <button type="button" onClick={() => setView("form")} className={cn("flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 border-l border-border", view === "form" ? "text-primary" : "text-muted-foreground")}><LayoutList className="h-3.5 w-3.5" /><span>Forms</span></button>
        </div>
        )}
      </div>
    </motion.div>
  );
}