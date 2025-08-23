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

  // Aggressive scroll for mobile compatibility
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Check if we're at the end
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          return;
        }

        // Try multiple scroll methods for maximum compatibility
        const currentTop = container.scrollTop;
        
        // Method 1: Direct scrollTop
        container.scrollTop = currentTop + 1;
        
        // Method 2: scrollBy if scrollTop didn't work
        if (container.scrollTop === currentTop) {
          container.scrollBy(0, 1);
        }
        
        // Method 3: scroll() if both failed
        if (container.scrollTop === currentTop) {
          container.scroll(0, currentTop + 1);
        }
        
        // Method 4: scrollTo if all else failed
        if (container.scrollTop === currentTop) {
          container.scrollTo(0, currentTop + 1);
        }
        
        // Method 5: Force with requestAnimationFrame (nuclear option)
        if (container.scrollTop === currentTop) {
          requestAnimationFrame(() => {
            container.style.transform = `translateY(-${currentTop + 1}px)`;
          });
        }
      }, Math.max(1000 / speed, 20));
      
      intervalRef.current = interval;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Clean up any transform
      const container = scrollContainerRef.current;
      if (container) {
        container.style.transform = '';
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
        className="absolute inset-0 overflow-y-scroll hide-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'manipulation',
          overflow: 'scroll',
          height: '100vh',
          width: '100vw'
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
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