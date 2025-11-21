import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatInput } from './ui/ai-chat-input';
import { X, Bot, User } from 'lucide-react';

const heroMessages = [
  "Home Loans, Simplified. Ask Bella.",
  "How can I help you today?",
  "Tell me about your dream home…"
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isProcessing]);

  return (
    <div className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', marginTop: '-100px', paddingTop: '100px' }}>
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 blur-3xl opacity-20" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mountains - Extended Range Bleeding to Edges */}
        <motion.svg
          className="absolute bottom-0 left-0 h-2/5 opacity-20"
          viewBox="0 0 2400 400"
          style={{ width: 'calc(100vw + 800px)', marginLeft: 0 }}
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
          {/* Additional mountain peaks for continuous range */}
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
            <path
              d="M0,200 Q150,150 300,170 T600,160 T900,175 T1200,165 L1200,200 Z"
              fill="#10b981"
              opacity="0.3"
            />
            <path
              d="M0,200 Q200,160 400,180 T800,170 T1200,180 L1200,200 Z"
              fill="#34d399"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        {/* Sunshine - Increased Intensity */}
        <motion.div
          className="absolute top-[10%] left-[8%] sm:left-[12%]"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 0.7, rotate: 0 }}
          transition={{ duration: 2, delay: 0.8, type: "spring" }}
        >
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50" cy="50" r="25" fill="#fbbf24" opacity="0.7" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 25 * Math.cos(rad);
              const y1 = 50 + 25 * Math.sin(rad);
              const x2 = 50 + 38 * Math.cos(rad);
              const y2 = 50 + 38 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  opacity="0.7"
                />
              );
            })}
          </motion.svg>
        </motion.div>

        {/* Clouds - Increased Intensity */}
        {[
          { x: '15%', y: '20%', delay: 0.3, duration: 8, size: 100 },
          { x: '70%', y: '15%', delay: 0.6, duration: 10, size: 120 },
          { x: '45%', y: '25%', delay: 0.9, duration: 12, size: 90 },
        ].map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: cloud.x, top: cloud.y }}
            initial={{ x: -50, opacity: 0 }}
            animate={{
              x: [0, 30, 0],
              opacity: 0.6,
            }}
            transition={{
              x: { duration: cloud.duration, repeat: Infinity, ease: "easeInOut", delay: cloud.delay },
              opacity: { duration: 1.5, delay: cloud.delay },
            }}
          >
            <svg width={cloud.size} height={cloud.size * 0.5} viewBox="0 0 80 40">
              <ellipse cx="20" cy="25" rx="15" ry="12" fill="#e0e7ff" opacity="0.8" />
              <ellipse cx="35" cy="20" rx="18" ry="15" fill="#c7d2fe" opacity="0.8" />
              <ellipse cx="50" cy="25" rx="15" ry="12" fill="#e0e7ff" opacity="0.8" />
              <ellipse cx="60" cy="22" rx="12" ry="10" fill="#c7d2fe" opacity="0.8" />
            </svg>
          </motion.div>
        ))}

        {/* V-Shaped Stick Birds Flying */}
        {[
          { startX: '5%', startY: '35%', delay: 0, duration: 20, size: 30 },
          { startX: '10%', startY: '40%', delay: 3, duration: 22, size: 25 },
          { startX: '0%', startY: '38%', delay: 6, duration: 25, size: 28 },
          { startX: '8%', startY: '42%', delay: 9, duration: 24, size: 26 },
        ].map((bird, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: bird.startX, top: bird.startY }}
            initial={{ x: '-100px', opacity: 0 }}
            animate={{
              x: ['-100px', 'calc(100vw + 100px)'],
              y: [0, -15, 0, -10, 0],
              opacity: [0, 0.6, 0.6, 0.6, 0],
            }}
            transition={{
              x: { duration: bird.duration, repeat: Infinity, ease: "linear", delay: bird.delay },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: bird.delay },
              opacity: { duration: bird.duration, repeat: Infinity, ease: "easeInOut", delay: bird.delay },
            }}
          >
            <motion.svg
              width={bird.size}
              height={bird.size * 0.6}
              viewBox="0 0 30 18"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
            >
              {/* Simple V-shaped stick bird */}
              <path
                d="M 5 9 L 15 2 L 25 9"
                stroke="#1f2937"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            </motion.svg>
          </motion.div>
        ))}

      </div>

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
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Typewriter Text */}
        <div className="relative h-32 sm:h-40 md:h-48 flex items-center justify-center mb-8 sm:mb-10 md:mb-12">
          <motion.h1
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground leading-tight tracking-tight"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.05)'
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
        </div>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light mb-8 sm:mb-10 md:mb-12"
          style={{ color: '#64748b' }}
        >
          Talk to Bella in your own words — she listens, guides, and helps you feel confident with your loan options.
        </motion.p>

        {/* Chat Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full mx-auto px-4"
          style={{ maxWidth: 'calc(48rem + 4in)' }} // Extended by 2 inches from max-w-3xl (48rem)
        >
          <AIChatInput
            onSend={async (message, options) => {
              console.log('Message sent:', message, 'Options:', options);
              
              // Open chat if not already open
              if (!isChatOpen) {
                setIsChatOpen(true);
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
              
              try {
                // Handle deep search with GPT-5.1 (using GPT-4o)
                if (options?.deepSearchActive) {
                  const { performDeepSearch } = await import('../services/openaiDeepSearchService');
                  const deepSearchResult = await performDeepSearch({
                    query: message,
                    useGPT51: true, // Use latest GPT model
                  });
                  
                  // Add Bella's response to chat
                  const bellaMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: deepSearchResult,
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, bellaMessage]);
                } else {
                  // Regular chat with GPT-5.1 (GPT-4o)
                  const { getBellaChatReplyOpenAI } = await import('../services/openaiChatService');
                  
                  // Build chat history for OpenAI
                  const chatHistory = [...chatMessages, userMessage].map(msg => ({
                    role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
                    content: msg.content
                  }));
                  
                  const bellaReply = await getBellaChatReplyOpenAI(chatHistory);
                  
                  // Add Bella's response to chat
                  const bellaMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: bellaReply,
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, bellaMessage]);
                }
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
            }}
            onCameraClick={() => {
              console.log('OCR camera clicked');
              // Handle OCR camera click here
            }}
            onVoiceClick={() => {
              console.log('Voice input clicked');
              // Handle voice input here
            }}
          />
        </motion.div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsChatOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Bella AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">Powered by GPT-5.1</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Bot className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Start a conversation with Bella!</p>
                      <p className="text-sm text-muted-foreground mt-2">Ask me anything about mortgages, loans, or the application process.</p>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;

