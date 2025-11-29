import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatInput } from './ui/ai-chat-input';
import { X, Bot, User, Mountain, Shapes, Waves, Sparkles, Palette, Radio, Send, Loader2 } from 'lucide-react';
import { extractDataFromDocument } from '../services/ocrService';
import { getBellaChatReply } from '../services/geminiService';

const heroMessages = [
  "Home Loan, Simplified. Ask Bella.",
  "How can I help you today?",
  "Tell me about your dream home…"
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type BackgroundStyle = 'nature' | 'geometric' | 'waves' | 'particles' | 'gradient' | 'aurora';

interface HeroProps {
  onNavigateToPrep?: () => void;
  onNavigateToForm1003?: () => void;
  onOpenVoiceAssistant?: () => void;
  onRequestCallback?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToPrep, onNavigateToForm1003, onOpenVoiceAssistant, onRequestCallback }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('nature');
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRequestingCallback, setIsRequestingCallback] = useState(false);
  const [callbackData, setCallbackData] = useState<{ name?: string; phone?: string; email?: string }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const currentMessage = heroMessages[currentIndex];
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    // Type out the message
    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);

        // Wait 8 seconds after typing is complete, then move to next message
        const pauseTimeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % heroMessages.length);
        }, 8000);

        return () => clearTimeout(pauseTimeout);
      }
    }, 80); // Slower, smoother typing speed

    return () => {
      clearInterval(typingInterval);
    };
  }, [currentIndex]);

  // Auto-scroll to bottom when new messages arrive (within chat container)
  useEffect(() => {
    if (chatEndRef.current && isChatExpanded) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [chatMessages, isProcessing, isChatExpanded]);

  // Prevent page scroll when chat is expanded
  useEffect(() => {
    if (isChatExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isChatExpanded]);

  // Initialize speech recognition for voice input
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          handleSendMessage(transcript, { thinkActive: false, deepSearchActive: false });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-rotate background every 30 seconds
  useEffect(() => {
    const backgroundStyles: BackgroundStyle[] = ['nature', 'geometric', 'waves', 'particles', 'gradient', 'aurora'];
    const rotationInterval = setInterval(() => {
      setBackgroundStyle((prev) => {
        const currentIndex = backgroundStyles.indexOf(prev);
        const nextIndex = (currentIndex + 1) % backgroundStyles.length;
        return backgroundStyles[nextIndex];
      });
    }, 30000); // 30 seconds

    return () => clearInterval(rotationInterval);
  }, []);

  // Handle callback request
  const handleRequestCallback = () => {
    // Expand chat if not already expanded
    if (!isChatExpanded) {
      setIsChatExpanded(true);
    }

    setIsRequestingCallback(true);
    setCallbackData({}); // Reset callback data

    // Add Bella's message asking for contact info with emphasis on required fields
    const callbackMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I'd love to give you a call back! 😊 To get started, I need the following information (all required):\n\n• **Your full name** (required)\n• **Phone number** (required)\n• **Email address** (required)\n\nPlease share all three pieces of information, and I'll make sure someone reaches out to you soon!",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, callbackMessage]);
  };

  // Handle sending messages
  const handleSendMessage = async (message: string, options?: { thinkActive?: boolean; deepSearchActive?: boolean }) => {
    if (!message.trim()) return;

    // Expand chat if not already expanded
    if (!isChatExpanded) {
      setIsChatExpanded(true);
    }

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Check if user is providing callback info
    if (isRequestingCallback) {
      // Extract contact information from message with improved patterns
      const namePatterns = [
        /(?:name|my name is|i'm|i am|call me|it's)\s+([A-Za-z\s]{2,})/i,
        /^([A-Za-z\s]{2,})(?:\s|$)/i,
        /([A-Z][a-z]+\s+[A-Z][a-z]+)/ // First Last format
      ];
      
      const phonePatterns = [
        /(?:phone|number|call me at|my phone|cell|mobile)\s*[:\-]?\s*([\d\s\-\(\)\.]+)/i,
        /(\d{3}[\s\-\.]?\d{3}[\s\-\.]?\d{4})/,
        /(\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4})/
      ];
      
      const emailPatterns = [
        /(?:email|e-mail|my email is|email address)\s*[:\-]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
      ];

      let nameMatch = null;
      let phoneMatch = null;
      let emailMatch = null;

      // Try all name patterns
      for (const pattern of namePatterns) {
        nameMatch = message.match(pattern);
        if (nameMatch && nameMatch[1].trim().length >= 2) break;
      }

      // Try all phone patterns
      for (const pattern of phonePatterns) {
        phoneMatch = message.match(pattern);
        if (phoneMatch) break;
      }

      // Try all email patterns
      for (const pattern of emailPatterns) {
        emailMatch = message.match(pattern);
        if (emailMatch) break;
      }

      // Update callback data with any found information
      const updatedCallbackData = { ...callbackData };
      if (nameMatch && nameMatch[1]) {
        updatedCallbackData.name = nameMatch[1].trim();
      }
      if (phoneMatch && phoneMatch[1]) {
        updatedCallbackData.phone = phoneMatch[1].trim().replace(/\s+/g, '');
      }
      if (emailMatch && emailMatch[1]) {
        updatedCallbackData.email = emailMatch[1].trim();
      }
      setCallbackData(updatedCallbackData);

      // Check if all required fields are collected
      const hasName = !!updatedCallbackData.name;
      const hasPhone = !!updatedCallbackData.phone;
      const hasEmail = !!updatedCallbackData.email;

      setIsProcessing(false);

      if (hasName && hasPhone && hasEmail) {
        // All required fields collected - acknowledge and thank
        const confirmationMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Perfect! Thank you so much! 😊 I've got all your information:\n\n• **Name**: ${updatedCallbackData.name}\n• **Phone**: ${updatedCallbackData.phone}\n• **Email**: ${updatedCallbackData.email}\n\nI've saved this information and someone from our team will reach out to you soon. Your information has also been saved to your application forms for easy access!\n\nIs there anything else I can help you with?`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, confirmationMessage]);
        
        // Store in localStorage for prepopulation
        const formDataToStore = {
          fullName: updatedCallbackData.name,
          phoneNumber: updatedCallbackData.phone,
          email: updatedCallbackData.email
        };
        localStorage.setItem('bellaCallbackData', JSON.stringify(formDataToStore));
        
        setIsRequestingCallback(false);
        setCallbackData({});
        return;
      } else {
        // Missing some fields - ask for remaining ones
        const missingFields: string[] = [];
        if (!hasName) missingFields.push('name');
        if (!hasPhone) missingFields.push('phone number');
        if (!hasEmail) missingFields.push('email address');

        const collectedFields: string[] = [];
        if (hasName) collectedFields.push(`✓ Name: ${updatedCallbackData.name}`);
        if (hasPhone) collectedFields.push(`✓ Phone: ${updatedCallbackData.phone}`);
        if (hasEmail) collectedFields.push(`✓ Email: ${updatedCallbackData.email}`);

        let responseMessage = '';
        if (collectedFields.length > 0) {
          responseMessage = `Great! I've got:\n\n${collectedFields.join('\n')}\n\n`;
        }
        responseMessage += `I still need your ${missingFields.join(' and ')}. Please share ${missingFields.length === 1 ? 'it' : 'them'} so I can complete your callback request! 😊`;

        const reminderMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseMessage,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, reminderMessage]);
        return;
      }
    }

    try {
      // Build chat history for Gemini
      const chatHistory = [...chatMessages, userMessage].map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        text: msg.content
      }));

      // Use Gemini for chat
      const bellaReply = await getBellaChatReply(chatHistory);

      // Add Bella's response to chat
      const bellaMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: bellaReply,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, bellaMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble processing your request right now. ${error.message || 'Please try again in a moment.'}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle camera/OCR click
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection for OCR
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show processing message
    setIsChatExpanded(true);
    setIsProcessing(true);
    
    const processingMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '📸 Analyzing your document with Google Vision...',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, processingMessage]);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = file.type || 'image/jpeg';

        try {
          // Extract data using Google Vision API
          const extractedData = await extractDataFromDocument({
            data: base64Data,
            mimeType: mimeType
          });

          // Remove processing message
          setChatMessages(prev => prev.filter(msg => msg.id !== processingMessage.id));

          // Show extracted data
          const extractedFields = Object.entries(extractedData)
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => `**${key.replace(/([A-Z])/g, ' $1').trim()}**: ${value}`)
            .join('\n');

          if (extractedFields) {
            const successMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `✅ Successfully extracted data from your document:\n\n${extractedFields}\n\nI've captured this information. Is there anything else you'd like to know?`,
              timestamp: new Date()
            };
            setChatMessages(prev => [...prev, successMessage]);
          } else {
            const noDataMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "I couldn't extract specific data from this document. Could you try uploading a clearer image or tell me what information you need help with?",
              timestamp: new Date()
            };
            setChatMessages(prev => [...prev, noDataMessage]);
          }
        } catch (error: any) {
          console.error('OCR error:', error);
          setChatMessages(prev => prev.filter(msg => msg.id !== processingMessage.id));
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I had trouble analyzing your document: ${error.message || 'Please try uploading a clearer image.'}`,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('File read error:', error);
      setIsProcessing(false);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I had trouble reading your file. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }

    // Reset file input
    event.target.value = '';
  };

  // Handle voice input click
  const handleVoiceClick = () => {
    if (!recognitionRef.current) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, voice input isn't available in your browser. Please type your message instead.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsChatExpanded(true);
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsChatExpanded(true);
      }
    } catch (error: any) {
      console.error('Voice recognition error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I had trouble starting voice recognition. Please try again or type your message.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsChatExpanded(true);
    }
  };

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden" 
      style={{ 
        marginTop: 'clamp(0px, calc(-100px + 1.5in + 3mm), 0px)', 
        paddingTop: 'clamp(60px, 15vw, 100px)', 
        paddingBottom: 'clamp(2rem, 5vw, 4rem)',
        width: '100%', 
        minHeight: '100vh',
        height: 'auto',
        position: 'relative',
        overflowY: 'hidden'
      }}
    >
      {/* Soft gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900" />
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/3 blur-3xl opacity-20" />

      {/* Animated Background Elements */}
      <AnimatePresence mode="wait">
        <div key={backgroundStyle} className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Nature/Scenic Background */}
          {backgroundStyle === 'nature' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Mountains */}
              <motion.svg
                className="absolute bottom-0 left-0 h-2/5 opacity-20 w-full"
                viewBox="0 0 2400 400"
                preserveAspectRatio="xMidYMid slice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 2 }}
              >
                <motion.path
                  d="M-100,400 L0,350 L150,280 L300,320 L450,200 L600,250 L750,150 L900,220 L1050,180 L1200,200 L1350,160 L1500,180 L1650,200 L1800,160 L1950,180 L2100,200 L2250,170 L2400,150 L2400,400 Z"
                  fill="url(#mountainGradient)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
                <motion.path
                  d="M-50,400 L50,380 L150,360 L250,340 L350,320 L450,300 L550,280 L650,260 L750,240 L850,220 L950,200 L1050,180 L1150,200 L1250,220 L1350,200 L1500,220 L1650,240 L1800,200 L1950,220 L2100,240 L2250,220 L2400,200 L2400,400 Z"
                  fill="url(#mountainGradient2)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* Meadows */}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1/4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.15 }}
                transition={{ duration: 2, delay: 0.5 }}
              >
                <svg viewBox="0 0 1200 200" className="w-full h-full">
                  <path d="M0,200 Q150,150 300,170 T600,160 T900,175 T1200,165 L1200,200 Z" fill="#10b981" opacity="0.3" />
                  <path d="M0,200 Q200,160 400,180 T800,170 T1200,180 L1200,200 Z" fill="#34d399" opacity="0.2" />
                </svg>
              </motion.div>

              {/* Sunshine */}
              <motion.div className="absolute top-[10%] left-[8%] sm:left-[12%]" style={{ opacity: 0.4 }}>
                <motion.svg
                  width="120"
                  height="120"
                  viewBox="0 0 100 100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="50" cy="50" r="25" fill="#fbbf24" opacity="0.4" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1={50 + 25 * Math.cos(rad)}
                        y1={50 + 25 * Math.sin(rad)}
                        x2={50 + 38 * Math.cos(rad)}
                        y2={50 + 38 * Math.sin(rad)}
                        stroke="#fbbf24"
                        strokeWidth="2"
                        opacity="0.4"
                      />
                    );
                  })}
                </motion.svg>
              </motion.div>

              {/* Clouds */}
              {[
                { x: '15%', y: '20%', delay: 0.3, duration: 8, size: 100 },
                { x: '70%', y: '15%', delay: 0.6, duration: 10, size: 120 },
                { x: '45%', y: '25%', delay: 0.9, duration: 12, size: 90 },
              ].map((cloud, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: cloud.x, top: cloud.y }}
                  animate={{ x: [0, 30, 0], opacity: 0.3 }}
                  transition={{
                    x: { duration: cloud.duration, repeat: Infinity, ease: "easeInOut", delay: cloud.delay },
                    opacity: { duration: 1.5, delay: cloud.delay },
                  }}
                >
                  <svg width={cloud.size} height={cloud.size * 0.5} viewBox="0 0 80 40">
                    <ellipse cx="20" cy="25" rx="15" ry="12" fill="#e0e7ff" opacity="0.4" />
                    <ellipse cx="35" cy="20" rx="18" ry="15" fill="#c7d2fe" opacity="0.4" />
                    <ellipse cx="50" cy="25" rx="15" ry="12" fill="#e0e7ff" opacity="0.4" />
                    <ellipse cx="60" cy="22" rx="12" ry="10" fill="#c7d2fe" opacity="0.4" />
                  </svg>
                </motion.div>
              ))}

              {/* Birds */}
              {[
                { startX: '5%', startY: '35%', delay: 0, duration: 20, size: 30 },
                { startX: '10%', startY: '40%', delay: 3, duration: 22, size: 25 },
              ].map((bird, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: bird.startX, top: bird.startY }}
                  animate={{
                    x: ['-100px', '2000px'],
                    y: [0, -15, 0, -10, 0],
                    opacity: [0, 0.6, 0.6, 0.6, 0],
                  }}
                  transition={{
                    x: { duration: bird.duration, repeat: Infinity, ease: "linear", delay: bird.delay },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: bird.delay },
                    opacity: { duration: bird.duration, repeat: Infinity, ease: "easeInOut", delay: bird.delay },
                  }}
                >
                  <motion.svg width={bird.size} height={bird.size * 0.6} viewBox="0 0 30 18" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <path d="M 5 9 L 15 2 L 25 9" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
                  </motion.svg>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Dreamy Floating Shapes Background */}
          {backgroundStyle === 'geometric' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Dreamy floating hexagons */}
              {[
                { x: '20%', y: '30%', size: 80, delay: 0, duration: 18, rotation: 0 },
                { x: '75%', y: '40%', size: 100, delay: 2, duration: 20, rotation: 30 },
                { x: '50%', y: '65%', size: 90, delay: 4, duration: 22, rotation: 60 },
                { x: '15%', y: '70%', size: 70, delay: 1, duration: 19, rotation: 90 },
                { x: '85%', y: '55%', size: 85, delay: 3, duration: 21, rotation: 120 },
              ].map((shape, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: shape.x,
                    top: shape.y,
                    width: shape.size,
                    height: shape.size,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [shape.rotation, shape.rotation + 360],
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: shape.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: shape.delay,
                  }}
                >
                  <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
                    <polygon
                      points="50,10 90,30 90,70 50,90 10,70 10,30"
                      fill="none"
                      stroke="rgba(147, 197, 253, 0.4)"
                      strokeWidth="2"
                      filter="blur(1px)"
                    />
                  </svg>
                </motion.div>
              ))}

              {/* Soft glowing orbs */}
              {[
                { x: '30%', y: '25%', size: 120, delay: 0, duration: 15 },
                { x: '70%', y: '60%', size: 140, delay: 3, duration: 17 },
                { x: '50%', y: '75%', size: 100, delay: 6, duration: 16 },
              ].map((orb, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-2xl"
                  style={{
                    left: orb.x,
                    top: orb.y,
                    width: orb.size,
                    height: orb.size,
                    background: 'radial-gradient(circle, rgba(147, 197, 253, 0.3), rgba(196, 181, 253, 0.2), transparent)',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: orb.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: orb.delay,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Dreamy Flowing Waves Background */}
          {backgroundStyle === 'waves' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Dreamy flowing wave layers */}
              {[
                { delay: 0, duration: 20, opacity: 0.25, color: 'rgba(147, 197, 253, 0.4)' },
                { delay: 1.5, duration: 22, opacity: 0.2, color: 'rgba(196, 181, 253, 0.35)' },
                { delay: 3, duration: 24, opacity: 0.15, color: 'rgba(167, 243, 208, 0.3)' },
              ].map((wave, i) => (
                <motion.svg
                  key={i}
                  className="absolute bottom-0 left-0 w-full"
                  style={{ height: `${40 + i * 10}%` }}
                  viewBox="0 0 1200 400"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d={`M0,${300 - i * 20} Q200,${270 - i * 20} 400,${300 - i * 20} Q600,${330 - i * 20} 800,${300 - i * 20} Q1000,${270 - i * 20} 1200,${300 - i * 20} L1200,400 L0,400 Z`}
                    fill={wave.color}
                    opacity={wave.opacity}
                    filter="blur(2px)"
                    animate={{
                      d: [
                        `M0,${300 - i * 20} Q200,${270 - i * 20} 400,${300 - i * 20} Q600,${330 - i * 20} 800,${300 - i * 20} Q1000,${270 - i * 20} 1200,${300 - i * 20} L1200,400 L0,400 Z`,
                        `M0,${300 - i * 20} Q200,${290 - i * 20} 400,${300 - i * 20} Q600,${310 - i * 20} 800,${300 - i * 20} Q1000,${290 - i * 20} 1200,${300 - i * 20} L1200,400 L0,400 Z`,
                        `M0,${300 - i * 20} Q200,${270 - i * 20} 400,${300 - i * 20} Q600,${330 - i * 20} 800,${300 - i * 20} Q1000,${270 - i * 20} 1200,${300 - i * 20} L1200,400 L0,400 Z`,
                      ],
                    }}
                    transition={{
                      duration: wave.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: wave.delay,
                    }}
                  />
                </motion.svg>
              ))}

              {/* Dreamy floating bubbles */}
              {[
                { x: '20%', y: '60%', size: 8, delay: 0, duration: 10 },
                { x: '55%', y: '65%', size: 12, delay: 2, duration: 12 },
                { x: '80%', y: '62%', size: 10, delay: 4, duration: 11 },
                { x: '35%', y: '68%', size: 9, delay: 1, duration: 13 },
              ].map((bubble, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-sm"
                  style={{
                    left: bubble.x,
                    top: bubble.y,
                    width: bubble.size,
                    height: bubble.size,
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6), rgba(147, 197, 253, 0.3))',
                    boxShadow: '0 0 10px rgba(147, 197, 253, 0.4)',
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: bubble.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: bubble.delay,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Dreamy Floating Particles Background */}
          {backgroundStyle === 'particles' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Dreamy floating particles with trails */}
              {Array.from({ length: 30 }).map((_, i) => {
                const x = (i * 8.5) % 100;
                const y = (i * 13.2) % 100;
                const size = 3 + (i % 4);
                const delay = (i * 0.15) % 4;
                const duration = 8 + (i % 6);
                const colors = [
                  'rgba(147, 197, 253, 0.6)',
                  'rgba(196, 181, 253, 0.6)',
                  'rgba(167, 243, 208, 0.6)',
                  'rgba(254, 202, 202, 0.6)',
                ];
                const color = colors[i % colors.length];

                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full blur-sm"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: size,
                      height: size,
                      background: `radial-gradient(circle, ${color}, transparent)`,
                      boxShadow: `0 0 ${size * 3}px ${color}`,
                    }}
                    animate={{
                      y: [0, -50, 0],
                      x: [0, Math.sin(i) * 20, 0],
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.4, 1],
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay,
                    }}
                  />
                );
              })}

              {/* Dreamy connecting trails */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.2]">
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45) * (Math.PI / 180);
                  const centerX = 50;
                  const centerY = 50;
                  const radius = 20;
                  const x1 = centerX + radius * Math.cos(angle);
                  const y1 = centerY + radius * Math.sin(angle);
                  const x2 = centerX + (radius + 25) * Math.cos(angle);
                  const y2 = centerY + (radius + 25) * Math.sin(angle);

                  return (
                    <motion.line
                      key={i}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="rgba(147, 197, 253, 0.4)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      filter="blur(1px)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 0], opacity: [0, 0.4, 0] }}
                      transition={{
                        duration: 12 + (i % 4),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.6,
                      }}
                    />
                  );
                })}
              </svg>
            </motion.div>
          )}

          {/* Dreamy Gradient Blends Background */}
          {backgroundStyle === 'gradient' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Dreamy gradient orbs blending */}
              {[
                { x: '20%', y: '30%', size: 450, color: 'rgba(147, 197, 253, 0.4)', delay: 0, duration: 25 },
                { x: '75%', y: '50%', size: 400, color: 'rgba(196, 181, 253, 0.35)', delay: 5, duration: 28 },
                { x: '50%', y: '70%', size: 420, color: 'rgba(167, 243, 208, 0.3)', delay: 10, duration: 26 },
                { x: '10%', y: '60%', size: 380, color: 'rgba(254, 202, 202, 0.3)', delay: 3, duration: 27 },
              ].map((orb, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-3xl"
                  style={{
                    left: orb.x,
                    top: orb.y,
                    width: orb.size,
                    height: orb.size,
                    background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -35, 35, 0],
                    scale: [1, 1.2, 0.85, 1],
                    opacity: [0.5, 0.7, 0.4, 0.5],
                  }}
                  transition={{
                    duration: orb.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: orb.delay,
                  }}
                />
              ))}

              {/* Dreamy color blend overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-purple-200/15 to-green-200/20" />
            </motion.div>
          )}

          {/* Dreamy Aurora Bands Background */}
          {backgroundStyle === 'aurora' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Dreamy flowing aurora bands */}
              {[
                { delay: 0, duration: 18, y: '30%', opacity: 0.3, color1: 'rgba(147, 197, 253, 0.5)', color2: 'rgba(196, 181, 253, 0.4)' },
                { delay: 2, duration: 20, y: '50%', opacity: 0.25, color1: 'rgba(196, 181, 253, 0.45)', color2: 'rgba(167, 243, 208, 0.35)' },
                { delay: 4, duration: 22, y: '70%', opacity: 0.2, color1: 'rgba(167, 243, 208, 0.4)', color2: 'rgba(254, 202, 202, 0.3)' },
              ].map((band, i) => (
                <motion.div
                  key={i}
                  className="absolute left-0 w-full h-32 blur-2xl"
                  style={{
                    top: band.y,
                    background: `linear-gradient(90deg, transparent, ${band.color1}, ${band.color2}, transparent)`,
                    opacity: band.opacity,
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [band.opacity, band.opacity * 0.6, band.opacity],
                  }}
                  transition={{
                    duration: band.duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: band.delay,
                  }}
                />
              ))}

              {/* Dreamy floating light orbs */}
              {[
                { x: '25%', y: '35%', size: 180, delay: 0, duration: 16 },
                { x: '70%', y: '55%', size: 160, delay: 3, duration: 18 },
                { x: '50%', y: '75%', size: 150, delay: 6, duration: 17 },
              ].map((orb, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-3xl"
                  style={{
                    left: orb.x,
                    top: orb.y,
                    width: orb.size,
                    height: orb.size,
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5), rgba(147, 197, 253, 0.3), transparent)',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: orb.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: orb.delay,
                  }}
                />
              ))}

              {/* Dreamy ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-green-100/30" />
            </motion.div>
          )}
        </div>
      </AnimatePresence>


      {/* Family with House and Beautiful Yard - Hidden */}
      <motion.div
        className="absolute bottom-0 left-[2%] sm:left-[5%] md:left-[8%]"
        style={{
          width: 'clamp(350px, 40vw, 550px)',
          height: 'clamp(250px, 30vw, 450px)',
          bottom: 'clamp(30px, 5vh, 90px)',
          zIndex: 9,
          pointerEvents: 'none',
          display: 'none' // Hidden
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0 }}
      >
        <svg
          viewBox="0 0 400 360"
          className="w-full h-full"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))',
            opacity: 0.95
          }}
        >
          {/* Beautiful Yard - Grass */}
          <rect x="0" y="280" width="400" height="80" fill="#10b981" opacity="0.2" />
          <path
            d="M0,280 Q100,270 200,275 T400,280 L400,360 L0,360 Z"
            fill="#34d399"
            opacity="0.15"
          />

          {/* Yard Flowers */}
          {[
            { x: 50, y: 300, size: 8 },
            { x: 120, y: 310, size: 6 },
            { x: 280, y: 305, size: 7 },
            { x: 350, y: 315, size: 6 },
          ].map((flower, i) => (
            <g key={i}>
              <circle cx={flower.x} cy={flower.y} r={flower.size} fill="#fbbf24" opacity="0.4" />
              <circle cx={flower.x - 3} cy={flower.y - 2} r={flower.size * 0.6} fill="#f59e0b" opacity="0.45" />
              <circle cx={flower.x + 3} cy={flower.y - 2} r={flower.size * 0.6} fill="#f59e0b" opacity="0.45" />
              <circle cx={flower.x} cy={flower.y - 4} r={flower.size * 0.6} fill="#f59e0b" opacity="0.45" />
            </g>
          ))}

          {/* House */}
          <g opacity="0.6">
            {/* House Base */}
            <rect x="120" y="180" width="160" height="100" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />

            {/* Roof */}
            <polygon points="100,180 200,120 300,180" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />

            {/* Roof Shingles */}
            <line x1="150" y1="150" x2="150" y2="180" stroke="#991b1b" strokeWidth="1" opacity="0.5" />
            <line x1="200" y1="120" x2="200" y2="180" stroke="#991b1b" strokeWidth="1" opacity="0.5" />
            <line x1="250" y1="150" x2="250" y2="180" stroke="#991b1b" strokeWidth="1" opacity="0.5" />

            {/* Door */}
            <rect x="180" y="220" width="40" height="60" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <circle cx="210" cy="250" r="3" fill="#fbbf24" />

            {/* Windows */}
            <rect x="140" y="200" width="30" height="30" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
            <line x1="155" y1="200" x2="155" y2="230" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="140" y1="215" x2="170" y2="215" stroke="#3b82f6" strokeWidth="1.5" />

            <rect x="230" y="200" width="30" height="30" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
            <line x1="245" y1="200" x2="245" y2="230" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="230" y1="215" x2="260" y2="215" stroke="#3b82f6" strokeWidth="1.5" />

            {/* Chimney */}
            <rect x="240" y="140" width="25" height="40" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
            <rect x="242" y="135" width="21" height="8" fill="#374151" />
          </g>

          {/* Tree */}
          <g opacity="0.5">
            {/* Tree Trunk */}
            <rect x="320" y="200" width="20" height="80" fill="#92400e" />
            {/* Tree Foliage */}
            <circle cx="330" cy="200" r="35" fill="#10b981" opacity="0.8" />
            <circle cx="310" cy="190" r="25" fill="#059669" opacity="0.7" />
            <circle cx="350" cy="190" r="25" fill="#059669" opacity="0.7" />
          </g>

          {/* Family - Parents and Child */}
          <g opacity="0.65">
            {/* Parent 1 (Left) */}
            <circle cx="80" cy="250" r="12" fill="#fbbf24" opacity="0.9" />
            <rect x="72" y="262" width="16" height="30" fill="#3b82f6" rx="2" />
            <line x1="72" y1="262" x2="60" y2="280" stroke="#1e40af" strokeWidth="2" />
            <line x1="88" y1="262" x2="100" y2="280" stroke="#1e40af" strokeWidth="2" />
            <line x1="80" y1="292" x2="70" y2="310" stroke="#1e40af" strokeWidth="2" />
            <line x1="80" y1="292" x2="90" y2="310" stroke="#1e40af" strokeWidth="2" />

            {/* Parent 2 (Right) */}
            <circle cx="130" cy="250" r="12" fill="#fbbf24" opacity="0.9" />
            <rect x="122" y="262" width="16" height="30" fill="#ec4899" rx="2" />
            <line x1="122" y1="262" x2="110" y2="280" stroke="#be185d" strokeWidth="2" />
            <line x1="138" y1="262" x2="150" y2="280" stroke="#be185d" strokeWidth="2" />
            <line x1="130" y1="292" x2="120" y2="310" stroke="#be185d" strokeWidth="2" />
            <line x1="130" y1="292" x2="140" y2="310" stroke="#be185d" strokeWidth="2" />

            {/* Child (Center) */}
            <circle cx="105" cy="270" r="8" fill="#fbbf24" opacity="0.9" />
            <rect x="100" y="278" width="10" height="20" fill="#8b5cf6" rx="2" />
            <line x1="100" y1="278" x2="92" y2="290" stroke="#6d28d9" strokeWidth="1.5" />
            <line x1="110" y1="278" x2="118" y2="290" stroke="#6d28d9" strokeWidth="1.5" />
            <line x1="105" y1="298" x2="98" y2="310" stroke="#6d28d9" strokeWidth="1.5" />
            <line x1="105" y1="298" x2="112" y2="310" stroke="#6d28d9" strokeWidth="1.5" />

            {/* Brown Dog - Sitting near mom (parent 2) */}
            <g>
              {/* Dog Body - Light brown oval (sitting position, more horizontal) - moved away from mom */}
              <ellipse cx="160" cy="295" rx="10" ry="7" fill="#d97706" stroke="#b45309" strokeWidth="1.2" opacity="0.95" />

              {/* Dog Head - Light brown circle */}
              <circle cx="165" cy="288" r="7" fill="#d97706" stroke="#b45309" strokeWidth="1.2" opacity="0.95" />

              {/* Dog Snout - Small light brown extension */}
              <ellipse cx="170" cy="288" rx="3" ry="2.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" opacity="0.95" />

              {/* Dog Ears - Floppy light brown ears */}
              <ellipse cx="161" cy="283" rx="4" ry="5" fill="#b45309" stroke="#92400e" strokeWidth="0.8" opacity="0.95" />
              <ellipse cx="169" cy="282" rx="4" ry="5" fill="#b45309" stroke="#92400e" strokeWidth="0.8" opacity="0.95" />

              {/* Dog Eyes - Brown/black eyes */}
              <circle cx="163" cy="287" r="1.2" fill="#1f2937" />
              <circle cx="167" cy="287" r="1.2" fill="#1f2937" />

              {/* Dog Nose - Black nose */}
              <ellipse cx="171" cy="288" rx="1.5" ry="1" fill="#1f2937" />

              {/* Dog Tail - Curved light brown tail (wagging position) */}
              <path d="M 150 295 Q 147 290 145 292" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.95" />
              <circle cx="145" cy="292" r="2.5" fill="#d97706" opacity="0.95" />

              {/* Dog Front Paws - Sitting position (front paws visible) */}
              <ellipse cx="165" cy="300" rx="3" ry="4" fill="#b45309" stroke="#92400e" strokeWidth="1" opacity="0.95" />
              <ellipse cx="170" cy="300" rx="3" ry="4" fill="#b45309" stroke="#92400e" strokeWidth="1" opacity="0.95" />

              {/* Dog Back Legs - Sitting position (back legs tucked) */}
              <ellipse cx="155" cy="298" rx="2.5" ry="3.5" fill="#b45309" stroke="#92400e" strokeWidth="0.8" opacity="0.95" />
              <ellipse cx="158" cy="299" rx="2.5" ry="3.5" fill="#b45309" stroke="#92400e" strokeWidth="0.8" opacity="0.95" />

              {/* Dog Chest Marking - Lighter brown chest */}
              <ellipse cx="162" cy="293" rx="4" ry="3" fill="#f59e0b" opacity="0.7" />
            </g>
          </g>

          {/* Yard Path */}
          <path
            d="M200,360 Q200,320 200,280"
            stroke="#d1d5db"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center min-h-0 py-3 sm:py-4 md:py-6 lg:py-8 pb-6 sm:pb-8 md:pb-10 lg:pb-12" style={{ overflow: 'visible' }}>
        {/* Typewriter Text - Hidden when chat is active */}
        <AnimatePresence>
          {!isChatExpanded && (
            <motion.div
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              animate={{ opacity: isChatExpanded ? 0 : 1, height: isChatExpanded ? 0 : 'auto' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative min-h-[80px] sm:min-h-[96px] md:min-h-[112px] lg:min-h-[128px] flex items-center justify-center mb-2 sm:mb-3 md:mb-4 flex-shrink-0 w-full overflow-visible"
              style={{ paddingTop: 'clamp(0.5rem, 1vw, 1rem)', paddingBottom: 'clamp(0.5rem, 1vw, 1rem)' }}
            >
              <motion.h1
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-thin text-foreground leading-tight tracking-tight overflow-visible"
                style={{
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
                  maxWidth: '100%',
                  textOverflow: 'clip',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  padding: 'clamp(0.5rem, 1vw, 1rem) clamp(0.5rem, 2vw, 1rem)',
                  lineHeight: '1.3'
                }}
              >
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="inline-block ml-1"
                  >
                    |
                  </motion.span>
                )}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>


        {/* In-Place Chat Container - Expands within Hero */}
        <motion.div
          ref={chatContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full mx-auto px-2 sm:px-3 md:px-4 relative flex-shrink-0 flex flex-col mt-2 sm:mt-3"
          style={{ maxWidth: 'min(100%, calc(48rem + 4in))' }}
        >
          {/* Voice Recording Indicator */}
          <AnimatePresence>
            {(isListening || isRecording) && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mb-2 flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-red-500"
                />
                <span className="text-sm text-gray-600 font-medium">Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Container - Fixed structure with scrollable messages */}
          <AnimatePresence>
            {isChatExpanded && (
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{ maxHeight: 'clamp(300px, 60vh, 600px)', opacity: 1 }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mb-3 sm:mb-4 overflow-hidden flex flex-col flex-shrink"
                  style={{ maxHeight: 'clamp(300px, 60vh, 600px)' }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/98 backdrop-blur-xl rounded-lg border border-gray-100/80 flex flex-col flex-1 min-h-0"
                    style={{ 
                      maxHeight: 'clamp(300px, 60vh, 600px)', 
                      boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      overflow: 'hidden',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif'
                    }}
                  >
                  {/* Chat Header - Fixed */}
                  <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 pb-3 sm:pb-4 border-b border-gray-100/60 flex-shrink-0 bg-gradient-to-r from-white/50 to-transparent">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-thin text-gray-900 tracking-tight" style={{ fontFamily: 'inherit', letterSpacing: '-0.02em', fontWeight: '300' }}>Bella AI</h3>
                        <p className="text-xs text-gray-500 font-thin tracking-tight" style={{ fontFamily: 'inherit', letterSpacing: '-0.01em', fontWeight: '300' }}>Your mortgage assistant</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsChatExpanded(false);
                        setTimeout(() => setChatMessages([]), 300);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Close chat"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Messages Area - Scrollable */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 md:p-5 pt-3 sm:pt-4 min-h-0" style={{ fontFamily: 'inherit' }}>
                    {chatMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Bot className="w-10 h-10 text-primary/20 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 font-thin tracking-tight" style={{ fontFamily: 'inherit', letterSpacing: '-0.01em', fontWeight: '300' }}>Start chatting with Bella</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4 md:space-y-5">
                        {chatMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
                                <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                              </div>
                            )}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white rounded-br-sm'
                                  : 'bg-gray-50/80 text-gray-900 rounded-bl-sm border border-gray-100/60 backdrop-blur-sm'
                              }`}
                              style={{ 
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif'
                              }}
                            >
                              <p 
                                className={`whitespace-pre-wrap leading-relaxed font-thin tracking-tight`}
                                style={{ 
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
                                  letterSpacing: '-0.02em',
                                  lineHeight: '1.5',
                                  fontWeight: '300',
                                  fontSize: 'clamp(0.8125rem, 0.9vw, 1rem)'
                                }}
                              >
                                {message.content}
                              </p>
                            </motion.div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
                                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                        {isProcessing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-2 sm:gap-3 justify-start"
                          >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
                              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                            </div>
                            <div className="bg-gray-50/80 rounded-lg rounded-bl-sm px-3 py-2 sm:px-4 sm:py-3 border border-gray-100/60 backdrop-blur-sm">
                              <div className="flex gap-2 items-center">
                                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary animate-spin" />
                                <span className="text-xs sm:text-sm text-gray-600 font-thin tracking-tight" style={{ fontFamily: 'inherit', letterSpacing: '-0.01em', fontWeight: '300' }}>Bella is thinking...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input - Always Visible */}
          <div className="flex-shrink-0 mt-2 sm:mt-3" style={{ overflow: 'visible', zIndex: 1000 }}>
            <AIChatInput
              onSend={handleSendMessage}
              onCameraClick={handleCameraClick}
              onVoiceClick={handleVoiceClick}
              onNavigateToPrep={onNavigateToPrep}
              onNavigateToForm1003={onNavigateToForm1003}
              onOpenVoiceAssistant={onOpenVoiceAssistant}
              onRequestCallback={handleRequestCallback}
            />
          </div>

          {/* Hidden File Input for OCR */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

