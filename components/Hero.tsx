import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AIChatInput } from './ui/ai-chat-input';

const heroMessages = [
  "I'm Bella — here to guide you toward the best loan, simply and clearly.",
  "How can I help you today?",
  "Tell me about your dream home…"
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

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
          className="w-full max-w-3xl mx-auto px-4"
        >
          <AIChatInput
            onSend={(message) => {
              console.log('Message sent:', message);
              // Handle message sending here
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
    </div>
  );
};

export default Hero;

