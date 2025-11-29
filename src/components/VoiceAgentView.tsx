import React from 'react';
import { motion } from 'framer-motion';
import { StopCircle } from './icons';

interface VoiceAgentViewProps {
  isConnecting: boolean;
  transcription: string;
  onStop: () => void;
}

const VoiceAgentView: React.FC<VoiceAgentViewProps> = ({ isConnecting, transcription, onStop }) => {
  return (
    <motion.div
      key="voice-view"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="absolute inset-0 bg-background flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center"
          animate={{ scale: isConnecting ? 1 : [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-24 h-24 bg-primary/40 rounded-full flex items-center justify-center"
            animate={{ scale: isConnecting ? 1 : [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
             <div className="w-16 h-16 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
        <p className="mt-8 text-lg font-medium text-foreground min-h-[50px]">{transcription || ' '}</p>
      </div>

      <div className="flex-shrink-0 w-full flex flex-col items-center">
         <button onClick={onStop} className="w-16 h-16 rounded-full bg-destructive/10 border-2 border-destructive/30 text-destructive flex items-center justify-center" aria-label="Stop Conversation">
            <StopCircle className="w-8 h-8" />
        </button>
        <p className="text-muted-foreground text-xs mt-3">Tap to end conversation</p>
      </div>
    </motion.div>
  );
};

export default VoiceAgentView;