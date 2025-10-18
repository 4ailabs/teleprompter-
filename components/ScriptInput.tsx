import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';

interface ScriptInputProps {
  isOpen: boolean;
  onClose: () => void;
  currentScript: string;
  onSave: (script: string) => void;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ 
  isOpen, 
  onClose, 
  currentScript, 
  onSave 
}) => {
  const [scriptText, setScriptText] = useState(currentScript);

  useEffect(() => {
    setScriptText(currentScript);
  }, [currentScript, isOpen]);

  const handleSave = () => {
    onSave(scriptText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-neutral-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-2 text-amber-500">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Editor de Script</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-neutral-800 border-b border-neutral-700">
          <p className="text-sm text-neutral-300">
            <strong>Formato:</strong> Escribe tu script con el formato <code className="px-1 py-0.5 bg-neutral-700 rounded text-xs">PERSONAJE: diálogo</code>. 
            Las líneas sin personaje se mostrarán como narración o acotaciones.
          </p>
        </div>

        {/* Text Editor */}
        <div className="flex-1 overflow-hidden p-4">
          <textarea
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            className="w-full h-full bg-neutral-800 text-white p-4 rounded-lg border border-neutral-700 focus:border-amber-500 focus:outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Pega o escribe tu script aquí...&#10;&#10;Ejemplo:&#10;PERSONAJE: Este es un diálogo&#10;NARRADOR: Esta es una acotación&#10;&#10;ESCENA I - Título"
            spellCheck={false}
          />
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-700 bg-neutral-850">
          <div className="text-xs text-neutral-400">
            {scriptText.split('\n').filter(l => l.trim()).length} líneas
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptInput;

