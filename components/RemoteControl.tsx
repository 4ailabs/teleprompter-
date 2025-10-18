import React, { useState, useEffect } from 'react';
import { X, Share, Wifi, Smartphone, CheckCircle2, AlertCircle, Crown, Gamepad2, Eye } from 'lucide-react';
import QRCode from 'qrcode';
import type { SyncStatus } from '../hooks/useSyncState';
import type { DeviceRole } from '../types';

interface RemoteControlProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: SyncStatus;
  onChangeRole: (role: DeviceRole) => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({
  isOpen,
  onClose,
  syncStatus,
  onChangeRole
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [showCopied, setShowCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<DeviceRole>(syncStatus.role);

  useEffect(() => {
    if (isOpen) {
      // Get current URL - use the network URL if available
      let baseUrl = window.location.origin + window.location.pathname;

      // If we're on localhost, show a message to check the console for network URL
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        // Try to get the network URL from the page
        // Vite shows network URLs in the console, but we can construct it
        const hostname = window.location.hostname;
        const port = window.location.port;

        // Keep localhost for now, user will see network URL in dev server console
        baseUrl = `${window.location.protocol}//${hostname}:${port}${window.location.pathname}`;
      }

      // Add role parameter based on selected role
      const url = `${baseUrl}?role=${selectedRole}`;
      setCurrentUrl(url);

      // Generate QR code for the current URL
      QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeDataUrl);
    }
  }, [isOpen, selectedRole]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-neutral-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-2 text-green-400">
            <Smartphone className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Mobile Control</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Connection Status */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg border-2 ${
              syncStatus.isConnected
                ? 'bg-green-900 bg-opacity-20 border-green-500'
                : 'bg-red-900 bg-opacity-20 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {syncStatus.isConnected ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-semibold ${
                      syncStatus.isConnected ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {syncStatus.isConnected ? 'Conectado' : 'Desconectado'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {syncStatus.connectedDevices > 0
                        ? `${syncStatus.connectedDevices + 1} dispositivos sincronizados`
                        : 'Esperando conexiones...'}
                    </p>
                  </div>
                </div>
                {syncStatus.isConnected && (
                  <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
                )}
              </div>
              {syncStatus.lastSync && (
                <p className="text-xs text-neutral-500 mt-2">
                  Última sincronización: {new Date(syncStatus.lastSync).toLocaleTimeString()}
                </p>
              )}
              {syncStatus.error && (
                <p className="text-xs text-red-400 mt-2">
                  Error: {syncStatus.error}
                </p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              Rol de este dispositivo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Host Role */}
              <button
                onClick={() => {
                  setSelectedRole('host');
                  onChangeRole('host');
                  localStorage.setItem('teleprompter-role', 'host');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  syncStatus.role === 'host'
                    ? 'bg-amber-900 bg-opacity-30 border-amber-500 shadow-lg'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                <Crown className={`w-8 h-8 mx-auto mb-2 ${
                  syncStatus.role === 'host' ? 'text-amber-400' : 'text-neutral-500'
                }`} />
                <p className={`text-sm font-semibold ${
                  syncStatus.role === 'host' ? 'text-amber-400' : 'text-neutral-400'
                }`}>
                  Host
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Control total
                </p>
              </button>

              {/* Controller Role */}
              <button
                onClick={() => {
                  setSelectedRole('controller');
                  onChangeRole('controller');
                  localStorage.setItem('teleprompter-role', 'controller');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  syncStatus.role === 'controller'
                    ? 'bg-blue-900 bg-opacity-30 border-blue-500 shadow-lg'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                <Gamepad2 className={`w-8 h-8 mx-auto mb-2 ${
                  syncStatus.role === 'controller' ? 'text-blue-400' : 'text-neutral-500'
                }`} />
                <p className={`text-sm font-semibold ${
                  syncStatus.role === 'controller' ? 'text-blue-400' : 'text-neutral-400'
                }`}>
                  Control
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Puede controlar
                </p>
              </button>

              {/* Viewer Role */}
              <button
                onClick={() => {
                  setSelectedRole('viewer');
                  onChangeRole('viewer');
                  localStorage.setItem('teleprompter-role', 'viewer');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  syncStatus.role === 'viewer'
                    ? 'bg-purple-900 bg-opacity-30 border-purple-500 shadow-lg'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                <Eye className={`w-8 h-8 mx-auto mb-2 ${
                  syncStatus.role === 'viewer' ? 'text-purple-400' : 'text-neutral-500'
                }`} />
                <p className={`text-sm font-semibold ${
                  syncStatus.role === 'viewer' ? 'text-purple-400' : 'text-neutral-400'
                }`}>
                  Visor
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Solo lectura
                </p>
              </button>
            </div>

            {/* Role Description */}
            <div className="mt-3 p-3 bg-neutral-800 rounded-lg">
              <p className="text-xs text-neutral-400">
                {syncStatus.role === 'host' && '👑 Host: Control total sobre el teleprompter. Ideal para el operador principal.'}
                {syncStatus.role === 'controller' && '🎮 Control: Puede controlar play/pause y velocidad. Ideal para asistentes.'}
                {syncStatus.role === 'viewer' && '👁️ Visor: Solo visualiza el contenido sincronizado. Ideal para actores/presentadores.'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-6">
            <Smartphone className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Control Remoto</h3>
            <p className="text-sm text-neutral-300">
              Abre esta URL en cualquier dispositivo para controlar el teleprompter de forma sincronizada.
            </p>
          </div>

          {/* URL Display */}
          <div className="mb-6">
            <label className="block text-xs text-neutral-400 mb-2 uppercase tracking-wide">
              URL para compartir ({selectedRole})
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-neutral-800 rounded-lg">
                <span className="text-white font-mono text-sm break-all">{currentUrl}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors relative"
                title="Copiar al portapapeles"
              >
                <Share className="w-5 h-5 text-green-400" />
                {showCopied && (
                  <span className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ¡Copiado!
                  </span>
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              💡 Selecciona un rol arriba para cambiar la URL que se comparte
            </p>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-lg">
              <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">Cómo usar:</h4>
              <ol className="text-sm text-neutral-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">1.</span>
                  <span>Abre esta URL en cualquier dispositivo (teléfono, tablet, laptop)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">2.</span>
                  <span>Los cambios se sincronizan automáticamente entre pestañas del navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">3.</span>
                  <span>Controla el teleprompter desde cualquier pestaña</span>
                </li>
              </ol>
            </div>

            <div className="p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Sincronización Automática</span>
              </div>
              <p className="text-xs text-blue-300 leading-relaxed">
                {(import.meta as any).env?.DEV ? (
                  <>
                    <strong>Modo Desarrollo:</strong> Sincronización completa habilitada.
                    <br />• Entre pestañas: Automático vía BroadcastChannel
                    <br />• Entre dispositivos: WebSocket (misma red WiFi)
                  </>
                ) : (
                  <>
                    <strong>Modo Producción:</strong> Sincronización entre pestañas del mismo navegador.
                    <br />• ✅ Múltiples pestañas/ventanas
                    <br />• ⚠️ No disponible: Dispositivos diferentes
                  </>
                )}
              </p>
            </div>

            <div className="p-4 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Estados Sincronizados</span>
              </div>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>• Play/Pause</li>
                <li>• Velocidad de scroll</li>
                <li>• Posición actual</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-700 bg-neutral-850">
          <div className="text-center">
            <p className="text-xs text-neutral-500">
              Perfecto para presentaciones y control multi-dispositivo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteControl;