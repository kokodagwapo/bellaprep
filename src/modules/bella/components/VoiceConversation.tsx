import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceConversation: React.FC = () => {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center mb-8">
        {isListening ? (
          <MicOff className="w-16 h-16 text-white" />
        ) : (
          <Mic className="w-16 h-16 text-white" />
        )}
      </div>
      <button
        onClick={() => setIsListening(!isListening)}
        className={`px-8 py-3 rounded-lg text-white font-semibold ${
          isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isListening ? 'Stop Listening' : 'Start Voice Conversation'}
      </button>
      <p className="mt-4 text-gray-600 text-sm">
        {isListening
          ? 'Bella is listening...'
          : 'Click to start a voice conversation with Bella'}
      </p>
    </div>
  );
};

export default VoiceConversation;

