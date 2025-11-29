import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Camera,
  Upload,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Phone,
  FileText,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface BellaOrbitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: string;
  currentProduct?: string;
  formContext?: any;
  onMessage?: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
}

export const BellaOrbitModal: React.FC<BellaOrbitModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  currentProduct,
  formContext,
  onMessage,
  onVoiceStart,
  onVoiceEnd,
}) => {
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Orbit animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  // Context-aware greeting
  const getContextualGreeting = useCallback(() => {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    
    if (currentStep) {
      return `${greeting}! I see you're on the ${currentStep} step. How can I help you complete this section?`;
    }
    if (currentProduct) {
      return `${greeting}! You're exploring ${currentProduct} options. I can explain the requirements or help you get started.`;
    }
    return `${greeting}! I'm Bella, your mortgage assistant. How can I help you today?`;
  }, [currentStep, currentProduct]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getContextualGreeting(),
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length, getContextualGreeting]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && mode === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickActions(false);
    setIsTyping(true);
    onMessage?.(inputValue);

    // Simulate AI response (in production, this would call the actual API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateContextualResponse(inputValue, currentStep, currentProduct),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  }, [inputValue, currentStep, currentProduct, onMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      onVoiceEnd?.();
    } else {
      setIsListening(true);
      onVoiceStart?.();
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'explain',
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Explain This Step',
      description: 'Get help understanding the current section',
      action: () => {
        setInputValue(`Can you explain what I need to do in ${currentStep || 'this step'}?`);
        handleSendMessage();
      },
    },
    {
      id: 'requirements',
      icon: <FileText className="w-5 h-5" />,
      label: 'Document Requirements',
      description: 'See what documents you need',
      action: () => {
        setInputValue('What documents do I need to provide?');
        handleSendMessage();
      },
    },
    {
      id: 'tips',
      icon: <Lightbulb className="w-5 h-5" />,
      label: 'Get Tips',
      description: 'Learn best practices',
      action: () => {
        setInputValue('What tips do you have for completing this application?');
        handleSendMessage();
      },
    },
    {
      id: 'call',
      icon: <Phone className="w-5 h-5" />,
      label: 'Talk to Bella',
      description: 'Switch to voice conversation',
      action: () => setMode('voice'),
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onMouseMove={handleMouseMove}
          style={{ rotateX: springRotateX, rotateY: springRotateY }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header with Bella Avatar */}
          <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white">
            {/* Orbiting particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/30"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos((i / 6) * Math.PI * 2) * 60,
                      Math.cos(((i + 1) / 6) * Math.PI * 2) * 60,
                    ],
                    y: [
                      Math.sin((i / 6) * Math.PI * 2) * 30,
                      Math.sin(((i + 1) / 6) * Math.PI * 2) * 30,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Bella Avatar with pulse effect */}
              <div className="relative">
                <motion.div
                  className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(255,255,255,0.4)',
                      '0 0 0 20px rgba(255,255,255,0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Bella</h2>
                <p className="text-white/80 text-sm">Your AI Mortgage Assistant</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setMode('chat')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'chat'
                    ? 'bg-white text-emerald-600'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline-block mr-2" />
                Chat
              </button>
              <button
                onClick={() => setMode('voice')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'voice'
                    ? 'bg-white text-emerald-600'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Mic className="w-4 h-4 inline-block mr-2" />
                Voice
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {mode === 'chat' ? (
              <>
                {/* Messages */}
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-emerald-500 text-white rounded-br-md'
                          : 'bg-white shadow-sm border border-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white shadow-sm border border-gray-100 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Actions */}
                {showQuickActions && messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                          {action.icon}
                          <span className="font-medium text-sm">{action.label}</span>
                        </div>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </button>
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            ) : (
              /* Voice Mode */
              <div className="flex flex-col items-center justify-center h-full">
                <motion.button
                  onClick={toggleVoice}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                  animate={isListening ? {
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.4)',
                      '0 0 0 30px rgba(239, 68, 68, 0)',
                    ],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: isListening ? Infinity : 0,
                  }}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </motion.button>
                <p className="mt-4 text-gray-600">
                  {isListening ? 'Listening... Tap to stop' : 'Tap to start talking'}
                </p>
                {isListening && (
                  <motion.div
                    className="flex gap-1 mt-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-emerald-500 rounded-full"
                        animate={{
                          height: [10, 30, 10],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          {mode === 'chat' && (
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                  title="Upload file"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                  title="Take photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Bella anything..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper function to generate contextual responses
function generateContextualResponse(
  input: string,
  currentStep?: string,
  currentProduct?: string
): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('document') || lowerInput.includes('upload')) {
    return "For your loan application, you'll typically need:\n\n• Driver's license or ID\n• Last 2 pay stubs\n• W-2s from the past 2 years\n• Recent bank statements\n• Tax returns if self-employed\n\nI can help you upload these documents right from here!";
  }

  if (lowerInput.includes('explain') || lowerInput.includes('help')) {
    if (currentStep?.includes('income')) {
      return "In this section, I need to understand your income sources. Please include all types of income:\n\n• Base salary\n• Bonuses and commissions\n• Self-employment income\n• Rental income\n• Investment income\n\nTip: Having stable income for 2+ years strengthens your application!";
    }
    if (currentStep?.includes('property')) {
      return "Here you'll tell us about the property you're interested in. This includes:\n\n• Property address\n• Property type (single family, condo, etc.)\n• How you plan to use it (primary home, investment, etc.)\n• Estimated value\n\nI can help verify the address and show you the property details!";
    }
    return "I'm here to help you complete your mortgage application step by step. What specific question do you have?";
  }

  if (lowerInput.includes('tip') || lowerInput.includes('advice')) {
    return "Here are my top tips for a smooth application:\n\n✅ Keep all documents handy\n✅ Be accurate with your income info\n✅ Don't open new credit lines during the process\n✅ Respond promptly to any requests\n✅ Ask me if anything is unclear!\n\nI'm here to make this as easy as possible.";
  }

  if (lowerInput.includes('credit') || lowerInput.includes('score')) {
    return "Credit score is important for your mortgage. Here's a quick breakdown:\n\n• 740+: Excellent rates\n• 700-739: Good rates\n• 620-699: Acceptable for most loans\n• Below 620: May need FHA or special programs\n\nWould you like me to explain how to improve your score?";
  }

  if (currentProduct) {
    return `For your ${currentProduct} loan, I can help explain the specific requirements and guide you through each step. What would you like to know?`;
  }

  return "I'm here to help with your mortgage journey! You can ask me about:\n\n• Document requirements\n• Application process\n• Credit score questions\n• Income calculations\n• Property requirements\n\nWhat would you like to know?";
}

export default BellaOrbitModal;

