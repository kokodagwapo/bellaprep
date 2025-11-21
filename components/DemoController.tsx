import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { generateBellaSpeech } from '../services/geminiService';
import { decodeAudioData, decode } from '../utils/audioUtils';

interface DemoScriptStep {
  time: number;
  action: string;
  text: string;
  targetUrl?: string;
  scrollTarget?: string;
  clickTarget?: string;
  navigateTo?: 'home' | 'prep' | 'form1003' | 'documents';
  fillData?: Record<string, any>;
  waitForElement?: string;
}

const demoScript: DemoScriptStep[] = [
  {
    time: 0,
    action: "Landing Page & Scroll",
    text: "Hi! Welcome to the 'not-boring' way to get a mortgage. This is Prep4Loan. Think of it as the warm-up lap before the marathon... except we make the marathon feel like a walk in the park.",
    navigateTo: 'home',
    scrollTarget: "top"
  },
  {
    time: 8,
    action: "Click 'Start Pre-Evaluation'",
    text: "We start here. No scary forms yet. Just you, me, and some big friendly buttons. It's like a dating app, but for your dream home.",
    navigateTo: 'prep',
    clickTarget: "Start Pre-Evaluation"
  },
  {
    time: 16,
    action: "Step-by-Step Flow - Loan Purpose",
    text: "See how easy this is? 'Purchase a Home', 'Single Family'... I'm just asking the basics. We keep it light because, let's be honest, nobody wakes up excited to fill out paperwork.",
    fillData: { loanPurpose: 'Purchase a Home', propertyType: 'Single Family' }
  },
  {
    time: 24,
    action: "Progress Bar & Checklist",
    text: "Check out the left side. That's Bella—that's me!—keeping you organized. I'm like your personal assistant, but I don't drink all your coffee. I build your checklist in real-time so you know exactly what's happening.",
    scrollTarget: "sidebar"
  },
  {
    time: 32,
    action: "Click 'Document List'",
    text: "And for the documents? I've got super-vision. You upload your W2s, pay stubs, whatever—and I use OCR to read them instantly. I verify them faster than you can say 'low interest rate'.",
    navigateTo: 'documents'
  },
  {
    time: 40,
    action: "Click 'Home Journey' (URLA 1003)",
    text: "Now, for the magic trick. We switch to the Home Journey. This is the serious, official 1003 form that lenders need.",
    navigateTo: 'form1003'
  },
  {
    time: 48,
    action: "Scrolling Form - Pre-filled Data",
    text: "But guess what? You don't have to type it all again! I already moved your info over. Lenders love it because it's perfect; you love it because you're done. Easy, right?",
    scrollTarget: "form-content"
  }
];

interface DemoControllerProps {
  onNavigateTo?: (view: 'home' | 'prep' | 'form1003' | 'documents') => void;
  onFillData?: (data: Record<string, any>) => void;
  onEndDemo?: () => void;
  currentView?: 'home' | 'prep' | 'form1003' | 'documents';
}

