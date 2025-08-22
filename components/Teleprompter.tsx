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
  const hasStartedRef = useRef<boolean>(false);
  const lastManualScrollRef = useRef<number>(0);

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
      // Resume from last position
      const container = scrollContainerRef.current;
      if (container) {
        // Check if there was manual scrolling since last pause
        const hasManualScroll = Math.abs(currentPosition - lastManualScrollRef.current) > 5; // 5px threshold
        
        if (!hasStartedRef.current) {
          // First time starting
          lastPositionRef.current = currentPosition;
          lastManualScrollRef.current = currentPosition;
          hasStartedRef.current = true;
        }
        else if (isPausedRef.current) {
          if (hasManualScroll) {
            // Manual scroll detected, use new position
            lastPositionRef.current = currentPosition;
            lastManualScrollRef.current = currentPosition;
          }
          // If no manual scroll, keep the stored position
        }
        
        // Start animation
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animateScroll);
        }
      }
      isPausedRef.current = false;
    } else {
      // Pause animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isPausedRef.current = true;
      
      // Store current position when pausing
      const container = scrollContainerRef.current;
      if (container) {
        lastPositionRef.current = container.scrollTop;
        lastManualScrollRef.current = container.scrollTop;
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

  // Reset hasStarted when component unmounts or script changes
  useEffect(() => {
    hasStartedRef.current = false;
    lastManualScrollRef.current = 0;
  }, [lines]);

  // Update lastManualScrollRef when currentPosition changes (manual scroll)
  useEffect(() => {
    lastManualScrollRef.current = currentPosition;
  }, [currentPosition]);

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
      {/* Top and Bottom Fades - Mobile Optimized */}
      <div className="absolute top-0 left-0 right-0 h-1/5 sm:h-1/4 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/5 sm:h-1/4 bg-gradient-to-t from-black to-transparent z-10" />
      
      {/* Focus Line - Mobile Optimized */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 -translate-y-1/2 bg-amber-400/50 z-10 focus-line" />

      {/* Progress Bar - Mobile Optimized */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800 z-20">
        <div 
          className="h-full bg-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Status Indicator - Mobile Optimized */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-mono ${
          isPlaying 
            ? 'bg-green-600 text-white' 
            : 'bg-neutral-700 text-neutral-300'
        }`}>
          {isPlaying ? '▶' : '⏸'}
          <span className="hidden sm:inline ml-1">
            {isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}
          </span>
        </div>
      </div>

      {/* Mobile Touch Instructions */}
      <div className="absolute top-2 left-2 z-20 sm:hidden">
        <div className="px-2 py-1 rounded-full bg-black/50 text-xs text-neutral-300">
          👆 Desliza para navegar
        </div>
      </div>

      <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto scroll-smooth hide-scrollbar">
        <div className="pt-[80vh] sm:pt-[100vh] pb-[80vh] sm:pb-[100vh] max-w-4xl sm:max-w-5xl mx-auto px-3 sm:px-6 lg:px-10">
          {lines.map((line, index) => (
            <div key={index} className="mb-6 sm:mb-8 md:mb-12">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-amber-400 uppercase tracking-widest mb-2 sm:mb-3">
                {line.character !== 'NARRATOR' ? line.character : ''}
              </h2>
              <p className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-normal md:leading-relaxed font-sans ${
                line.character === 'NARRATOR' 
                  ? 'text-gray-500 italic text-center sm:text-left' 
                  : 'text-neutral-100'
              }`}>
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
        
        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .focus-line {
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
          }
        }
        
        /* Touch-friendly scrolling */
        @media (hover: none) and (pointer: coarse) {
          .scroll-smooth {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Teleprompter;