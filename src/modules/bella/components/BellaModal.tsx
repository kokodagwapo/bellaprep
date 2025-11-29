import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ChatInterface from './ChatInterface';
import VoiceConversation from './VoiceConversation';

interface BellaModalProps {
  onClose: () => void;
}

const BellaModal: React.FC<BellaModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Bella Assistant</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setMode(mode === 'chat' ? 'voice' : 'chat')}
              className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {mode === 'chat' ? 'Voice' : 'Chat'}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {mode === 'chat' ? <ChatInterface /> : <VoiceConversation />}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BellaModal;

