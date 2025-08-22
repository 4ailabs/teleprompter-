import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  speed, 
  onSpeedChange, 
  onReset
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm p-3 sm:p-4 z-20 border-t border-neutral-700">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center justify-center"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Play/Pause Button */}
        <button 
          onClick={onPlayPause}
          className="p-4 rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-colors flex items-center justify-center"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2 sm:gap-3 text-white">
          <span className="font-mono text-xs sm:text-sm">LENTO</span>
          <input
            type="range"
            min="10"
            max="150"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-24 sm:w-32 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="font-mono text-xs sm:text-sm">RÁPIDO</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;