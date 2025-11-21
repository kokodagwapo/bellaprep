import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Activity, Sparkles } from 'lucide-react';
import { generateBellaSpeech, getBellaChatReply } from '../services/geminiService';
import { decodeAudioData, decode } from '../utils/audioUtils';

// Removed scripted demo - now using live agentic mode
// All demo code has been replaced with live conversational guidance

const BellaVoiceAssistant: React.FC = () => {
    // Agentic Demo State - tracks user context for live guidance
    const [userContext, setUserContext] = useState<{
        currentView?: string;
        currentStep?: number;
        lastAction?: string;
    }>({});
    const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);

    // Call State
    const [isCallActive, setIsCallActive] = useState(false);
    const [isBellaSpeaking, setIsBellaSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Ready to help");
    const [mode, setMode] = useState<'idle' | 'agentic' | 'call'>('idle');
    const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
    const [micError, setMicError] = useState<string | null>(null);

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const currentSourceGainRef = useRef<GainNode | null>(null); // Gain node for current audio source (for fade effects)
    const recognitionRef = useRef<any>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const transcriptScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Initialize Audio Context with default sample rate (prevents hissing/artifacts)
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            // Use default sample rate to avoid audio artifacts and hissing
            audioContextRef.current = new AudioContextClass();
            
            // Create a gain node to control output volume and prevent feedback
            if (audioContextRef.current) {
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.gain.value = 0.8; // Slightly reduce volume to prevent feedback
                gainNodeRef.current.connect(audioContextRef.current.destination);
            }
        }

        // Don't check permissions upfront - wait for user to click "Start Live Guide" button
        // This avoids permission prompts before user is ready
        setMicPermissionGranted(null);

        // Initialize Speech Recognition with better configuration
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true; // Enable interim results for better responsiveness
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1; // Only get the best match

            recognition.onstart = () => {
                setIsUserSpeaking(true);
                setStatusMessage("Listening...");
                setMicError(null);
                console.log("✅ Microphone is active and listening");
                console.log("🎤 Speech recognition started successfully");
                console.log("🎤 Recognition state:", {
                    continuous: recognition.continuous,
                    interimResults: recognition.interimResults,
                    lang: recognition.lang
                });
            };

            recognition.onend = () => {
                setIsUserSpeaking(false);
                // If call is still active OR in agentic mode, restart listening (unless Bella is speaking)
                if ((isCallActive || mode === 'agentic') && !isBellaSpeaking) {
                    setTimeout(() => {
                        try { 
                            recognition.start(); 
                            console.log("🔄 Restarting speech recognition");
                        } catch (e: any) { 
                            console.warn("Could not restart recognition:", e);
                            // If restart fails, it might be because recognition is already running
                            // or permissions were revoked
                            if (e?.toString()?.includes('not-allowed') || e?.toString()?.includes('permission')) {
                                setMicError("Microphone access denied. Please check your browser settings.");
                                setMicPermissionGranted(false);
                            }
                        }
                    }, 100); // Small delay to avoid rapid restart attempts
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsUserSpeaking(false);
                
                // 'no-speech' is not really an error - it just means user didn't speak
                // Don't show error for this, just log it
                if (event.error === 'no-speech') {
                    console.log("ℹ️ No speech detected (this is normal if you're not speaking)");
                    // Don't set error or change status - this is expected behavior
                    return;
                }
                
                // Handle actual errors
                if (event.error === 'not-allowed') {
                    setMicError("Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.");
                    setMicPermissionGranted(false);
                    setStatusMessage("Permission Denied");
                    console.error("❌ Microphone permission denied. User needs to grant permission in browser settings.");
                } else if (event.error === 'audio-capture') {
                    setMicError("No microphone found. Please connect a microphone and try again.");
                    setStatusMessage("No Mic");
                    console.error("❌ No microphone device found.");
                } else if (event.error === 'network') {
                    setMicError("Network error. Please check your internet connection.");
                    setStatusMessage("Network Error");
                    console.error("❌ Network error in speech recognition.");
                } else if (event.error === 'aborted') {
                    console.log("ℹ️ Speech recognition aborted (this is normal when stopping)");
                    // Don't show error for aborted - this is expected when we stop it
                    return;
                } else {
                    console.error("❌ Unknown speech recognition error:", event.error);
                    setStatusMessage("Recognition Error");
                    setMicError(`Speech recognition error: ${event.error}. Please try refreshing the page.`);
                }
            };

            recognition.onresult = async (event: any) => {
                console.log("🎤 Speech recognition result received:", {
                    resultIndex: event.resultIndex,
                    resultsLength: event.results.length,
                    results: Array.from(event.results).map((r: any, i: number) => ({
                        index: i,
                        isFinal: r.isFinal,
                        transcript: r[0]?.transcript,
                        confidence: r[0]?.confidence
                    }))
                });
                
                // Get the final transcript (not interim)
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                
                // If no final result yet, get the latest interim result for display
                if (!transcript && event.results.length > 0) {
                    const latestResult = event.results[event.results.length - 1][0].transcript;
                    console.log("🎤 Interim result (not final yet):", latestResult);
                    // Don't process interim results, just log them
                    return;
                }
                
                console.log("🎤 Final transcript:", transcript);
                setMicError(null); // Clear any previous errors

                // Only process if we have a final result with actual content
                if (transcript.trim() && event.results[event.results.length - 1].isFinal) {
                    // Stop listening while processing
                    recognition.stop();
                    setStatusMessage("Thinking...");

                    // Stop any current audio to respond to user
                    if (currentSourceRef.current) {
                        try {
                            await fadeOutAudioSource(currentSourceRef.current, currentSourceGainRef.current, 0.1);
                        } catch (e) {
                            // If fade fails, just stop
                            try {
                                currentSourceRef.current.stop();
                            } catch (stopError) {
                                // Ignore
                            }
                        }
                        setIsBellaSpeaking(false);
                    }

                    // Update conversation history
                    const updatedHistory: { role: 'user' | 'model', text: string }[] = [...conversationHistory, { role: 'user' as const, text: transcript }];
                    setConversationHistory(updatedHistory);

                    // Get contextual response from Bella with user context
                    const contextInfo = [];
                    if (userContext.currentView) {
                        contextInfo.push(`User is currently viewing: ${userContext.currentView}`);
                    }
                    if (userContext.currentStep !== undefined) {
                        contextInfo.push(`They're on step ${userContext.currentStep} of the application`);
                    }
                    if (userContext.lastAction) {
                        contextInfo.push(`Last action: ${userContext.lastAction}`);
                    }
                    
                    const contextPrompt = contextInfo.length > 0 
                        ? `[Context: ${contextInfo.join('. ')}]`
                        : '';
                    
                    // Build conversation with context
                    const conversationWithContext: { role: 'user' | 'model', text: string }[] = contextPrompt 
                        ? [
                            ...updatedHistory.slice(0, -1), // All but the last user message
                            { role: 'user' as const, text: `${transcript} ${contextPrompt}` }
                          ]
                        : updatedHistory;
                    
                    const reply = await getBellaChatReply(conversationWithContext);
                    
                    // Update conversation history with Bella's response
                    setConversationHistory([...updatedHistory, { role: 'model' as const, text: reply }]);
                    
                    // Auto-scroll transcript to bottom when new message is added
                    setTimeout(() => {
                        if (transcriptScrollRef.current) {
                            const endElement = transcriptScrollRef.current.querySelector('#transcript-end');
                            if (endElement) {
                                endElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            } else {
                                transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
                            }
                        }
                    }, 100);
                    
                    // Play response
                    await playAudio(reply, () => {
                        // After answering, restart listening if agentic/call mode is active
                        if ((isCallActive || mode === 'agentic') && recognitionRef.current) {
                            setTimeout(() => {
                                try { 
                                    recognitionRef.current.start(); 
                                    console.log("🔄 Restarted listening after Bella's response");
                                } catch (e) { 
                                    console.warn("Could not restart recognition after response:", e);
                                }
                            }, 300);
                        }
                    });
                }
            };

            recognitionRef.current = recognition;
        } else {
            setMicError("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
        }

        return () => {
            // Cleanup audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            
            // Stop speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            
            // Stop microphone stream
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach(track => track.stop());
                micStreamRef.current = null;
            }
        };
    }, [isCallActive, isBellaSpeaking, mode]);

    // Separate useEffect to monitor microphone permission changes when permission is denied
    useEffect(() => {
        if ((mode !== 'agentic' && mode !== 'call') || micPermissionGranted !== false) return;

        const checkPermissionState = async () => {
            try {
                if (navigator.permissions) {
                    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                    const isGranted = result.state === 'granted';
                    
                    if (isGranted) {
                        // Permission was just granted!
                        console.log("✅ Microphone permission granted! Restarting...");
                        setMicPermissionGranted(true);
                        setMicError(null);
                        setTimeout(() => {
                            startAgenticMode();
                        }, 500);
                        return; // Exit early since we're restarting
                    }
                    
                    // Listen for permission changes
                    result.onchange = () => {
                        if (result.state === 'granted') {
                            console.log("✅ Microphone permission granted via onchange! Restarting...");
                            setMicPermissionGranted(true);
                            setMicError(null);
                            setTimeout(() => {
                                startAgenticMode();
                            }, 500);
                        }
                    };
                }
            } catch (e) {
                // Permission API not supported, that's okay
            }
        };

        // Check permission state periodically
        checkPermissionState();
        const interval = setInterval(() => {
            checkPermissionState();
        }, 2000); // Check every 2 seconds
        
        return () => clearInterval(interval);
    }, [mode, micPermissionGranted]);

    const playAudio = async (text: string, onComplete?: () => void) => {
        if (!audioContextRef.current) return;

        setIsBellaSpeaking(true);
        setStatusMessage("Bella Speaking...");

        // Resume context if suspended (browser policy)
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        try {
            // generateBellaSpeech tries OpenAI first, then falls back to Gemini
            console.log("🔊 Requesting TTS for text:", text.substring(0, 50) + "...");
            const audioData = await generateBellaSpeech(text);

            if (!audioData) {
                console.error("❌ No audio data returned from TTS service");
                throw new Error("No audio data returned from TTS service");
            }
            
            console.log("✅ Audio data received, length:", audioData.length, "characters");

            // Fade out existing audio source smoothly before starting new one
            if (currentSourceRef.current) {
                try {
                    await fadeOutAudioSource(currentSourceRef.current, currentSourceGainRef.current, 0.15);
                    // Disconnect after fade-out
                    try {
                        currentSourceRef.current.disconnect();
                        if (currentSourceGainRef.current) {
                            currentSourceGainRef.current.disconnect();
                        }
                    } catch (e) {
                        // Ignore disconnect errors
                    }
                } catch (e) {
                    // If fade-out fails, just stop abruptly (fallback)
                    try {
                        currentSourceRef.current.stop();
                        currentSourceRef.current.disconnect();
                        if (currentSourceGainRef.current) {
                            currentSourceGainRef.current.disconnect();
                        }
                    } catch (stopError) {
                        // Ignore errors
                    }
                }
                currentSourceRef.current = null;
                currentSourceGainRef.current = null;
            }
            
            // Small delay to prevent audio artifacts between transitions
            await new Promise(resolve => setTimeout(resolve, 100));

            // Both return base64, but OpenAI is MP3 and Gemini might be different format
            // Try to decode as MP3 first (OpenAI), then fallback to Gemini format
            let buffer: AudioBuffer;
            let decodeSuccess = false;
            
            try {
                // Try decoding as MP3 (OpenAI format) - browsers can decode MP3 natively
                const binaryString = atob(audioData);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const arrayBuffer = bytes.buffer;
                
                // Try MP3 first
                try {
                    buffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0));
                    decodeSuccess = true;
                    console.log("✅ Successfully decoded audio as MP3 (OpenAI format)");
                } catch (mp3DirectError) {
                    // If direct decode fails, try with blob
                    console.log("Direct MP3 decode failed, trying with blob:", mp3DirectError);
                    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
                    const blobArrayBuffer = await audioBlob.arrayBuffer();
                    buffer = await audioContextRef.current.decodeAudioData(blobArrayBuffer);
                    decodeSuccess = true;
                    console.log("✅ Successfully decoded audio as MP3 via blob");
                }
            } catch (mp3Error) {
                console.log("MP3 decode failed, trying Gemini format:", mp3Error);
                // If MP3 decode fails, try Gemini format (PCM audio)
                try {
                    // Gemini returns base64-encoded PCM audio
                    const audioBuffer = decode(audioData);
                    
                    // Try native decode first (in case Gemini returns encoded audio)
                    try {
                        buffer = await audioContextRef.current.decodeAudioData(audioBuffer.buffer as ArrayBuffer);
                        decodeSuccess = true;
                        console.log("✅ Successfully decoded audio as Gemini format (native decode)");
                    } catch (nativeError) {
                        // If native decode fails, try custom PCM decoder (24kHz, mono)
                        console.log("Native decode failed, trying custom PCM decoder:", nativeError);
                        buffer = await decodeAudioData(audioBuffer, audioContextRef.current, 24000, 1);
                        decodeSuccess = true;
                        console.log("✅ Successfully decoded audio as Gemini format (PCM)");
                    }
                } catch (geminiError) {
                    console.error("❌ Failed to decode audio in both formats");
                    console.error("MP3 error:", mp3Error);
                    console.error("Gemini error:", geminiError);
                    throw new Error("Audio decode failed - both MP3 and Gemini formats failed");
                }
            }

            if (!decodeSuccess || !buffer) {
                throw new Error("Audio decoding failed - no buffer created");
            }

            // Resample buffer if sample rate doesn't match audio context (prevents hissing)
            let finalBuffer = buffer;
            if (buffer.sampleRate !== audioContextRef.current.sampleRate) {
                console.log(`⚠️ Sample rate mismatch: buffer=${buffer.sampleRate}Hz, context=${audioContextRef.current.sampleRate}Hz. Resampling...`);
                finalBuffer = await resampleAudioBuffer(buffer, audioContextRef.current.sampleRate);
            }
            
            // Create dedicated gain node for this audio source (for fade effects)
            const sourceGainNode = audioContextRef.current.createGain();
            sourceGainNode.gain.value = 0.001; // Start at minimum volume for fade-in
            
            // Create and play audio source
            const source = audioContextRef.current.createBufferSource();
            source.buffer = finalBuffer;
            
            // Connect: source -> sourceGainNode -> mainGainNode -> destination
            source.connect(sourceGainNode);
            
            if (gainNodeRef.current) {
                sourceGainNode.connect(gainNodeRef.current);
            } else {
                sourceGainNode.connect(audioContextRef.current.destination);
            }
            
            // Store references
            currentSourceGainRef.current = sourceGainNode;
            
            // Fade in the new audio source
            fadeInAudioSource(source, sourceGainNode, 0.1);

            source.onended = async () => {
                // Fade out before disconnecting to prevent noise
                try {
                    if (currentSourceGainRef.current && audioContextRef.current) {
                        const fadeOutTime = 0.1;
                        const currentTime = audioContextRef.current.currentTime;
                        currentSourceGainRef.current.gain.cancelScheduledValues(currentTime);
                        currentSourceGainRef.current.gain.setValueAtTime(currentSourceGainRef.current.gain.value, currentTime);
                        currentSourceGainRef.current.gain.linearRampToValueAtTime(0.001, currentTime + fadeOutTime);
                        
                        // Wait for fade-out to complete
                        await new Promise(resolve => setTimeout(resolve, fadeOutTime * 1000 + 10));
                    }
                } catch (e) {
                    // Ignore fade-out errors
                }
                
                // Properly disconnect and clean up the audio source to prevent noise
                try {
                    source.disconnect();
                    if (currentSourceGainRef.current) {
                        currentSourceGainRef.current.disconnect();
                    }
                } catch (e) {
                    // Ignore disconnect errors
                }
                
                // Clear the references
                if (currentSourceRef.current === source) {
                    currentSourceRef.current = null;
                }
                if (currentSourceGainRef.current) {
                    currentSourceGainRef.current = null;
                }
                
                setIsBellaSpeaking(false);
                setStatusMessage("Listening...");
                
                // Resume listening after Bella finishes (call/agentic mode is active)
                if ((isCallActive || mode === 'agentic') && recognitionRef.current) {
                    setTimeout(() => {
                        try { 
                            recognitionRef.current.start(); 
                            console.log("🔄 Restarted listening after audio playback");
                        } catch (e) { 
                            console.warn("Could not restart recognition after audio:", e);
                        }
                    }, 200);
                }

                // Call completion callback if provided
                if (onComplete) {
                    onComplete();
                }
            };

            source.start();
            currentSourceRef.current = source;
        } catch (error: any) {
            console.error("❌ Error playing audio:", error);
            console.error("   Error type:", error?.name || "Unknown");
            console.error("   Error message:", error?.message || error);

            // Fallback to Web Speech API
            console.warn("⚠️ Falling back to Web Speech API (system voice)");
            console.warn("   This means both OpenAI and Gemini TTS failed. Check:");
            console.warn("   1. OpenAI API key is valid (starts with 'sk-')");
            console.warn("   2. Gemini API key is valid");
            console.warn("   3. Network connection is working");
            console.warn("   4. Browser console for detailed error messages");
            setStatusMessage("Using System Voice");

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95; // Slightly slower for more natural speech
            utterance.pitch = 1.1; // Slightly higher pitch for more expressive voice
            utterance.volume = 1.0;

            // Try to find a female voice (prioritize more natural voices)
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => 
                v.name.includes('Samantha') || 
                v.name.includes('Karen') ||
                v.name.includes('Victoria') ||
                v.name.includes('Female') || 
                v.name.includes('Google US English Female') ||
                (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
            );
            if (femaleVoice) utterance.voice = femaleVoice;

            utterance.onend = () => {
                setIsBellaSpeaking(false);
                setStatusMessage("Listening...");
                // Resume listening after Bella finishes (call/agentic mode is active)
                if ((isCallActive || mode === 'agentic') && recognitionRef.current) {
                    setTimeout(() => {
                        try { 
                            recognitionRef.current.start(); 
                            console.log("🔄 Restarted listening after fallback TTS");
                        } catch (e) { 
                            console.warn("Could not restart recognition after fallback TTS:", e);
                        }
                    }, 200);
                }
                if (onComplete) onComplete();
            };

            utterance.onerror = (e) => {
                console.error("Speech synthesis error:", e);
                setIsBellaSpeaking(false);
                setStatusMessage("Audio Error");
                if (onComplete) onComplete();
            };

            window.speechSynthesis.speak(utterance);

            // We don't re-throw here so the app continues flow
        }
    };

    // Helper function to resample audio buffer to match audio context sample rate
    const resampleAudioBuffer = async (buffer: AudioBuffer, targetSampleRate: number): Promise<AudioBuffer> => {
        if (buffer.sampleRate === targetSampleRate) {
            return buffer;
        }
        
        const ratio = targetSampleRate / buffer.sampleRate;
        const newLength = Math.round(buffer.length * ratio);
        const newBuffer = audioContextRef.current!.createBuffer(
            buffer.numberOfChannels,
            newLength,
            targetSampleRate
        );
        
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const oldData = buffer.getChannelData(channel);
            const newData = newBuffer.getChannelData(channel);
            
            for (let i = 0; i < newLength; i++) {
                const index = i / ratio;
                const indexFloor = Math.floor(index);
                const indexCeil = Math.min(indexFloor + 1, oldData.length - 1);
                const fraction = index - indexFloor;
                
                // Linear interpolation
                newData[i] = oldData[indexFloor] * (1 - fraction) + oldData[indexCeil] * fraction;
            }
        }
        
        return newBuffer;
    };

    // Helper function to fade out audio source smoothly
    const fadeOutAudioSource = async (source: AudioBufferSourceNode, gainNode: GainNode | null, duration: number = 0.15): Promise<void> => {
        if (!audioContextRef.current) return;
        
        const currentTime = audioContextRef.current.currentTime;
        const gain = gainNode || gainNodeRef.current;
        
        if (gain) {
            // Smoothly fade out to minimum volume (not 0 to avoid clicks)
            gain.gain.cancelScheduledValues(currentTime);
            gain.gain.setValueAtTime(gain.gain.value, currentTime);
            gain.gain.linearRampToValueAtTime(0.001, currentTime + duration);
            
            // Wait for fade-out to complete
            await new Promise(resolve => setTimeout(resolve, duration * 1000 + 10));
        }
        
        // Stop the source after fade-out
        try {
            source.stop();
        } catch (e) {
            // Source may have already stopped
        }
    };

    // Helper function to fade in audio source smoothly
    const fadeInAudioSource = (source: AudioBufferSourceNode, gainNode: GainNode, duration: number = 0.1): void => {
        if (!audioContextRef.current) return;
        
        const currentTime = audioContextRef.current.currentTime;
        
        // Start at minimum volume and fade in
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(0.001, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, currentTime + duration);
    };

    const handleUserMessage = async (text: string) => {
        // Get AI Reply
        const reply = await getBellaChatReply([{ role: 'user', text }]);
        // Play Reply
        await playAudio(reply, undefined);
    };

    // startCall now uses agentic mode for live guidance
    const startCall = () => {
        startAgenticMode();
    };

    const endCall = () => {
        setMode('idle');
        setIsCallActive(false);
        setIsBellaSpeaking(false);
        setIsUserSpeaking(false);
        setStatusMessage("Ready to help");

        // Stop speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        
        // Stop audio playback with fade-out
        if (currentSourceRef.current) {
            fadeOutAudioSource(currentSourceRef.current, currentSourceGainRef.current, 0.15).then(() => {
                try {
                    if (currentSourceRef.current) {
                        currentSourceRef.current.disconnect();
                    }
                    if (currentSourceGainRef.current) {
                        currentSourceGainRef.current.disconnect();
                    }
                } catch (e) {
                    // Ignore errors
                }
                currentSourceRef.current = null;
                currentSourceGainRef.current = null;
            }).catch(() => {
                // Fallback: stop abruptly if fade-out fails
                try {
                    if (currentSourceRef.current) {
                        currentSourceRef.current.stop();
                        currentSourceRef.current.disconnect();
                    }
                    if (currentSourceGainRef.current) {
                        currentSourceGainRef.current.disconnect();
                    }
                } catch (e) {
                    // Ignore errors
                }
                currentSourceRef.current = null;
                currentSourceGainRef.current = null;
            });
        }
        
        // Stop microphone stream to prevent feedback
        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(track => track.stop());
            micStreamRef.current = null;
        }
    };


    // Live Agentic Mode - Bella observes and guides based on user actions
    const startAgenticMode = async () => {
        setMode('agentic');
        setIsCallActive(true);
        setStatusMessage("Starting live guide...");
        setMicError(null);
        setConversationHistory([]);

        // Resume Audio Context on user interaction
        if (audioContextRef.current?.state === 'suspended') {
            try {
                await audioContextRef.current.resume();
                console.log("✅ Audio context resumed");
            } catch (e) {
                console.warn("⚠️ Could not resume audio context:", e);
            }
        }

        // Request microphone permission - simple and direct approach
        try {
            console.log("🎤 Requesting microphone access...");
            setMicPermissionGranted(null); // Show loading state
            setStatusMessage("Requesting Access...");
            setMicError(null);
            
            // Directly request microphone access - let browser show the prompt
            // Don't check permissions first, just request directly
            let stream: MediaStream;
            try {
                // Try with basic audio first (most compatible)
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log("✅ Microphone permission granted");
            } catch (basicError: any) {
                // If basic fails, try with constraints
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        } 
                    });
                    console.log("✅ Microphone permission granted with constraints");
                } catch (constraintError: any) {
                    throw basicError; // Throw the original error
                }
            }
            
            setMicPermissionGranted(true);
            micStreamRef.current = stream;
            setMicError(null);
            setStatusMessage("Ready");
            console.log("✅ Microphone permission granted for agentic mode");
            
            // Monitor stream for disconnection
            stream.getTracks().forEach(track => {
                track.onended = () => {
                    console.warn("⚠️ Microphone track ended unexpectedly");
                    setMicPermissionGranted(false);
                    setMicError("Microphone disconnected. Please check your microphone and try again.");
                };
            });
        } catch (e: any) {
            console.error("❌ Microphone permission error:", e);
            setMicPermissionGranted(false);
            setStatusMessage("Demo Mode");
            
            if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
                setMicError("Microphone access denied. Bella can still guide you, but voice input is disabled. Click the 🔒 icon in your browser's address bar and select 'Allow' to enable voice input.");
            } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
                setMicError("No microphone found. Bella can still guide you, but voice input is disabled.");
            } else if (e.name === 'NotReadableError' || e.name === 'TrackStartError') {
                setMicError("Microphone is being used by another app. Bella can still guide you, but voice input is disabled.");
            } else {
                setMicError("Could not access microphone. Bella can still guide you, but voice input is disabled.");
            }
            // Continue with demo even if mic is denied - Bella can still speak
            console.log("ℹ️ Continuing demo without microphone - Bella can still provide guidance");
        }

        // Start Recognition only if microphone permission was granted
        if (micPermissionGranted && recognitionRef.current) {
            setTimeout(() => {
                try {
                    if (recognitionRef.current && (recognitionRef.current as any).state === 'running') {
                        console.log("ℹ️ Speech recognition already running");
                        setStatusMessage("Listening...");
                        return;
                    }
                    
                    recognitionRef.current.start();
                    setStatusMessage("Listening...");
                    console.log("✅ Speech recognition started for agentic mode");
                } catch (e: any) {
                    console.error("❌ Error starting recognition:", e);
                    if (e.name === 'InvalidStateError' || e.message?.includes('already started')) {
                        console.log("ℹ️ Recognition already started, this is okay");
                        setStatusMessage("Listening...");
                    } else {
                        console.warn("⚠️ Could not start speech recognition, but continuing demo");
                        setStatusMessage("Demo Mode");
                    }
                }
            }, 300);
        } else if (!micPermissionGranted) {
            console.log("ℹ️ Speech recognition disabled - microphone permission not granted");
            setStatusMessage("Demo Mode");
        } else if (!recognitionRef.current) {
            console.warn("⚠️ Speech recognition not available in this browser");
            setStatusMessage("Demo Mode");
        }

        // Welcome message for agentic mode - Gen Z style, always play, even without mic
        const welcomeMessage = micPermissionGranted 
            ? "Hey bestie! I'm Bella, your mortgage guide fr. I'm here to help you through Prep4Loan - no cap, just real talk and genuine help. What brings you here today? Are you looking to buy a home, refinance, or just exploring your options? Let's vibe!"
            : "Hey bestie! I'm Bella, your mortgage guide. I'm here to help you through Prep4Loan. I can guide you through everything, but I notice mic access wasn't granted. You can still chat with me through the interface, or enable mic access to have voice convos. What would you like to explore today? Let's get it!";
        
        await playAudio(welcomeMessage);
        setConversationHistory([{ role: 'model', text: welcomeMessage }]);
        
        // Auto-scroll to show welcome message
        setTimeout(() => {
            if (transcriptScrollRef.current) {
                transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
            }
        }, 100);
    };

    // Listen for user actions to provide contextual help
    useEffect(() => {
        if (mode !== 'agentic') return;

        const handleUserAction = (e: any) => {
            // Track user context for better responses
            const action = e.detail;
            if (action) {
                setUserContext(prev => ({
                    ...prev,
                    lastAction: action.action || action.type || 'user interaction'
                }));
            }
        };

        // Listen for view changes
        const handleViewChange = () => {
            const currentView = window.location.pathname === '/' ? 'home' : 
                              document.querySelector('[data-view]')?.getAttribute('data-view') || 'unknown';
            setUserContext(prev => ({ ...prev, currentView }));
        };

        window.addEventListener('bella-demo-action', handleUserAction);
        window.addEventListener('popstate', handleViewChange);
        
        return () => {
            window.removeEventListener('bella-demo-action', handleUserAction);
            window.removeEventListener('popstate', handleViewChange);
        };
    }, [mode]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-6 z-50 w-[320px]"
        >
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">

                {/* Header Area */}
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                            <Sparkles size={14} className="text-primary" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Bella AI</span>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{statusMessage}</span>
                        {isBellaSpeaking && <Activity size={14} className="text-primary animate-pulse" />}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="px-5 py-2 min-h-[60px] max-h-[300px] flex flex-col items-start justify-start gap-1 overflow-hidden">
                    {/* Conversation Transcript - Scrollable */}
                    {(mode === 'call' || mode === 'agentic') && conversationHistory.length > 0 && (
                        <div 
                            ref={transcriptScrollRef}
                            className="w-full max-h-[250px] overflow-y-auto pr-2 space-y-3 mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {conversationHistory.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-xs leading-relaxed p-2 rounded-lg ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-50 text-blue-900 ml-auto text-right max-w-[85%]' 
                                            : 'bg-primary/10 text-gray-800 mr-auto text-left max-w-[85%]'
                                    }`}
                                >
                                    <div className="font-semibold text-[10px] mb-1 opacity-70">
                                        {msg.role === 'user' ? 'You' : 'Bella'}
                                    </div>
                                    <div className="text-[11px] whitespace-pre-wrap break-words">{msg.text}</div>
                                </motion.div>
                            ))}
                            <div id="transcript-end" />
                        </div>
                    )}
                    
                    {/* Status Message */}
                    {!micError && (
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {mode === 'idle' && "Ready to guide you through Prep4Loan!"}
                            {(mode === 'call' || mode === 'agentic') && isBellaSpeaking && "Speaking..."}
                            {(mode === 'call' || mode === 'agentic') && !isBellaSpeaking && micPermissionGranted && conversationHistory.length === 0 && "Listening..."}
                            {(mode === 'call' || mode === 'agentic') && !isBellaSpeaking && micPermissionGranted === false && "Demo Mode - Bella can guide you"}
                            {(mode === 'call' || mode === 'agentic') && micPermissionGranted === null && "Requesting access..."}
                        </p>
                    )}
                    {micError && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-600 font-medium mt-2 space-y-3 w-full bg-red-50 border border-red-200 rounded-lg p-3"
                        >
                            <p className="font-semibold flex items-center gap-2">
                                <span className="text-base">🎤</span>
                                {micError}
                            </p>
                            {(micError.includes('permission') || micError.includes('denied') || micError.includes('Allow')) && (
                                <div className="space-y-3">
                                    <div className="text-[11px] text-gray-700 space-y-2 bg-white rounded p-2 border border-gray-200">
                                        <p className="font-semibold text-gray-800 mb-2">Note:</p>
                                        <div className="space-y-1.5 text-gray-700">
                                            <p>Bella can still guide you without microphone access! You can interact through the chat interface.</p>
                                            <p className="mt-2 font-semibold">To enable voice input:</p>
                                            <p>1. Look for the <strong>🔒 lock icon</strong> in your browser's address bar</p>
                                            <p>2. Click it and select <strong>"Allow"</strong> for microphone</p>
                                            <p>3. Click the button below to try again</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={startAgenticMode}
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span>🎤</span>
                                        <span>Enable Voice Input</span>
                                    </button>
                                </div>
                            )}
                            {micError.includes('No microphone') && (
                                <div className="text-[11px] text-gray-700 bg-white rounded p-2 border border-gray-200">
                                    <p className="font-semibold mb-1">💡 Check:</p>
                                    <ul className="list-disc list-inside space-y-0.5 ml-1">
                                        <li>Is your microphone connected?</li>
                                        <li>Is it enabled in system settings?</li>
                                        <li>Try refreshing the page</li>
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {(mode === 'call' || mode === 'agentic') && micPermissionGranted === null && !micError && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                            🎤 Requesting microphone access...
                        </p>
                    )}
                </div>

                {/* Controls Area */}
                <div className="p-3 bg-gray-50/50 border-t border-gray-100">

                    {/* IDLE MODE */}
                    {mode === 'idle' && (
                        <div className="flex items-center justify-center">
                            <button
                                onClick={startAgenticMode}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 w-full"
                            >
                                <Phone size={18} />
                                <span className="text-sm font-semibold">Start Live Guide</span>
                            </button>
                        </div>
                    )}

                    {/* CALL/AGENTIC MODE */}
                    {(mode === 'call' || mode === 'agentic') && (
                        <div className="flex items-center justify-between gap-4 px-2">
                            {micPermissionGranted === false ? (
                                <button
                                    onClick={startAgenticMode}
                                    type="button"
                                    className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl animate-pulse"
                                    title="Click to allow microphone access"
                                >
                                    <Mic size={20} />
                                </button>
                            ) : (
                                <div className={`p-3 rounded-full ${
                                    isUserSpeaking
                                        ? 'bg-green-100 text-green-600 animate-pulse'
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    <Mic size={20} />
                                </div>
                            )}

                            <div className="flex-1 flex justify-center">
                                <div className="flex gap-1 items-center h-8">
                                    {/* Visualizer bars - more active when user is speaking */}
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ 
                                                height: isUserSpeaking 
                                                    ? [12, 28, 12] 
                                                    : isBellaSpeaking 
                                                    ? [8, 20, 8] 
                                                    : 4 
                                            }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                            className={`w-1.5 rounded-full ${
                                                isUserSpeaking 
                                                    ? 'bg-green-500' 
                                                    : isBellaSpeaking 
                                                    ? 'bg-primary/60' 
                                                    : 'bg-primary/40'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={endCall}
                                className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 active:scale-95 transition-all"
                            >
                                <PhoneOff size={20} />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default BellaVoiceAssistant;
