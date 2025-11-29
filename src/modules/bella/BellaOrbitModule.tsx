import React, { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'bella';
  content: string;
  timestamp: Date;
}

const BellaOrbitModule: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bella', content: 'Hi! I\'m Bella, your AI mortgage assistant. How can I help you today?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [config, setConfig] = useState({ model: 'gpt-4', temperature: 0.7, ragEnabled: true });

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        'I can help you understand your loan options. Based on your profile, you may qualify for Conventional, FHA, or VA loans.',
        'Let me check the underwriting guidelines for that. For FHA loans, the minimum credit score is typically 580 with 3.5% down.',
        'Great question! The debt-to-income ratio (DTI) is calculated by dividing your total monthly debts by your gross monthly income.',
        'I\'d recommend gathering your W-2s, pay stubs, and bank statements. Would you like me to create a document checklist?',
      ];
      const bellaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bella',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, bellaMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Bella Orbit Configuration</h1>
        <p className="mt-1 text-gray-500">Configure and test the Bella AI assistant.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">AI Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select value={config.model} onChange={(e) => setConfig({ ...config, model: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="gpt-4">GPT-4 (Recommended)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature: {config.temperature}</label>
              <input type="range" min="0" max="1" step="0.1" value={config.temperature} onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>Precise</span><span>Creative</span></div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">RAG Knowledge Base</p>
                <p className="text-sm text-gray-500">Use underwriting guidelines</p>
              </div>
              <button onClick={() => setConfig({ ...config, ragEnabled: !config.ragEnabled })}
                className={`w-12 h-6 rounded-full relative ${config.ragEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${config.ragEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Voice Mode</p>
                <p className="text-sm text-gray-500">Enable voice conversations</p>
              </div>
              <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-12 h-6 rounded-full relative ${voiceEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${voiceEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Bella Preview</h3>
              <p className="text-xs text-gray-500">Test your configuration</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Bella anything..." className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm" />
              {voiceEnabled && (
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">🎤</button>
              )}
              <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">Send</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Knowledge Base</h2>
        <div className="grid grid-cols-3 gap-4">
          {['Underwriting Guidelines', 'Product Matrix', 'Compliance Rules', 'FAQ Database', 'Form Instructions', 'State Regulations'].map(kb => (
            <div key={kb} className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
              <span className="text-xl">📚</span>
              <div>
                <p className="font-medium text-gray-900">{kb}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BellaOrbitModule;
