import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepNavigation from './StepNavigation';
import { generateBellaSpeech } from '../services/geminiService';
import { decodeAudioData, decode } from '../utils/audioUtils';

interface StepWelcomeProps {
  onNext: () => void;
}

const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext }) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context and play Bella voice
    audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const playBellaVoice = async () => {
      try {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        const audioData = await generateBellaSpeech("Let's get started!");
        if (audioData && audioContext) {
          const buffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start();
        }
      } catch (error) {
        console.error('Error playing Bella voice:', error);
      }
    };
    playBellaVoice();
    
    return () => {
      audioContextRef.current?.close().catch(console.error);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Get Started clicked', { onNext, type: typeof onNext });
    if (onNext && typeof onNext === 'function') {
      try {
        onNext();
      } catch (error) {
        console.error('Error in onNext:', error);
      }
    } else {
      console.warn('onNext is not a function:', onNext);
    }
  };

  const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Get Started touched', { onNext, type: typeof onNext });
    if (onNext && typeof onNext === 'function') {
      try {
        onNext();
      } catch (error) {
        console.error('Error in onNext:', error);
      }
    } else {
      console.warn('onNext is not a function:', onNext);
    }
  };

  return (
    <div className="text-center flex flex-col justify-center items-center relative w-full" style={{minHeight: '400px', pointerEvents: 'auto', visibility: 'visible', opacity: 1, zIndex: 10, position: 'relative'}}>
      <div className="px-2 w-full">
        <motion.div 
          animate={{ opacity: 1, display: 'flex' }}
          className="flex flex-col items-center gap-2 mb-4 sm:mb-6"
        >
          <img 
            src={`${import.meta.env.BASE_URL}TeraTrans.png`}
            alt="TERAVERDE Logo" 
            className="w-auto h-auto max-w-[120px] sm:max-w-[140px] object-contain"
            style={{ maxHeight: '60px', width: 'auto', height: 'auto' }}
            onError={(e) => {
              console.error('Logo failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <motion.span
            animate={{ opacity: 1, display: 'flex' }}
            className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center whitespace-nowrap"
            style={{ color: '#6b7280' }}
          >
            Business Process Solutions
          </motion.span>
        </motion.div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Discover Mortgage Possibilities</h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 px-2">Just answer a few questions and you'll get real mortgage rates in minutes. It's that easy.</p>
      </div>
      <div className="px-4 sm:px-0 mt-4 sm:mt-6 w-full flex justify-center relative" style={{zIndex: 100, visibility: 'visible', opacity: 1, pointerEvents: 'auto', position: 'relative'}}>
        <button
          onClick={handleClick}
          onTouchEnd={handleTouch}
          onMouseDown={handleClick}
          type="button"
          className="w-full sm:w-auto sm:min-w-[200px] bg-primary text-white font-bold py-4 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/90 active:bg-primary/85 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg text-base sm:text-lg touch-manipulation min-h-[48px] sm:min-h-[52px] cursor-pointer"
          style={{ 
            pointerEvents: 'auto',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            position: 'relative',
            zIndex: 1001,
            isolation: 'isolate',
            cursor: 'pointer',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          aria-label="Get Started"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default StepWelcome;