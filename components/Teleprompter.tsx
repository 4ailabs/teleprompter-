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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobileRef = useRef<boolean>(false);

  // Detect mobile device
  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         ('ontouchstart' in window);
  }, []);

  // Mobile-optimized scroll function
  const scrollStep = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if we're at the end
    if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
      return;
    }

    // Move by 1 pixel
    container.scrollTop += 1;
  }, []);

  // Start/stop scrolling - simplified for better mobile support
  useEffect(() => {
    if (isPlaying) {
      // Use setInterval for all devices (more reliable on mobile)
      const interval = setInterval(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Check if we're at the end
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          return;
        }

        // Force scroll on mobile
        const currentTop = container.scrollTop;
        container.scrollTop = currentTop + 1;
        
        // Fallback for mobile browsers that might not update scrollTop immediately
        if (container.scrollTop === currentTop) {
          container.scrollBy(0, 1);
        }
      }, Math.max(1000 / speed, 16)); // Minimum 16ms (60fps)
      
      intervalRef.current = interval;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Top and Bottom Fades */}
      <div className="absolute top-0 left-0 right-0 h-1/5 sm:h-1/4 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/5 sm:h-1/4 bg-gradient-to-t from-black to-transparent z-10" />
      
      {/* Focus Line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 -translate-y-1/2 bg-amber-400/50 z-10" />

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded-full text-sm font-mono ${
          isPlaying 
            ? 'bg-green-600 text-white' 
            : 'bg-neutral-700 text-neutral-300'
        }`}>
          {isPlaying ? 'PLAYING' : 'PAUSED'}
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        className="absolute inset-0 overflow-y-auto scroll-smooth hide-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
          touchAction: 'pan-y'
        }}
      >
        <div className="pt-[50vh] pb-[50vh] max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          {lines.map((line, index) => (
            <div key={index} className="mb-6 sm:mb-8 md:mb-12">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-amber-400 uppercase tracking-widest mb-2 sm:mb-3">
                {line.character !== 'NARRATOR' ? line.character : ''}
              </h2>
              <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-relaxed font-sans ${
                line.character === 'NARRATOR' 
                  ? 'text-gray-500 italic text-center' 
                  : 'text-neutral-100'
              }`} style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none'
              }}>
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
        
        /* Mobile specific fixes */
        @media (max-width: 768px) {
          body {
            overflow: hidden;
            -webkit-overflow-scrolling: touch;
          }
          
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Prevent zoom on mobile */
        @media (max-width: 768px) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Teleprompter;