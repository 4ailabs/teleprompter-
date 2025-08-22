import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onGoToEnd: () => void;
  currentPosition: number;
}

const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  speed, 
  onSpeedChange, 
  onReset,
  onSkipForward,
  onSkipBackward,
  onGoToEnd,
  currentPosition
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm p-4 z-20 border-t border-neutral-700">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-y-4 sm:gap-x-6">
        
        {/* Left Controls - Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset}
            className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 hover:scale-105"
            title="Ir al inicio (Home)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onSkipBackward}
            className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 hover:scale-105"
            title="Retroceder (←)"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onSkipForward}
            className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 hover:scale-105"
            title="Avanzar (→)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onGoToEnd}
            className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 hover:scale-105"
            title="Ir al final (End)"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        {/* Center Controls - Play/Pause */}
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={onPlayPause}
            className="p-4 rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
            title={isPlaying ? "Pausar (Espacio)" : "Reproducir (Espacio)"}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          
          {/* Keyboard Shortcuts Info */}
          <div className="text-xs text-neutral-400 text-center">
            <div>Espacio: Play/Pause</div>
            <div>↑↓: Velocidad | ←→: Navegar</div>
          </div>
        </div>

        {/* Right Controls - Speed and Info */}
        <div className="flex flex-col items-end gap-3">
          {/* Speed Control */}
          <div className="w-64 flex items-center gap-3 text-white">
            <span className="font-mono text-xs">LENTO</span>
            <input
              type="range"
              min="10"
              max="150"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-colors"
            />
            <span className="font-mono text-xs">RÁPIDO</span>
          </div>
          
          {/* Speed Display */}
          <div className="text-right">
            <div className="text-sm text-neutral-300">
              Velocidad: <span className="font-mono text-amber-400">{speed}</span> px/s
            </div>
            <div className="text-xs text-neutral-500">
              {speed < 30 ? 'Muy lento' : 
               speed < 60 ? 'Lento' : 
               speed < 90 ? 'Normal' : 
               speed < 120 ? 'Rápido' : 'Muy rápido'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800">
        <div 
          className="h-full bg-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${(currentPosition / 1000) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Controls;