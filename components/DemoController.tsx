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
    action: "Navigate to Prep4Loan",
    text: "We start here. No scary forms yet. Just you, me, and some big friendly buttons. It's like a dating app, but for your dream home.",
    navigateTo: 'prep'
  },
  {
    time: 16,
    action: "Step-by-Step Flow - Welcome Screen",
    text: "See how easy this is? I'm just asking the basics. We keep it light because, let's be honest, nobody wakes up excited to fill out paperwork. Click 'Get Started' when you're ready."
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
    // Initialize Audio Context - use default sample rate for better compatibility
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
      console.log("✅ Audio context initialized for demo");
    }
    
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

  // Wait for element to appear with retries
  const waitForElement = async (selector: string, maxRetries = 10, delay = 200): Promise<HTMLElement | null> => {
    for (let i = 0; i < maxRetries; i++) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return null;
  };

  // Highlight element for demo visualization
  const highlightElement = (element: HTMLElement) => {
    const originalStyle = element.style.cssText;
    element.style.transition = 'all 0.3s ease';
    element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
    element.style.transform = 'scale(1.02)';
    element.style.zIndex = '9999';
    
    setTimeout(() => {
      element.style.cssText = originalStyle;
    }, 2000);
  };

  const performStepActions = async (step: DemoScriptStep) => {
    // Navigate if needed
    if (step.navigateTo && onNavigateTo) {
      console.log(`🎬 Demo: Navigating to ${step.navigateTo}`);
      onNavigateTo(step.navigateTo);
      // Wait longer for navigation and DOM to update
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Fill data if needed
    if (step.fillData && onFillData) {
      console.log(`🎬 Demo: Filling data`, step.fillData);
      onFillData(step.fillData);
      // Wait for data to be applied
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Click button if needed (do this before scrolling for better UX)
    if (step.clickTarget) {
      // Wait for button to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], a[role="button"]'));
      const targetButton = buttons.find(btn => {
        const text = btn.textContent?.trim() || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const buttonText = step.clickTarget || '';
        
        return text.toLowerCase().includes(buttonText.toLowerCase()) || 
               ariaLabel.toLowerCase().includes(buttonText.toLowerCase()) ||
               text.toLowerCase() === buttonText.toLowerCase();
      }) as HTMLElement | undefined;
      
      if (targetButton) {
        console.log(`🎬 Demo: Clicking button "${step.clickTarget}"`);
        highlightElement(targetButton);
        await new Promise(resolve => setTimeout(resolve, 500));
        targetButton.click();
        // Wait for click action to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn(`🎬 Demo: Could not find button "${step.clickTarget}"`);
        // Try alternative: if navigating to prep, use direct navigation
        if (step.clickTarget.includes('Pre-Evaluation') && onNavigateTo) {
          console.log(`🎬 Demo: Using direct navigation as fallback`);
          onNavigateTo('prep');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // Scroll if needed
    if (step.scrollTarget) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (step.scrollTarget === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step.scrollTarget === 'sidebar') {
        // Try multiple selectors for sidebar
        const sidebar = await waitForElement('[data-sidebar]') ||
                       await waitForElement('aside') ||
                       document.querySelector('.sidebar') as HTMLElement;
        
        if (sidebar) {
          sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
          highlightElement(sidebar);
        } else {
          // Fallback: scroll to checklist area
          const checklist = document.querySelector('[data-checklist]') || 
                           document.querySelector('.checklist');
          if (checklist) {
            checklist.scrollIntoView({ behavior: 'smooth', block: 'start' });
            highlightElement(checklist as HTMLElement);
          }
        }
      } else if (step.scrollTarget === 'form-content') {
        // Try multiple selectors for form content
        const formContent = await waitForElement('[data-form-content]') ||
                           await waitForElement('main') ||
                           document.querySelector('.form-content') as HTMLElement ||
                           document.querySelector('form') as HTMLElement;
        
        if (formContent) {
          formContent.scrollTo({ top: formContent.scrollHeight, behavior: 'smooth' });
          highlightElement(formContent);
        } else {
          // Fallback: scroll window
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }
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
        // Resume audio context if suspended (required for autoplay policies)
        if (audioContextRef.current?.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
            console.log("✅ Audio context resumed for demo playback");
          } catch (e) {
            console.warn("⚠️ Could not resume audio context:", e);
          }
        }

        // Use best agentic voice: OpenAI Nova (best) with Gemini Kore as fallback
        // Don't force Gemini only - let it use the best available voice
        console.log("🎤 Generating speech with best available agentic voice (OpenAI Nova preferred, Gemini Kore fallback)...");
        const audioData = await generateBellaSpeech(step.text, false); // false = use best available (OpenAI first)
        
        if (audioData && audioContextRef.current) {
          if (currentSourceRef.current) {
            currentSourceRef.current.stop();
            currentSourceRef.current.disconnect();
          }
          
          // Decode audio - handle both OpenAI (MP3) and Gemini (PCM) formats
          let audioBuffer: AudioBuffer;
          try {
            // Check if it's MP3 format (OpenAI) by trying to decode as audio file
            // OpenAI returns base64-encoded MP3, which we can decode directly
            const decodedBytes = decode(audioData);
            
            // Try to decode as MP3 first (OpenAI format)
            try {
              // Create a new ArrayBuffer copy from the Uint8Array to avoid type issues
              const arrayBuffer = decodedBytes.buffer.slice(decodedBytes.byteOffset, decodedBytes.byteOffset + decodedBytes.byteLength) as ArrayBuffer;
              audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
              console.log("✅ Decoded as MP3 (OpenAI format)");
            } catch (mp3Error) {
              // If MP3 decode fails, try as PCM (Gemini format)
              console.log("🔄 Trying PCM format (Gemini)...");
              audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
              console.log("✅ Decoded as PCM (Gemini format)");
            }
          } catch (decodeError: any) {
            console.error("❌ Audio decode error:", decodeError);
            throw new Error(`Failed to decode audio: ${decodeError.message}`);
          }
          
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          
          source.onended = () => {
            console.log(`✅ Audio playback completed for step ${index + 1}`);
            if (isPlaying && currentStep === index) {
              // Calculate delay until next step - use actual audio duration
              const nextStep = demoScript[index + 1];
              const audioDuration = audioBuffer.duration * 1000; // Convert to ms
              const scriptedDelay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
              
              // Use the longer of: remaining scripted time or minimum pause
              const remainingTime = Math.max(scriptedDelay - audioDuration, 0);
              const pauseTime = Math.max(remainingTime, 1000); // Minimum 1 second pause
              
              console.log(`⏱️ Step ${index + 1} completed. Audio: ${audioDuration.toFixed(0)}ms, Pausing ${pauseTime.toFixed(0)}ms before next step`);
              
              stepTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                  playStep(index + 1);
                }
              }, pauseTime);
            }
          };
          
          console.log(`🎵 Starting audio playback for step ${index + 1} (duration: ${audioBuffer.duration.toFixed(2)}s)`);
          try {
            source.start(0);
            currentSourceRef.current = source;
            setIsLoadingAudio(false);
          } catch (playError: any) {
            console.error("❌ Audio playback error:", playError);
            setIsLoadingAudio(false);
            // Continue to next step even if audio fails
            const nextStep = demoScript[index + 1];
            const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
            stepTimeoutRef.current = setTimeout(() => {
              if (isPlaying) {
                playStep(index + 1);
              }
            }, delay);
          }
        } else {
          console.error("❌ No audio data received");
          setIsLoadingAudio(false);
          // Continue even if audio generation fails
          const nextStep = demoScript[index + 1];
          const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
          stepTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
              playStep(index + 1);
            }
          }, delay);
        }
      } catch (error) {
        console.error("❌ Error playing audio:", error);
        setIsLoadingAudio(false);
        // Continue even if audio fails
        const nextStep = demoScript[index + 1];
        const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
        stepTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            playStep(index + 1);
          }
        }, delay);
      }
    } else {
      // If muted, still advance after delay (estimate text reading time)
      const nextStep = demoScript[index + 1];
      const estimatedReadingTime = Math.max(step.text.length * 50, 3000); // ~50ms per character, min 3s
      const scriptedDelay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
      const delay = Math.max(estimatedReadingTime, scriptedDelay);
      
      stepTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          playStep(index + 1);
        }
      }, delay);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    } else {
      // Resume audio context on user interaction (required for autoplay policies)
      if (audioContextRef.current?.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          console.log("✅ Audio context resumed on play button click");
        } catch (e) {
          console.warn("⚠️ Could not resume audio context:", e);
        }
      }
      
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

