import React, { useEffect, useRef } from 'react';
import type { ScriptLine } from '../types';

interface TeleprompterProps {
  lines: ScriptLine[];
  isPlaying: boolean;
  speed: number;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ lines, isPlaying, speed, scrollContainerRef }) => {
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Define the animation loop
    const animateScroll = () => {
      // The speed value from the slider corresponds to pixels per second.
      // We divide by 60 because requestAnimationFrame aims for 60fps.
      const scrollAmount = speed / 60;
      
      if (container.scrollTop < container.scrollHeight - container.clientHeight) {
        container.scrollTop += scrollAmount;
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        // Stop at the end
        if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      }
    };

    if (isPlaying) {
      // Start the animation
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    }

    // Cleanup function to cancel the animation when component unmounts or isPlaying/speed changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed, scrollContainerRef]);


  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Top and Bottom Fades */}
      <div className="absolute top-0 left-0 right-0 h-1/6 sm:h-1/4 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/6 sm:h-1/4 bg-gradient-to-t from-black to-transparent z-10" />
      
      {/* Focus Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-amber-400/50 z-10" />

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
      `}</style>
    </div>
  );
};

export default Teleprompter;