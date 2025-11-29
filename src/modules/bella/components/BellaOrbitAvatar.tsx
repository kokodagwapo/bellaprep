import React, { useState } from 'react';
import { BellaOrbitModal } from './BellaOrbitModal';

export function BellaOrbitAvatar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  return (
    <>
      {/* Floating Avatar */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative group"
          aria-label="Open Bella Assistant"
        >
          {/* Orbit Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur-md animate-pulse"></div>
          
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform cursor-pointer">
            B
          </div>

          {/* Notification Badge */}
          {hasSuggestions && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask Bella
          </div>
        </button>
      </div>

      {/* Modal */}
      <BellaOrbitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

