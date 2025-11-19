import React, { useState, FormEvent, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Paperclip, LayoutList, MessageSquare, X, ArrowLeft, Send, StopCircle, AiIcon } from "./icons";
import { cn } from "../lib/utils";
import type { FormData } from '../types';
import { decode, decodeAudioData, encode } from '../utils/audioUtils';
import { knowledgeBase } from "../bellaKnowledgeBase";
import { getRequirements } from "../data/requirements";
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
    <div className={cn("flex items-end gap-3", isBella ? "" : "justify-end")}>
      {isBella && ( 
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm">
          <AiIcon className="h-4 w-4 text-primary"/>
        </div> 
      )}
      <div className={cn(
        "max-w-[75%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-sm backdrop-blur-sm transition-all duration-200",
        isBella 
          ? "bg-primary/8 text-foreground rounded-bl-md border border-primary/10" 
          : "bg-white/80 text-foreground rounded-br-md border border-border/50 shadow-sm"
      )}>
        {message.text}
      </div>
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
    aiRef.current = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });
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
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 z-50">
      <div className="w-full h-full sm:w-[400px] sm:max-w-full rounded-none sm:rounded-[28px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] bg-white/95 backdrop-blur-xl border border-border/50 flex flex-col overflow-hidden text-foreground sm:h-[720px]">
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="relative h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <AiIcon className="h-5 w-5 text-white"/>
          </div>
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] tracking-tight">Bella</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium border border-white/25">AI Assistant</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-95" aria-label="Close">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="relative flex-1 bg-white/40 backdrop-blur-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {isLive || isConnecting ? (
                <VoiceAgentView
                    key="voice-view"
                    isConnecting={isConnecting}
                    transcription={liveTranscription}
                    onStop={stopLiveConversation}
                />
            ) : view === "chat" ? (
              <motion.div key="chat-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {messages.map((msg) => ( <ChatBubble key={msg.id} message={msg} /> ))}
                   {isProcessing && messages[messages.length - 1]?.text.includes("typing") && (
                    <ChatBubble key="typing" message={{ id: 999, sender: "bella", text: "Bella is typing..." }} />
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSend} className="border-t border-border/20 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl p-4 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-end gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl hover:bg-primary/10 active:scale-95 transition-all duration-200 text-muted-foreground hover:text-primary disabled:opacity-40" 
                      disabled={isLive || isConnecting}
                      title="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                    <div className="flex-1 flex items-center rounded-2xl border border-border/50 bg-white shadow-sm px-4 py-2.5 min-h-[48px] focus-within:border-primary focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        className="flex-1 bg-transparent text-[15px] focus:outline-none placeholder:text-muted-foreground/60 resize-none leading-relaxed placeholder:font-normal"
                        placeholder="Type your message..."
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
                      <button 
                        type="button" 
                        onClick={handleLiveToggle} 
                        className={cn(
                          "ml-2 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl text-white transition-all duration-200 active:scale-90",
                          isLive 
                            ? "animate-pulse bg-red-500 hover:bg-red-600 shadow-md ring-2 ring-red-500/30" 
                            : "bg-primary hover:bg-primary/90 shadow-sm", 
                          isConnecting ? "bg-muted cursor-not-allowed opacity-50" : ""
                        )} 
                        title={isLive ? "Stop conversation" : "Start live conversation"} 
                        disabled={isConnecting}
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      type="submit" 
                      className={cn(
                        "h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl text-sm font-medium text-white transition-all duration-200 active:scale-95",
                        (input.trim() && !isLive) 
                          ? "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg ring-2 ring-primary/20" 
                          : "bg-gray-300 cursor-not-allowed opacity-40 shadow-none"
                      )} 
                      disabled={!input.trim() || isLive || isConnecting}
                      title="Send message"
                    >
                      <Send className="h-4 w-4"/>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="form-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="flex flex-col h-full bg-white/50">
                 <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 text-foreground flex-shrink-0 bg-white/60 backdrop-blur-sm">
                    <button className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors" onClick={() => setView("chat")}>
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Chat</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    {/* Progress Overview */}
                    <div className="space-y-4">
                      <h2 className="text-base font-bold text-foreground">Application Progress</h2>
                      
                      {/* Pre-Evaluation Progress */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span className="text-sm font-semibold text-foreground">Pre-Evaluation</span>
                          </div>
                          <span className="text-xs font-medium text-primary">{(() => {
                            const requirements = getRequirements(formData.loanPurpose);
                            const completed = requirements.filter(r => r.isCompleted(formData)).length;
                            return Math.round((completed / requirements.length) * 100);
                          })()}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(() => {
                              const requirements = getRequirements(formData.loanPurpose);
                              const completed = requirements.filter(r => r.isCompleted(formData)).length;
                              return (completed / requirements.length) * 100;
                            })()}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {(() => {
                            const requirements = getRequirements(formData.loanPurpose);
                            const completed = requirements.filter(r => r.isCompleted(formData)).length;
                            return `${completed} of ${requirements.length} requirements completed`;
                          })()}
                        </p>
                      </div>

                      {/* URLA 1003 Progress */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span className="text-sm font-semibold text-foreground">URLA Form 1003</span>
                          </div>
                          <span className="text-xs font-medium text-primary">{(() => {
                            const steps = [
                              formData.fullName && formData.email && formData.phoneNumber && formData.dob && formData.borrowerAddress,
                              formData.income && formData.income > 0,
                              formData.propertyType && formData.propertyUse && formData.location,
                              formData.isFirstTimeBuyer !== null && formData.isMilitary !== null,
                            ];
                            const completed = steps.filter(Boolean).length;
                            return Math.round((completed / steps.length) * 100);
                          })()}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(() => {
                              const steps = [
                                formData.fullName && formData.email && formData.phoneNumber && formData.dob && formData.borrowerAddress,
                                formData.income && formData.income > 0,
                                formData.propertyType && formData.propertyUse && formData.location,
                                formData.isFirstTimeBuyer !== null && formData.isMilitary !== null,
                              ];
                              const completed = steps.filter(Boolean).length;
                              return (completed / steps.length) * 100;
                            })()}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {(() => {
                            const steps = [
                              formData.fullName && formData.email && formData.phoneNumber && formData.dob && formData.borrowerAddress,
                              formData.income && formData.income > 0,
                              formData.propertyType && formData.propertyUse && formData.location,
                              formData.isFirstTimeBuyer !== null && formData.isMilitary !== null,
                            ];
                            const completed = steps.filter(Boolean).length;
                            return `${completed} of ${steps.length} sections completed`;
                          })()}
                        </p>
                      </div>
                    </div>

                    {/* Document Requirements */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-foreground">Document Requirements</h3>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 shadow-sm space-y-3">
                        {getRequirements(formData.loanPurpose).map((req) => {
                          const isCompleted = req.isCompleted(formData);
                          return (
                            <motion.div 
                              key={req.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 py-2"
                            >
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${
                                isCompleted 
                                  ? 'bg-primary border-primary shadow-sm' 
                                  : 'border-border bg-white'
                              }`}>
                                {isCompleted && (
                                  <motion.svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-3 w-3 text-white" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </motion.svg>
                                )}
                              </div>
                              <span className={`text-xs font-medium transition-colors ${
                                isCompleted ? 'text-foreground line-through opacity-60' : 'text-foreground'
                              }`}>
                                {req.label}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Achievement Badge */}
                    {(() => {
                      const requirements = getRequirements(formData.loanPurpose);
                      const completed = requirements.filter(r => r.isCompleted(formData)).length;
                      const total = requirements.length;
                      const percentage = (completed / total) * 100;
                      
                      if (percentage === 100) {
                        return (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/30 p-4 text-center"
                          >
                            <div className="text-3xl mb-2">🎉</div>
                            <p className="text-sm font-bold text-foreground">All Requirements Complete!</p>
                            <p className="text-xs text-muted-foreground mt-1">You're ready to proceed with your application.</p>
                          </motion.div>
                        );
                      } else if (percentage >= 75) {
                        return (
                          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 text-center">
                            <div className="text-2xl mb-2">⭐</div>
                            <p className="text-xs font-semibold text-foreground">Almost There!</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{total - completed} more to go</p>
                          </div>
                        );
                      } else if (percentage >= 50) {
                        return (
                          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 text-center">
                            <div className="text-2xl mb-2">💪</div>
                            <p className="text-xs font-semibold text-foreground">Great Progress!</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Keep it up!</p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Quick Summary */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 shadow-sm">
                      <h3 className="text-xs font-bold text-foreground mb-3">Quick Summary</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <FormField label="Loan Purpose" value={formData.loanPurpose} />
                        <FormField label="Property Type" value={formData.propertyType} />
                        <FormField label="Purchase Price" value={formData.purchasePrice} />
                        <FormField label="Down Payment" value={formData.downPayment} />
                      </div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isLive && !isConnecting && (
        <div className="flex items-stretch border-t border-border/50 bg-white/80 backdrop-blur-xl text-[12px] flex-shrink-0">
          <button type="button" onClick={() => setView("chat")} className={cn("flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200 active:scale-95", view === "chat" ? "text-primary font-medium" : "text-muted-foreground")}>
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </button>
          <button type="button" onClick={() => setView("form")} className={cn("flex-1 flex flex-col items-center justify-center py-3 gap-1 border-l border-border/50 transition-all duration-200 active:scale-95", view === "form" ? "text-primary font-medium" : "text-muted-foreground")}>
            <LayoutList className="h-4 w-4" />
            <span>Forms</span>
          </button>
        </div>
        )}
      </div>
    </motion.div>
  );
}