import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Palette, Layout, Target } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  backgroundColor: string;
  onBackgroundChange: (color: string) => void;
  margins: number;
  onMarginsChange: (margins: number) => void;
  cueIndicatorStyle: string;
  onCueIndicatorChange: (style: string) => void;
  mirrorMode: string;
  onMirrorModeChange: (mode: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  isOpen, 
  onClose, 
  fontSize,
  onFontSizeChange,
  backgroundColor,
  onBackgroundChange,
  margins,
  onMarginsChange,
  cueIndicatorStyle,
  onCueIndicatorChange,
  mirrorMode,
  onMirrorModeChange
}) => {
  const [activeTab, setActiveTab] = useState<'font' | 'background' | 'layout' | 'cue' | 'mirror'>('font');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('font');
    }
  }, [isOpen]);

  const backgroundOptions = [
    { value: 'black', label: 'Negro', color: '#000000' },
    { value: 'dark-gray', label: 'Gris Oscuro', color: '#1a1a1a' },
    { value: 'blue', label: 'Azul Oscuro', color: '#0f172a' },
    { value: 'green', label: 'Verde Oscuro', color: '#064e3b' },
    { value: 'purple', label: 'Morado Oscuro', color: '#581c87' },
    { value: 'red', label: 'Rojo Oscuro', color: '#7f1d1d' },
  ];

  const cueIndicatorOptions = [
    { value: 'line', label: 'Línea', icon: '━' },
    { value: 'dot', label: 'Punto', icon: '●' },
    { value: 'arrow', label: 'Flecha', icon: '▶' },
    { value: 'diamond', label: 'Diamante', icon: '◆' },
  ];

  const mirrorOptions = [
    { value: 'normal', label: 'Normal', icon: 'abc', description: 'Texto normal' },
    { value: 'vertical', label: 'Espejo Vertical', icon: 'gpc', description: 'Invertido verticalmente' },
    { value: 'horizontal', label: 'Espejo Horizontal', icon: 'ods', description: 'Invertido horizontalmente' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-neutral-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-2 text-amber-500">
            <SettingsIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Configuración</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('font')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'font' 
                ? 'text-amber-500 border-b-2 border-amber-500 bg-neutral-800' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Font & Size
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'background' 
                ? 'text-amber-500 border-b-2 border-amber-500 bg-neutral-800' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Background
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'layout' 
                ? 'text-amber-500 border-b-2 border-amber-500 bg-neutral-800' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Margins
          </button>
          <button
            onClick={() => setActiveTab('cue')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'cue' 
                ? 'text-amber-500 border-b-2 border-amber-500 bg-neutral-800' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Cue Indicator
          </button>
          <button
            onClick={() => setActiveTab('mirror')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'mirror' 
                ? 'text-amber-500 border-b-2 border-amber-500 bg-neutral-800' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Mirror
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Font & Size Tab */}
          {activeTab === 'font' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white mb-4">
                <SettingsIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Font & Size</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tamaño de Fuente: {fontSize}px
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onFontSizeChange(Math.max(20, fontSize - 4))}
                      className="p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                      disabled={fontSize <= 20}
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={fontSize}
                      onChange={(e) => onFontSizeChange(Number(e.target.value))}
                      className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <button
                      onClick={() => onFontSizeChange(Math.min(120, fontSize + 4))}
                      className="p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                      disabled={fontSize >= 120}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-2">Vista previa:</p>
                  <div className="text-center">
                    <p style={{ fontSize: `${fontSize * 0.4}px` }} className="text-amber-400 font-bold uppercase tracking-widest mb-2">
                      PERSONAJE
                    </p>
                    <p style={{ fontSize: `${fontSize}px` }} className="text-white">
                      Este es un ejemplo del tamaño de fuente seleccionado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Background Tab */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white mb-4">
                <Palette className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Background</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onBackgroundChange(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      backgroundColor === option.value
                        ? 'border-amber-500 bg-neutral-800'
                        : 'border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <div 
                      className="w-full h-8 rounded mb-2"
                      style={{ backgroundColor: option.color }}
                    />
                    <p className="text-sm text-neutral-300">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Layout/Margins Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white mb-4">
                <Layout className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Margins</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Márgenes: {margins}%
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="text-neutral-500 text-sm">0%</div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={margins}
                      onChange={(e) => onMarginsChange(Number(e.target.value))}
                      className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="text-neutral-500 text-sm">30%</div>
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-2">Vista previa:</p>
                  <div 
                    className="bg-neutral-700 rounded p-4"
                    style={{ marginLeft: `${margins}%`, marginRight: `${margins}%` }}
                  >
                    <p className="text-white text-center">
                      Contenido con márgenes del {margins}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cue Indicator Tab */}
          {activeTab === 'cue' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white mb-4">
                <Target className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Cue Indicator</h3>
              </div>
              
              <div className="space-y-3">
                {cueIndicatorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onCueIndicatorChange(option.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      cueIndicatorStyle === option.value
                        ? 'border-amber-500 bg-neutral-800'
                        : 'border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl text-amber-400">{option.icon}</span>
                      <span className="text-white font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-4 bg-neutral-800 rounded-lg">
                <p className="text-sm text-neutral-400 mb-2">Vista previa:</p>
                <div className="relative h-16 bg-neutral-700 rounded flex items-center justify-center">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-amber-400/50" />
                  <span className="text-amber-400 text-lg">
                    {cueIndicatorOptions.find(opt => opt.value === cueIndicatorStyle)?.icon}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mirror Tab */}
          {activeTab === 'mirror' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white mb-4">
                <Target className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Mirror Mode</h3>
              </div>
              
              <div className="space-y-3">
                {mirrorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onMirrorModeChange(option.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      mirrorMode === option.value
                        ? 'border-amber-500 bg-neutral-800'
                        : 'border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono text-amber-400">{option.icon}</span>
                        <span className="text-white font-medium">{option.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400 mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="p-4 bg-neutral-800 rounded-lg">
                <p className="text-sm text-neutral-400 mb-2">Vista previa:</p>
                <div className="relative h-16 bg-neutral-700 rounded flex items-center justify-center">
                  <div 
                    className="text-white text-lg"
                    style={{
                      transform: mirrorMode === 'vertical' ? 'scaleY(-1)' : 
                                mirrorMode === 'horizontal' ? 'scaleX(-1)' : 'none'
                    }}
                  >
                    Ejemplo de texto
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  {mirrorMode === 'normal' && 'Texto normal para lectura directa'}
                  {mirrorMode === 'vertical' && 'Útil para teleprompters con espejo vertical'}
                  {mirrorMode === 'horizontal' && 'Útil para teleprompters con espejo horizontal'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-700 bg-neutral-850">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-colors"
            >
              Aplicar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
