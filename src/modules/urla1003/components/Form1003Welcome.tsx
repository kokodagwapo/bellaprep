import React from 'react';
import { motion } from 'framer-motion';

interface Form1003WelcomeProps {
  onNext: () => void;
}

const Form1003Welcome: React.FC<Form1003WelcomeProps> = ({ onNext }) => {
  const handleClick = () => {
    onNext();
  };

  return (
    <div className="text-center flex flex-col justify-center items-center relative w-full" style={{minHeight: '280px', pointerEvents: 'auto', visibility: 'visible', opacity: 1, zIndex: 10, position: 'relative'}}>
      {/* Content */}
      <div className="px-2 sm:px-4 w-full max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5 md:mb-6"
        >
          <img 
            src={`${import.meta.env.BASE_URL}TeraTrans.png`}
            alt="TERAVERDE Logo" 
            className="w-auto h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] object-contain transition-transform duration-300 hover:scale-105"
            style={{ maxHeight: '50px', width: 'auto', height: 'auto' }}
            onError={(e) => {
              console.error('Logo failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[10px] sm:text-xs md:text-sm font-light text-muted-foreground text-center whitespace-nowrap uppercase tracking-[0.1em]"
            style={{ 
              color: '#9ca3af',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.1em'
            }}
          >
            Business Process Solutions
          </motion.span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-thin text-foreground mb-3 sm:mb-4 leading-[1.1] tracking-[-0.02em]"
          style={{
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
            maxWidth: '100%',
            padding: '0 clamp(0.5rem, 2vw, 1rem)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
            fontWeight: '200'
          }}
        >
          Home Journey
        </motion.h1>

        {/* Get Started Button - Under Home Journey */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full flex justify-center mb-4 sm:mb-5 md:mb-6"
        >
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={false}
            type="button"
            className="group relative w-auto min-w-[160px] sm:min-w-[180px] bg-gradient-to-r from-primary via-primary to-green-600 text-white font-light py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-green-600 hover:via-primary hover:to-primary transition-all duration-500 focus:outline-none focus:ring-3 focus:ring-primary/30 shadow-lg hover:shadow-xl hover:shadow-primary/20 text-sm sm:text-base touch-manipulation min-h-[40px] sm:min-h-[44px] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ 
              pointerEvents: 'auto',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              position: 'relative',
              zIndex: 1001,
              isolation: 'isolate',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '-0.01em',
              fontWeight: '300'
            }}
            aria-label="Get Started"
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              Get Started
              <motion.svg 
                className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </motion.button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-foreground max-w-3xl mx-auto leading-[1.4] tracking-[-0.01em] mb-4 sm:mb-5 md:mb-6 px-2"
          style={{ 
            textShadow: '0 1px 10px rgba(0, 0, 0, 0.03)',
            maxWidth: '100%',
            padding: '0 clamp(0.5rem, 2vw, 1rem)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
            fontWeight: '300',
            color: '#374151'
          }}
        >
          Uniform Residential Loan Application 1003
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-sm sm:text-base md:text-lg font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed tracking-[-0.01em] px-2 mb-0"
          style={{ 
            maxWidth: '100%',
            padding: '0 clamp(0.5rem, 2vw, 1rem)',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif',
            fontWeight: '300',
            color: '#6b7280',
            lineHeight: '1.7',
            letterSpacing: '-0.01em'
          }}
        >
          Bella will guide you through each section step by step, ensuring your application is complete and ready for lender review. With OCR-powered document extraction and real-time insights, Bella helps you complete the form accurately and efficiently.
        </motion.p>
      </div>
    </div>
  );
};

export default Form1003Welcome;

