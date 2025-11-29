import React, { useState } from 'react';

interface BellaOrbitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'voice' | 'chat' | 'files' | 'knowledge';

export function BellaOrbitModal({ isOpen, onClose }: BellaOrbitModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    // TODO: Integrate with backend Bella API
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m Bella, your AI mortgage assistant. How can I help you today?' 
      }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bella</h2>
              <p className="text-sm text-gray-500">Your AI Mortgage Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(['voice', 'chat', 'files', 'knowledge'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'voice' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
              <p className="text-lg text-gray-600">Click to start voice conversation</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Voice Session
              </button>
              <p className="text-sm text-gray-400">Powered by OpenAI Realtime API</p>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-12">
                    <p className="text-lg mb-4">Ask me anything about your mortgage application!</p>
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                        What documents do I need?
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                        Explain loan products
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                        Check my eligibility
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left">
                        What's my next step?
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg text-gray-600">Upload documents or capture with camera</p>
              <div className="flex space-x-3">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upload File
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Capture Photo
                </button>
              </div>
              <p className="text-sm text-gray-400">Bella will analyze and extract data automatically</p>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="space-y-3">
                {['FHA Loan Requirements', 'VA Loan Eligibility', 'Conventional Loan Guidelines', 'USDA Loan Basics'].map((topic) => (
                  <div key={topic} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium text-gray-900">{topic}</h3>
                    <p className="text-sm text-gray-500 mt-1">Learn about {topic.toLowerCase()}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

