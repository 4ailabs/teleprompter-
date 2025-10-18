import React, { useEffect, useRef, useCallback, useState } from 'react';
import TimerDisplay from './TimerDisplay';
import type { ScriptLine } from '../types';

interface TeleprompterProps {
  lines: ScriptLine[];
  isPlaying: boolean;
  speed: number;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  currentPosition: number;
  fontSize: number;
  backgroundColor: string;
  margins: number;
  cueIndicatorStyle: string;
  mirrorMode: string;
  startTime: number | null;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ 
  lines, 
  isPlaying, 
  speed, 
  scrollContainerRef,
  currentPosition,
  fontSize,
  backgroundColor,
  margins,
  cueIndicatorStyle,
  mirrorMode,
  startTime
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobileRef = useRef<boolean>(false);
  const [totalHeight, setTotalHeight] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // Detect mobile device and setup touch gestures
  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         ('ontouchstart' in window);
    
    // Add mobile-specific styles
    if (isMobileRef.current) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    
    return () => {
      if (isMobileRef.current) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };
  }, []);

  // Mobile-optimized scroll function
  const scrollStep = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // For vertical mirror mode, we need to scroll backwards
    if (mirrorMode === 'vertical') {
      // Check if we're at the beginning (which is actually the end in normal mode)
      if (container.scrollTop <= 0) {
        return;
      }
      // Move backwards by 1 pixel
      container.scrollTop -= 1;
    } else {
      // Normal scrolling for other modes
      // Check if we're at the end
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        return;
      }
      // Move by 1 pixel
      container.scrollTop += 1;
    }
  }, [mirrorMode]);

  // Aggressive scroll for mobile compatibility
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Handle scrolling based on mirror mode
        if (mirrorMode === 'vertical') {
          // For vertical mirror, scroll backwards
          if (container.scrollTop <= 0) {
            return;
          }
          
          const currentTop = container.scrollTop;
          
          // Method 1: Direct scrollTop
          container.scrollTop = currentTop - 1;
          
          // Method 2: scrollBy if scrollTop didn't work
          if (container.scrollTop === currentTop) {
            container.scrollBy(0, -1);
          }
          
          // Method 3: scroll() if both failed
          if (container.scrollTop === currentTop) {
            container.scroll(0, currentTop - 1);
          }
          
          // Method 4: scrollTo if all else failed
          if (container.scrollTop === currentTop) {
            container.scrollTo(0, currentTop - 1);
          }
        } else {
          // Normal scrolling for other modes
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

  // Calculate total height for progress calculation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setTotalHeight(container.scrollHeight - container.clientHeight);
    }
  }, [lines, fontSize, margins]);

  // Touch gesture handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobileRef.current) return;
    
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchStartTime(Date.now());
    setIsManualScrolling(true);
    
    // Pause auto-scroll when user starts manual scrolling
    if (isPlaying) {
      // We'll handle this in the parent component
    }
  }, [isPlaying]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobileRef.current || !isManualScrolling) return;
    
    const touch = e.touches[0];
    const deltaY = touchStartY - touch.clientY;
    const container = scrollContainerRef.current;
    
    if (container) {
      // Allow manual scrolling
      container.scrollTop += deltaY;
      setTouchStartY(touch.clientY);
    }
  }, [touchStartY, isManualScrolling]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobileRef.current) return;
    
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    
    // If it was a quick tap (less than 200ms), toggle play/pause
    if (touchDuration < 200) {
      const touch = e.changedTouches[0];
      const container = scrollContainerRef.current;
      
      if (container) {
        const rect = container.getBoundingClientRect();
        const tapY = touch.clientY - rect.top;
        
        // Tap in upper third = previous, middle = play/pause, lower third = next
        const third = rect.height / 3;
        
        if (tapY < third) {
          // Previous section (scroll up)
          container.scrollTop -= 200;
        } else if (tapY > third * 2) {
          // Next section (scroll down)
          container.scrollTop += 200;
        } else {
          // Middle section = play/pause toggle
          // This will be handled by the parent component
        }
      }
    }
    
    setIsManualScrolling(false);
  }, [touchStartTime]);

  // Background color mapping
  const getBackgroundColor = (color: string) => {
    const colors = {
      'black': '#000000',
      'dark-gray': '#1a1a1a',
      'blue': '#0f172a',
      'green': '#064e3b',
      'purple': '#581c87',
      'red': '#7f1d1d',
    };
    return colors[color as keyof typeof colors] || '#000000';
  };

  // Cue indicator rendering
  const renderCueIndicator = () => {
    const indicators = {
      'line': <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 -translate-y-1/2 bg-amber-400/50 z-10" />,
      'dot': <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full z-10" />,
      'arrow': <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400 text-2xl z-10">▶</div>,
      'diamond': <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400 text-2xl z-10">◆</div>,
    };
    return indicators[cueIndicatorStyle as keyof typeof indicators] || indicators.line;
  };

  return (
    <div 
      className="fixed inset-0 text-white overflow-hidden"
      style={{ backgroundColor: getBackgroundColor(backgroundColor) }}
    >
      {/* Top and Bottom Fades */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/5 sm:h-1/4 z-10" 
        style={{ background: `linear-gradient(to bottom, ${getBackgroundColor(backgroundColor)}, transparent)` }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/5 sm:h-1/4 z-10" 
        style={{ background: `linear-gradient(to top, ${getBackgroundColor(backgroundColor)}, transparent)` }}
      />
      
      {/* Cue Indicator */}
      {renderCueIndicator()}

      {/* Timer Display */}
      <TimerDisplay
        isPlaying={isPlaying}
        speed={speed}
        currentPosition={currentPosition}
        totalHeight={totalHeight}
        startTime={startTime}
      />

      {/* Status Indicator */}
      <div
        className="absolute top-4 right-4 z-20"
        style={{
          top: 'max(1rem, env(safe-area-inset-top))',
          right: 'max(1rem, env(safe-area-inset-right))'
        }}
      >
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
          touchAction: 'pan-y',
          overflow: 'scroll',
          height: 'calc(var(--vh, 1vh) * 100)',
          width: '100vw',
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleTouchStart(e);
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          handleTouchMove(e);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handleTouchEnd(e);
        }}
      >
        <div
          className="pt-[50vh] pb-[50vh] max-w-4xl mx-auto px-4 sm:px-6 lg:px-10"
          style={{
            marginLeft: `${margins}%`,
            marginRight: `${margins}%`,
            maxWidth: margins > 0 ? 'none' : '64rem',
            transform: mirrorMode === 'vertical' ? 'scaleY(-1)' :
                      mirrorMode === 'horizontal' ? 'scaleX(-1)' : 'none',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
        >
          {lines.map((line, index) => (
            <div key={index} className="mb-6 sm:mb-8 md:mb-12">
              <h2 
                className="font-bold text-amber-400 uppercase tracking-widest mb-2 sm:mb-3"
                style={{ fontSize: `${fontSize * 0.4}px` }}
              >
                {line.character !== 'NARRATOR' ? line.character : ''}
              </h2>
              <p className={`leading-relaxed font-sans ${
                line.character === 'NARRATOR' 
                  ? 'text-gray-500 italic text-center' 
                  : 'text-neutral-100'
              }`} style={{ 
                fontSize: `${fontSize}px`,
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