import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, Sparkles, Trophy } from 'lucide-react';

export type BadgeType = 'badge' | 'celebration' | 'achievement';

interface GamificationBadgeProps {
  type: BadgeType;
  title: string;
  message?: string;
  onComplete?: () => void;
}

const GamificationBadge: React.FC<GamificationBadgeProps> = ({ 
  type, 
  title, 
  message,
  onComplete 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'badge':
        return <Award className="h-8 w-8 text-primary" />;
      case 'celebration':
        return <Sparkles className="h-8 w-8 text-yellow-500" />;
      case 'achievement':
        return <Trophy className="h-8 w-8 text-amber-500" />;
      default:
        return <CheckCircle2 className="h-8 w-8 text-primary" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'badge':
        return 'bg-primary/10 border-primary/30 text-primary';
      case 'celebration':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'achievement':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: -20 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: 0.5
        }}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] 
          ${getColors()} rounded-2xl border-2 shadow-2xl p-6 max-w-sm text-center`}
        onAnimationComplete={onComplete}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          {getIcon()}
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold mb-2"
        >
          {title}
        </motion.h3>
        
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-light"
          >
            {message}
          </motion.p>
        )}
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(16, 185, 129, 0.4)',
              '0 0 0 20px rgba(16, 185, 129, 0)',
              '0 0 0 0 rgba(16, 185, 129, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default GamificationBadge;

