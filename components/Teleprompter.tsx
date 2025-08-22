import React, { useEffect, useRef, useState } from 'react';
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
  const [autoScrollPosition, setAutoScrollPosition] = useState(0);

  // Simple scroll function that works
  const scrollDown = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if we're at the end
    if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
      return;
    }

    // Move scroll by 1 pixel
    container.scrollTop += 1;
    
    // Update our position tracker
    setAutoScrollPosition(container.scrollTop);
  };

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      // When starting play, get current scroll position
      const container = scrollContainerRef.current;
      if (container) {
        setAutoScrollPosition(container.scrollTop);
      }
      
      // Start scrolling
      const interval = setInterval(scrollDown, 1000 / speed);
      intervalRef.current = interval;
    } else {
      // Stop scrolling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed]);

  // Reset on script change
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoScrollPosition(0);
  }, [lines]);

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
      `}</style>
    </div>
  );
};

export default Teleprompter;