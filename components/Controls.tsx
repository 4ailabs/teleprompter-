import React, { useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`fixed ${isMobile ? 'bottom-0 left-0 right-0' : 'bottom-0 left-0 right-0'} bg-black bg-opacity-90 backdrop-blur-sm ${isMobile ? 'p-2' : 'p-3 sm:p-4'} z-20 border-t border-neutral-700`}>
      <div className={`max-w-4xl mx-auto flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between gap-4 sm:gap-6'}`}>
        
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Main Play/Pause Button - Centered */}
            <div className="flex justify-center">
              <button 
                onClick={onPlayPause}
                disabled={syncStatus && !syncStatus.canControl}
                className={`p-4 rounded-full ${
                  syncStatus && !syncStatus.canControl 
                    ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' 
                    : isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'
                } text-white transition-colors flex items-center justify-center shadow-lg`}
                title={
                  syncStatus && !syncStatus.canControl 
                    ? 'Solo el Host puede controlar' 
                    : isPlaying ? 'Pausar' : 'Reproducir'
                }
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium min-w-[60px]">Velocidad</span>
              <input
                type="range"
                min="10"
                max="150"
                value={speed}
                onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                disabled={syncStatus && !syncStatus.canControl}
                className={`flex-1 h-2 rounded-lg appearance-none ${
                  syncStatus && !syncStatus.canControl 
                    ? 'bg-neutral-800 cursor-not-allowed opacity-50' 
                    : 'bg-neutral-700 cursor-pointer accent-amber-500'
                }`}
              />
              <span className="text-amber-400 font-mono text-sm min-w-[40px]">{speed}</span>
            </div>

            {/* Control Buttons Row */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Font Size Controls */}
                <button 
                  onClick={() => onFontSizeChange(Math.max(24, fontSize - 4))}
                  className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  title="Reducir fuente"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white text-sm font-mono px-2 py-1 bg-neutral-800 rounded">
                  {fontSize}
                </span>
                <button 
                  onClick={() => onFontSizeChange(Math.min(120, fontSize + 4))}
                  className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  title="Aumentar fuente"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                {/* Remote Control Button */}
                {onOpenRemoteControl && (
                  <button 
                    onClick={onOpenRemoteControl}
                    className={`p-2 rounded-full relative transition-colors ${
                      syncStatus?.isConnected
                        ? 'bg-green-900 bg-opacity-30 text-green-400 hover:bg-green-900 hover:bg-opacity-50'
                        : 'bg-neutral-800 text-green-400 hover:bg-neutral-700 hover:text-green-300'
                    }`}
                    title={syncStatus?.connectedDevices ? `${syncStatus.connectedDevices + 1} dispositivos conectados` : "Control Remoto"}
                  >
                    <Wifi className={`w-4 h-4 ${syncStatus?.isConnected ? 'animate-pulse' : ''}`} />
                    {syncStatus?.connectedDevices > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {syncStatus.connectedDevices + 1}
                      </span>
                    )}
                  </button>
                )}

                {/* Settings Button */}
                {onOpenSettings && (
                  <button 
                    onClick={onOpenSettings}
                    className="p-2 rounded-full bg-neutral-800 text-blue-400 hover:bg-neutral-700 hover:text-blue-300 transition-colors"
                    title="Configuración"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}

                {/* Edit Script Button */}
                {onEditScript && (
                  <button 
                    onClick={onEditScript}
                    className="p-2 rounded-full bg-neutral-800 text-amber-500 hover:bg-neutral-700 hover:text-amber-400 transition-colors"
                    title="Editar Script"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}

                {/* Reset Button */}
                <button 
                  onClick={onReset}
                  className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sync Status for Mobile */}
            {syncStatus && (
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  syncStatus.isConnected 
                    ? 'bg-green-900 bg-opacity-30 text-green-400' 
                    : 'bg-red-900 bg-opacity-30 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${syncStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  {syncStatus.isConnected ? 'Conectado' : 'Desconectado'}
                  {syncStatus.connectedDevices > 0 && ` (${syncStatus.connectedDevices + 1} dispositivos)`}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Desktop Layout */
          <>
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
              disabled={syncStatus && !syncStatus.canControl}
              className={`p-4 rounded-full ${
                syncStatus && !syncStatus.canControl 
                  ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' 
                  : isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'
              } text-white transition-colors flex items-center justify-center shadow-lg`}
              title={
                syncStatus && !syncStatus.canControl 
                  ? 'Solo el Host puede controlar' 
                  : isPlaying ? 'Pausar' : 'Reproducir'
              }
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Speed and Font Controls */}
            <div className="flex items-center gap-4">
              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">Velocidad</span>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={speed}
                  onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                  disabled={syncStatus && !syncStatus.canControl}
                  className={`w-20 h-2 rounded-lg appearance-none ${
                    syncStatus && !syncStatus.canControl 
                      ? 'bg-neutral-800 cursor-not-allowed opacity-50' 
                      : 'bg-neutral-700 cursor-pointer accent-amber-500'
                  }`}
                />
                <span className="text-amber-400 font-mono text-sm w-8">{speed}</span>
              </div>

              {/* Font Size Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onFontSizeChange(Math.max(24, fontSize - 4))}
                  className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  title="Reducir fuente"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white text-sm font-mono px-2 py-1 bg-neutral-800 rounded min-w-[40px] text-center">
                  {fontSize}
                </span>
                <button 
                  onClick={() => onFontSizeChange(Math.min(120, fontSize + 4))}
                  className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  title="Aumentar fuente"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Sync Status */}
              {syncStatus && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  syncStatus.isConnected 
                    ? 'bg-green-900 bg-opacity-30 text-green-400' 
                    : 'bg-red-900 bg-opacity-30 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${syncStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  {syncStatus.isConnected ? 'Conectado' : 'Desconectado'}
                  {syncStatus.connectedDevices > 0 && ` (${syncStatus.connectedDevices + 1})`}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Controls;