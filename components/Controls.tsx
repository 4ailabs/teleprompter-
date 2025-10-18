import React from 'react';
import { Play, Pause, RotateCcw, FileText, ZoomIn, ZoomOut, Settings, Wifi } from 'lucide-react';
import type { SyncStatus } from '../hooks/useSyncState';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onEditScript?: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onOpenSettings?: () => void;
  onOpenRemoteControl?: () => void;
  syncStatus?: SyncStatus;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
  onReset,
  onEditScript,
  fontSize,
  onFontSizeChange,
  onOpenSettings,
  onOpenRemoteControl,
  syncStatus
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm p-3 sm:p-4 z-20 border-t border-neutral-700">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
        
        <div className="flex gap-2">
          {/* Remote Control Button */}
          {onOpenRemoteControl && (
            <button
              onClick={onOpenRemoteControl}
              className={`p-3 rounded-full relative transition-colors flex items-center justify-center ${
                syncStatus?.isConnected
                  ? 'bg-green-900 bg-opacity-30 text-green-400 hover:bg-green-900 hover:bg-opacity-50'
                  : 'bg-neutral-800 text-green-400 hover:bg-neutral-700 hover:text-green-300'
              }`}
              title={syncStatus?.connectedDevices ? `${syncStatus.connectedDevices + 1} dispositivos conectados` : "Control Remoto"}
            >
              <Wifi className={`w-5 h-5 ${syncStatus?.isConnected ? 'animate-pulse' : ''}`} />
              {syncStatus?.connectedDevices > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {syncStatus.connectedDevices + 1}
                </span>
              )}
            </button>
          )}

          {/* Settings Button */}
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              className="p-3 rounded-full bg-neutral-800 text-blue-400 hover:bg-neutral-700 hover:text-blue-300 transition-colors flex items-center justify-center"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* Edit Script Button */}
          {onEditScript && (
            <button 
              onClick={onEditScript}
              className="p-3 rounded-full bg-neutral-800 text-amber-500 hover:bg-neutral-700 hover:text-amber-400 transition-colors flex items-center justify-center"
              title="Editar Script"
            >
              <FileText className="w-5 h-5" />
            </button>
          )}

          {/* Reset Button */}
          <button 
            onClick={onReset}
            className="p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center justify-center"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          disabled={syncStatus?.role === 'viewer'}
          className={`p-4 rounded-full text-white transition-colors flex items-center justify-center ${
            syncStatus?.role === 'viewer'
              ? 'bg-neutral-700 cursor-not-allowed opacity-50'
              : 'bg-amber-600 hover:bg-amber-500'
          }`}
          title={
            syncStatus?.role === 'viewer'
              ? "No tienes permisos para controlar (modo Visor)"
              : isPlaying ? "Pause" : "Play"
          }
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
            disabled={syncStatus?.role === 'viewer'}
            className={`w-24 sm:w-32 h-2 bg-neutral-700 rounded-lg appearance-none accent-amber-500 ${
              syncStatus?.role === 'viewer' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            title={syncStatus?.role === 'viewer' ? "No tienes permisos para controlar (modo Visor)" : ""}
          />
          <span className="font-mono text-xs sm:text-sm">RÁPIDO</span>
        </div>

        {/* Font Size Control */}
        <div className="flex items-center gap-2 text-white">
          <button
            onClick={() => onFontSizeChange(Math.max(20, fontSize - 4))}
            className="p-2 sm:p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center justify-center"
            title="Disminuir tamaño"
            disabled={fontSize <= 20}
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="font-mono text-xs sm:text-sm whitespace-nowrap">{fontSize}px</span>
          <button
            onClick={() => onFontSizeChange(Math.min(120, fontSize + 4))}
            className="p-2 sm:p-3 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center justify-center"
            title="Aumentar tamaño"
            disabled={fontSize >= 120}
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;