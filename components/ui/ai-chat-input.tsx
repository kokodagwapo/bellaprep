import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send, Camera } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
  "How can i get the best rate?",
  "How much can i afford with my credit score and income?",
  "Can you please guide me to the 1003 form?",
];

interface AIChatInputProps {
  onSend?: (message: string, options?: { thinkActive?: boolean; deepSearchActive?: boolean }) => void;
  onCameraClick?: () => void;
  onVoiceClick?: () => void;
}

const AIChatInput: React.FC<AIChatInputProps> = ({ 
  onSend, 
  onCameraClick,
  onVoiceClick 
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      handleSend();
    }
  };

  const containerVariants = {
    collapsed: {
      minHeight: 56, // Mobile-first: 56px, sm: 68px (handled via className)
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      minHeight: 112, // Mobile-first: 112px, sm: 128px (handled via className)
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
    <div className="w-full flex justify-center items-center text-black px-2 sm:px-4">
      <motion.div
        ref={wrapperRef}
        className="w-full"
        variants={containerVariants}
        animate={isActive || inputValue ? "expanded" : "collapsed"}
        initial="collapsed"
        style={{ 
          overflow: "hidden", 
          borderRadius: "clamp(16px, 4vw, 32px)", 
          background: "#fff",
          maxWidth: 'clamp(100%, 48rem, calc(48rem + 2in))', // Mobile-first: full width, then max-w-3xl
          height: "auto",
          minHeight: isActive || inputValue 
            ? "clamp(112px, 28vw, 128px)" // Mobile: 112px, Desktop: 128px
            : "clamp(56px, 14vw, 68px)" // Mobile: 56px, Desktop: 68px
        }}
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          {/* Input Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-full bg-white w-full">
            <button
              className="p-2 sm:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center"
              title="Attach file"
              type="button"
              tabIndex={-1}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Paperclip size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Camera Icon for OCR */}
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

            {/* Text Input & Placeholder */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
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
            </div>

            <button
              className="p-2 sm:p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center"
              title="Voice input"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onVoiceClick) onVoiceClick();
              }}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Mic size={18} className="sm:w-5 sm:h-5" />
            </button>
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
            className="w-full flex justify-start px-3 sm:px-4 items-center text-xs sm:text-sm"
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
            initial="hidden"
            animate={isActive || inputValue ? "visible" : "hidden"}
            style={{ marginTop: "clamp(4px, 1vh, 8px)" }}
          >
            <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
              {/* Think Toggle */}
              <button
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full transition-all font-light group touch-manipulation min-h-[40px] sm:min-h-[auto] ${
                  thinkActive
                    ? "bg-blue-600/10 outline outline-blue-600/60 text-blue-950"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
                title="Think"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThinkActive((a) => !a);
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Lightbulb
                  className="group-hover:fill-yellow-300 transition-all"
                  size={16}
                  style={{ width: 'clamp(14px, 3.5vw, 18px)', height: 'clamp(14px, 3.5vw, 18px)' }}
                />
                <span className="hidden sm:inline">Think</span>
              </button>

              {/* Deep Search Toggle */}
              <motion.button
                className={`flex items-center px-3 sm:px-4 gap-1 py-2 rounded-full transition font-light whitespace-nowrap overflow-hidden justify-start touch-manipulation min-h-[40px] sm:min-h-[auto] ${
                  deepSearchActive
                    ? "bg-blue-600/10 outline outline-blue-600/60 text-blue-950"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
                title="Deep Search"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeepSearchActive((a) => !a);
                }}
                initial={false}
                animate={{
                  width: deepSearchActive ? "auto" : "clamp(36px, 9vw, 40px)",
                  paddingLeft: deepSearchActive ? "clamp(8px, 2vw, 12px)" : "clamp(8px, 2vw, 9px)",
                  paddingRight: deepSearchActive ? "clamp(8px, 2vw, 12px)" : "clamp(8px, 2vw, 9px)",
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="flex-1 flex items-center justify-center">
                  <Globe size={16} style={{ width: 'clamp(14px, 3.5vw, 18px)', height: 'clamp(14px, 3.5vw, 18px)' }} />
                </div>
                <motion.span
                  className="pb-[2px] hidden sm:inline"
                  initial={false}
                  animate={{
                    opacity: deepSearchActive ? 1 : 0,
                    width: deepSearchActive ? "auto" : 0,
                  }}
                >
                  Deep Search
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export { AIChatInput };

