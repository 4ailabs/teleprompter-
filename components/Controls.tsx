import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, onPlayPause, speed, onSpeedChange, onReset }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 backdrop-blur-sm p-4 z-20">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-y-3 sm:gap-x-4">
        <div className="flex items-center gap-2">
            <button 
                onClick={onReset}
                className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                title="Reset"
            >
                <RotateCcw className="w-6 h-6" />
            </button>
        </div>

        <button 
          onClick={onPlayPause}
          className="p-4 rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-transform transform hover:scale-110"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>

        <div className="w-full sm:w-64 flex items-center gap-3 text-white">
          <span className="font-mono text-xs sm:text-sm">LENTO</span>
          <input
            type="range"
            min="10"
            max="150"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="font-mono text-xs sm:text-sm">RÁPIDO</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;