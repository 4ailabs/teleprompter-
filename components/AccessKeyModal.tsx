import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

interface AccessKeyModalProps {
  isOpen: boolean;
  onSubmit: (key: string) => void;
  onClose: () => void;
  error?: string;
}

const AccessKeyModal: React.FC<AccessKeyModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  error
}) => {
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey.trim()) {
      onSubmit(accessKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg shadow-xl max-w-md w-full border border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Clave de Acceso</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 text-sm leading-relaxed">
              <strong>🔐 Acceso Protegido:</strong> Para conectarte al teleprompter y sincronizar con otros dispositivos, necesitas la clave de acceso.
            </p>
          </div>

          {/* Access Key Input */}
          <div className="space-y-2">
            <label htmlFor="accessKey" className="block text-sm font-medium text-neutral-300">
              Clave de Acceso
            </label>
            <div className="relative">
              <input
                id="accessKey"
                type={showKey ? 'text' : 'password'}
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Ingresa la clave de acceso"
                className="w-full px-4 py-3 pr-12 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                title={showKey ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-3">
                <p className="text-red-300 text-sm">
                  <strong>❌ Error:</strong> {error}
                </p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
            <p className="text-neutral-300 text-sm font-medium">💡 Consejos:</p>
            <ul className="text-neutral-400 text-sm space-y-1 list-disc list-inside">
              <li>Solicita la clave al administrador del sistema</li>
              <li>La clave es la misma para todos los dispositivos</li>
              <li>No compartas la clave con personas no autorizadas</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors font-medium shadow-lg"
            >
              Conectar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessKeyModal;

