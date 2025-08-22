import React, { useState } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward, Settings, X } from 'lucide-react';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Main Controls - Mobile Optimized */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm p-3 sm:p-4 z-20 border-t border-neutral-700">
        
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          {/* Main Play/Pause Button - Mobile Centered */}
          <div className="flex justify-center mb-3">
            <button 
              onClick={onPlayPause}
              className="p-4 rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
          </div>

          {/* Mobile Navigation Row */}
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={onReset}
              className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 active:scale-95"
              title="Inicio"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onSkipBackward}
              className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 active:scale-95"
              title="Retroceder"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onSkipForward}
              className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 active:scale-95"
              title="Avanzar"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onGoToEnd}
              className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 active:scale-95"
              title="Final"
            >
              <FastForward className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 active:scale-95"
              title="Configuración"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Speed Control - Collapsible */}
          {showMobileMenu && (
            <div className="bg-neutral-900 rounded-lg p-3 mb-3 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 text-white mb-2">
                <span className="font-mono text-xs">LENTO</span>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={speed}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="font-mono text-xs">RÁPIDO</span>
              </div>
              <div className="text-center text-xs text-neutral-400">
                Velocidad: <span className="font-mono text-amber-400">{speed}</span> px/s
              </div>
            </div>
          )}

          {/* Mobile Progress Bar */}
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${(currentPosition / 1000) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-x-6">
            
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
          
          {/* Desktop Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800">
            <div 
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${(currentPosition / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Touch Gesture Instructions */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-10 sm:hidden">
        <div className="px-3 py-2 rounded-full bg-black/70 text-xs text-neutral-300 text-center">
          💡 Desliza hacia arriba/abajo para ajustar velocidad
        </div>
      </div>
    </>
  );
};

export default Controls;