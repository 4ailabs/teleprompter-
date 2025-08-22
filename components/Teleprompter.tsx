import React, { useEffect, useRef, useCallback } from 'react';
import type { ScriptLine } from '../types';

interface TeleprompterProps {
  lines: ScriptLine[];
  isPlaying: boolean;
  speed: number;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  currentPosition: number;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ 
  lines, 
  isPlaying, 
  speed, 
  scrollContainerRef,
  currentPosition 
}) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  // Improved animation with smooth pause/resume
  const animateScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !isPlaying) return;

    // Calculate scroll amount based on speed
    const scrollAmount = speed / 60;
    
    // Check if we've reached the end
    if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
      // Stop at the end
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Smooth scrolling with position memory
    container.scrollTop += scrollAmount;
    lastPositionRef.current = container.scrollTop;
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [isPlaying, speed, scrollContainerRef]);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying) {
      // Resume from last position or current position
      const container = scrollContainerRef.current;
      if (container && !isPausedRef.current) {
        // If not paused, start from current position
        lastPositionRef.current = currentPosition;
      }
      
      // Start animation
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
      isPausedRef.current = false;
    } else {
      // Pause animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isPausedRef.current = true;
      
      // Store current position
      const container = scrollContainerRef.current;
      if (container) {
        lastPositionRef.current = container.scrollTop;
      }
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, animateScroll, scrollContainerRef, currentPosition]);

  // Handle speed changes
  useEffect(() => {
    if (isPlaying && animationFrameRef.current) {
      // Restart animation with new speed
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    }
  }, [speed, isPlaying, animateScroll]);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return 100;
    
    return Math.min((currentPosition / maxScroll) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Top and Bottom Fades */}
      <div className="absolute top-0 left-0 right-0 h-1/6 sm:h-1/4 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/6 sm:h-1/4 bg-gradient-to-t from-black to-transparent z-10" />
      
      {/* Focus Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-amber-400/50 z-10 focus-line" />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800 z-20">
        <div 
          className="h-full bg-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded-full text-xs font-mono ${
          isPlaying 
            ? 'bg-green-600 text-white' 
            : 'bg-neutral-700 text-neutral-300'
        }`}>
          {isPlaying ? '▶ REPRODUCIENDO' : '⏸ PAUSADO'}
        </div>
      </div>

      <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto scroll-smooth hide-scrollbar">
        <div className="pt-[100vh] pb-[100vh] max-w-5xl mx-auto px-4 sm:px-10">
          {lines.map((line, index) => (
            <div key={index} className="mb-8 md:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 uppercase tracking-widest mb-2">
                {line.character !== 'NARRATOR' ? line.character : ''}
              </h2>
              <p className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-normal sm:leading-relaxed font-sans ${line.character === 'NARRATOR' ? 'text-gray-500 italic' : 'text-neutral-100'}`}>
                {line.dialogue}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .focus-line {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Teleprompter;