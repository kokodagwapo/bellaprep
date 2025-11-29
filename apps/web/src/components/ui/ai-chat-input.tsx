import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send, Camera, FileText, MessageCircle, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
  "How can i get the best rate?",
  "How much can i afford with my credit score and income?",
  "Can you please guide me to the 1003 form?",
];

const SUGGESTIONS = [
  "How can I get the best rate?",
  "How much can I afford?",
  "What documents do I need?",
  "Tell me about FHA loans",
  "What's my credit score requirement?",
  "Explain down payment options",
  "What are closing costs?",
  "How long does approval take?",
  "Can I refinance?",
  "What's the difference between fixed and adjustable rates?",
  "Tell me about VA loans",
  "What is PMI?",
  "How do I improve my credit score?",
  "What is a pre-approval?",
  "Explain debt-to-income ratio"
];

interface AIChatInputProps {
  onSend?: (message: string, options?: { thinkActive?: boolean; deepSearchActive?: boolean }) => void;
  onCameraClick?: () => void;
  onVoiceClick?: () => void;
  onNavigateToPrep?: () => void;
  onNavigateToForm1003?: () => void;
  onOpenVoiceAssistant?: () => void;
  onRequestCallback?: () => void;
}

const AIChatInput: React.FC<AIChatInputProps> = ({ 
  onSend, 
  onCameraClick,
  onVoiceClick,
  onNavigateToPrep,
  onNavigateToForm1003,
  onOpenVoiceAssistant,
  onRequestCallback
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Hide quick actions after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuickActions(false);
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, []);

  // Start audio recording for Gemini transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        // Transcribe with Gemini API
        try {
          const { transcribeAudioWithGemini } = await import('../../services/geminiService');
          const transcript = await transcribeAudioWithGemini(audioBlob);
          setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
          setIsActive(true);
        } catch (error) {
          console.error('Transcription error:', error);
          // Fallback to Web Speech API if Gemini fails
          fallbackToWebSpeech();
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      // Fallback to Web Speech API
      fallbackToWebSpeech();
    }
  };

  // Fallback to Web Speech API
  const fallbackToWebSpeech = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
          setIsListening(false);
          setIsActive(true);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    } else if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Initialize Web Speech API as fallback
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
        setIsActive(true);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  }, [inputValue]);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = () => setIsActive(true);

  const handleSend = () => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue, { thinkActive, deepSearchActive });
      setInputValue("");
      setThinkActive(false);
      setDeepSearchActive(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
        // Use selected suggestion
        const selectedSuggestion = suggestions[selectedSuggestionIndex];
        setInputValue(selectedSuggestion);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        if (onSend) {
          onSend(selectedSuggestion, { thinkActive, deepSearchActive });
          setInputValue("");
          setThinkActive(false);
          setDeepSearchActive(false);
        }
      } else {
        handleSend();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    if (onSend) {
      onSend(suggestion, { thinkActive, deepSearchActive });
      setInputValue("");
      setThinkActive(false);
      setDeepSearchActive(false);
    }
  };

  const containerVariants = {
    collapsed: {
      minHeight: 48, // Mobile-first: 48px, sm: 56px (handled via className)
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      minHeight: 80, // Mobile-first: 80px, sm: 96px (handled via className)
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
  };

  return (
    <div className="w-full flex justify-center items-center text-black px-2 sm:px-4" style={{ overflow: 'visible', position: 'relative', zIndex: 1000 }}>
      <motion.div
        ref={wrapperRef}
        className="w-full"
        variants={containerVariants}
        animate={isActive || inputValue ? "expanded" : "collapsed"}
        initial="collapsed"
        style={{ 
          overflow: "visible", 
          borderRadius: "clamp(8px, 2vw, 12px)", 
          background: "#fff",
          maxWidth: 'clamp(100%, 48rem, min(calc(48rem + 4in), 100%))', // Extended by 2 inches but constrained to viewport
          height: "auto",
          minHeight: isActive || inputValue 
            ? "clamp(80px, 20vw, 96px)" // Mobile: 80px, Desktop: 96px
            : "clamp(48px, 12vw, 56px)", // Mobile: 48px, Desktop: 56px
          position: 'relative',
          zIndex: 1000,
          isolation: 'isolate'
        }}
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full" style={{ overflow: 'visible', position: 'relative' }}>
          {/* Input Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-full bg-white w-full" style={{ overflow: 'visible', position: 'relative', zIndex: 1001 }}>
            {/* Attachment Icon with Tooltip */}
            <div className="relative group" style={{ zIndex: 9999 }}>
              <button
                className="p-2 sm:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center"
                title="Attach file"
                type="button"
                tabIndex={-1}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Paperclip size={18} className="sm:w-5 sm:h-5" />
              </button>
              
              {/* Tooltip - Positioned above attachment icon */}
              <div 
                className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 delay-100"
                style={{ 
                  zIndex: 10000,
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <div className="bg-white border border-gray-200/60 text-gray-900 rounded-lg px-3 py-2.5 shadow-xl"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: '300',
                    letterSpacing: '-0.01em',
                    minWidth: '140px',
                    position: 'relative',
                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="whitespace-nowrap text-gray-900">Driver's License</span>
                    <span className="whitespace-nowrap text-gray-900">State ID</span>
                    <span className="whitespace-nowrap text-gray-900">W2</span>
                    <span className="whitespace-nowrap text-gray-900">Bank Statements</span>
                    <span className="whitespace-nowrap text-gray-900">IRS Forms</span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-white border-r border-b border-gray-200/60 rotate-45" style={{ backgroundColor: '#ffffff' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Icon for OCR with Tooltip */}
            <div className="relative group" style={{ zIndex: 9999 }}>
              <button
                className="p-2 sm:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center"
                title="OCR - Scan document"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCameraClick) onCameraClick();
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Camera size={18} className="sm:w-5 sm:h-5" />
              </button>
              
              {/* Tooltip - Positioned above camera icon */}
              <div 
                className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 delay-100"
                style={{ 
                  zIndex: 10000,
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px'
                }}
              >
                <div className="bg-white border border-gray-200/60 text-gray-900 rounded-lg px-4 py-2.5 shadow-xl"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: '300',
                    letterSpacing: '-0.01em',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content',
                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#ffffff',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '10px',
                    paddingBottom: '10px'
                  }}
                >
                  <span className="text-gray-900 whitespace-nowrap">Take a picture of your documents.</span>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-white border-r border-b border-gray-200/60 rotate-45" style={{ backgroundColor: '#ffffff' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Input & Placeholder */}
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 border-0 outline-0 rounded-md py-2 sm:py-2.5 px-1 sm:px-2 text-sm sm:text-base bg-transparent w-full font-light touch-manipulation min-h-[44px] sm:min-h-[auto]"
                style={{ 
                  position: "relative", 
                  zIndex: 1,
                  fontSize: '16px' // Prevents zoom on iOS
                }}
                onFocus={handleActivate}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-2 sm:px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none font-light text-sm sm:text-base"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                        maxWidth: "calc(100% - 1rem)",
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Auto-suggestions Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200/60 max-h-48 overflow-y-auto z-50 custom-scrollbar backdrop-blur-sm"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left px-3 py-2.5 text-sm font-thin tracking-tight hover:bg-gray-50/80 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          index === selectedSuggestionIndex ? 'bg-gray-50/80' : ''
                        }`}
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                          color: '#000000',
                          fontWeight: '300',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Voice Input Button with Tooltip */}
            <div className="relative group" style={{ zIndex: 9999 }}>
              <button
                className={`p-2 sm:p-3 rounded-full transition touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center ${
                  isListening 
                    ? 'bg-red-100 hover:bg-red-200 active:bg-red-300' 
                    : 'hover:bg-gray-100 active:bg-gray-200'
                }`}
                title="Voice input"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isListening || isRecording) {
                    // Stop recording/listening
                    stopRecording();
                  } else {
                    // Start recording with Gemini API
                    startRecording();
                  }
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Mic size={18} className={`sm:w-5 sm:h-5 ${isListening ? 'text-red-600' : ''}`} />
              </button>
              
              {/* Tooltip */}
              <div 
                className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 delay-100"
                style={{ 
                  zIndex: 10000,
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px'
                }}
              >
                <div className="bg-white border border-gray-200/60 text-gray-900 rounded-lg shadow-xl"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: '300',
                    letterSpacing: '-0.01em',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content',
                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#ffffff',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '10px',
                    paddingBottom: '10px'
                  }}
                >
                  <span className="text-gray-900 whitespace-nowrap">{isListening ? 'Listening... Click to stop' : 'Click to speak'}</span>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-white border-r border-b border-gray-200/60 rotate-45" style={{ backgroundColor: '#ffffff' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 active:bg-primary/80 text-white p-2 sm:p-3 rounded-full font-light justify-center transition touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto]"
              title="Send"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSend();
              }}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {/* Expanded Controls */}
          <motion.div
            className="w-full flex justify-center px-3 sm:px-4 items-center text-xs sm:text-sm pb-3 sm:pb-4"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                pointerEvents: "none" as const,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.35, delay: 0.08 },
              },
            }}
            initial={showQuickActions ? "visible" : "hidden"}
            animate={(showQuickActions || isActive || inputValue) ? "visible" : "hidden"}
            style={{ marginTop: "clamp(4px, 1vh, 8px)" }}
          >
            <div className="flex gap-1.5 sm:gap-2 items-center flex-nowrap overflow-x-auto w-full justify-center">
              {/* Get Pre-Evaluation */}
              <button
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full transition-all font-thin tracking-tight group touch-manipulation min-h-[32px] sm:min-h-[36px] flex-shrink-0"
                title="Get Pre-Evaluation"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigateToPrep) {
                    onNavigateToPrep();
                  }
                }}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  backgroundColor: 'rgba(147, 197, 253, 0.15)',
                  color: '#000000',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '-0.02em',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(147, 197, 253, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(147, 197, 253, 0.15)';
                }}
              >
                <FileText size={14} style={{ width: '12px', height: '12px' }} />
                <span className="text-xs whitespace-nowrap font-thin tracking-tight" style={{ color: '#000000', fontFamily: 'inherit', letterSpacing: '-0.02em', fontWeight: '300' }}>Get Pre-Evaluation</span>
              </button>

              {/* Apply & Fill-up URLA 1003 */}
              <button
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full transition-all font-thin tracking-tight group touch-manipulation min-h-[32px] sm:min-h-[36px] flex-shrink-0"
                title="Apply & Fill-up URLA 1003"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigateToForm1003) {
                    onNavigateToForm1003();
                  }
                }}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  backgroundColor: 'rgba(196, 181, 253, 0.15)',
                  color: '#000000',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '-0.02em',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(196, 181, 253, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(196, 181, 253, 0.15)';
                }}
              >
                <FileText size={14} style={{ width: '12px', height: '12px' }} />
                <span className="text-xs whitespace-nowrap font-thin tracking-tight" style={{ color: '#000000', fontFamily: 'inherit', letterSpacing: '-0.02em', fontWeight: '300' }}>Apply & Fill-up URLA 1003</span>
              </button>

              {/* Find Best Mortgage Rate */}
              <button
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full transition-all font-thin tracking-tight group touch-manipulation min-h-[32px] sm:min-h-[36px] flex-shrink-0"
                title="Find Best Mortgage Rate"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSend) {
                    onSend("How can I find the best mortgage rate?");
                  }
                }}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  backgroundColor: 'rgba(167, 243, 208, 0.15)',
                  color: '#000000',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '-0.02em',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(167, 243, 208, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(167, 243, 208, 0.15)';
                }}
              >
                <MessageCircle size={14} style={{ width: '12px', height: '12px' }} />
                <span className="text-xs whitespace-nowrap font-thin tracking-tight" style={{ color: '#000000', fontFamily: 'inherit', letterSpacing: '-0.02em', fontWeight: '300' }}>Find Best Mortgage Rate</span>
              </button>

              {/* Ask a Call Back */}
              <button
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full transition-all font-thin tracking-tight group touch-manipulation min-h-[32px] sm:min-h-[36px] flex-shrink-0"
                title="Ask a Call Back"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRequestCallback) {
                    onRequestCallback();
                  }
                }}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  backgroundColor: 'rgba(254, 202, 202, 0.15)',
                  color: '#000000',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '-0.02em',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(254, 202, 202, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(254, 202, 202, 0.15)';
                }}
              >
                <Phone size={14} style={{ width: '12px', height: '12px' }} />
                <span className="text-xs whitespace-nowrap font-thin tracking-tight" style={{ color: '#000000', fontFamily: 'inherit', letterSpacing: '-0.02em', fontWeight: '300' }}>Ask a Call Back</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export { AIChatInput };

