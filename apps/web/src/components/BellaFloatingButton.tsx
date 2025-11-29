import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { BellaOrbitModal } from './BellaOrbitModal';

interface BellaFloatingButtonProps {
  currentStep?: string;
  currentProduct?: string;
  formContext?: any;
  className?: string;
}

export const BellaFloatingButton: React.FC<BellaFloatingButtonProps> = ({
  currentStep,
  currentProduct,
  formContext,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 3 seconds on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
      setShowPulse(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-40 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.5 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute right-16 bottom-2 bg-white rounded-lg shadow-lg p-3 w-48 border border-gray-100"
            >
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Need help?</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ask Bella anything about your application
                  </p>
                </div>
              </div>
              <div className="absolute right-[-6px] bottom-4 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-[-45deg]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
            setShowPulse(false);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulse Effect */}
          {showPulse && (
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500"
              animate={{
                scale: [1, 1.8],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}

          {/* Orbiting dots on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/60"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: [0.6, 0.3, 0.6],
                      rotate: 360,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      rotate: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 0.3,
                      },
                      opacity: {
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.2,
                      },
                    }}
                    style={{
                      transformOrigin: '0 0',
                      left: '50%',
                      top: '50%',
                      x: Math.cos((i * 120 * Math.PI) / 180) * 32 - 4,
                      y: Math.sin((i * 120 * Math.PI) / 180) * 32 - 4,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Icon */}
          <motion.div
            animate={isHovered ? { rotate: 15 } : { rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>

          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        </motion.button>

        {/* Expand label on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              Chat with Bella
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <BellaOrbitModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentStep={currentStep}
        currentProduct={currentProduct}
        formContext={formContext}
      />
    </>
  );
};

export default BellaFloatingButton;