const DemoController: React.FC<DemoControllerProps> = ({ 
  onNavigateTo, 
  onFillData,
  onEndDemo,
  currentView = 'home'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const demoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < demoScript.length) {
      playStep(currentStep);
    } else if (currentStep >= demoScript.length) {
      setIsPlaying(false);
      if (onEndDemo) {
        onEndDemo();
      }
    }
  }, [isPlaying, currentStep]);

  const performStepActions = async (step: DemoScriptStep) => {
    // Navigate if needed
    if (step.navigateTo && onNavigateTo) {
      console.log(`🎬 Demo: Navigating to ${step.navigateTo}`);
      onNavigateTo(step.navigateTo);
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Fill data if needed
    if (step.fillData && onFillData) {
      console.log(`🎬 Demo: Filling data`, step.fillData);
      onFillData(step.fillData);
    }

    // Scroll if needed
    if (step.scrollTarget) {
      setTimeout(() => {
        if (step.scrollTarget === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (step.scrollTarget === 'sidebar') {
          const sidebar = document.querySelector('[data-sidebar]');
          if (sidebar) {
            sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (step.scrollTarget === 'form-content') {
          const formContent = document.querySelector('[data-form-content]') || 
                             document.querySelector('.form-content') ||
                             document.querySelector('main');
          if (formContent) {
            formContent.scrollTo({ top: formContent.scrollHeight, behavior: 'smooth' });
          }
        }
      }, 300);
    }

    // Click button if needed
    if (step.clickTarget) {
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
        const targetButton = buttons.find(btn => {
          const text = btn.textContent?.trim() || '';
          return text.includes(step.clickTarget || '') || 
                 btn.getAttribute('aria-label')?.includes(step.clickTarget || '');
        });
        
        if (targetButton) {
          console.log(`🎬 Demo: Clicking button "${step.clickTarget}"`);
          (targetButton as HTMLElement).click();
        } else {
          console.warn(`🎬 Demo: Could not find button "${step.clickTarget}"`);
        }
      }, 500);
    }
  };

  const playStep = async (index: number) => {
    if (index >= demoScript.length) {
      setIsPlaying(false);
      if (onEndDemo) {
        onEndDemo();
      }
      return;
    }

    setCurrentStep(index);
    const step = demoScript[index];
    
    console.log(`🎬 Demo Step ${index + 1}/${demoScript.length}: ${step.action}`);

    // Perform actions first
    await performStepActions(step);

    // Play audio if not muted
    if (!isMuted) {
      setIsLoadingAudio(true);
      try {
        const audioData = await generateBellaSpeech(step.text, true); // Force Gemini voice for demo
        if (audioData && audioContextRef.current) {
          if (currentSourceRef.current) {
            currentSourceRef.current.stop();
          }
          
          const buffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContextRef.current.destination);
          
          source.onended = () => {
            if (isPlaying && currentStep === index) {
              // Calculate delay until next step
              const nextStep = demoScript[index + 1];
              const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
              
              stepTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                  playStep(index + 1);
                }
              }, Math.max(delay - (buffer.duration * 1000), 500));
            }
          };
          
          source.start();
          currentSourceRef.current = source;
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        // Continue even if audio fails
        const nextStep = demoScript[index + 1];
        const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
        stepTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            playStep(index + 1);
          }
        }, delay);
      } finally {
        setIsLoadingAudio(false);
      }
    } else {
      // If muted, still advance after delay
      const nextStep = demoScript[index + 1];
      const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
      stepTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          playStep(index + 1);
        }
      }, delay);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    } else {
      setIsPlaying(true);
      if (currentStep >= demoScript.length) {
        setCurrentStep(0);
      }
    }
  };

  const nextStep = () => {
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
    }
    playStep(currentStep + 1);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
    }
    if (onEndDemo) {
      onEndDemo();
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-6 z-50 bg-white/95 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl p-4 w-80 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-primary text-lg">Bella Live Demo</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            onClick={stopDemo}
            className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-full transition-colors"
            aria-label="Close demo"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="mb-4 min-h-[60px]">
        <p className="text-sm text-gray-700 italic leading-relaxed">
          {isLoadingAudio ? (
            <span className="text-primary">🎤 Bella is speaking...</span>
          ) : (
            `"${demoScript[currentStep]?.text || ''}"`
          )}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={nextStep}
          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-all"
          aria-label="Skip to next step"
        >
          <SkipForward size={24} />
        </button>
        <button
          onClick={resetDemo}
          className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
        >
          Reset
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          Step {currentStep + 1}/{demoScript.length}
        </span>
        <span className="text-gray-400 font-medium">
          {demoScript[currentStep]?.action || 'Demo Complete'}
        </span>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex gap-1">
          {demoScript.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded-full transition-all ${
                idx === currentStep 
                  ? 'bg-primary' 
                  : idx < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DemoController;
