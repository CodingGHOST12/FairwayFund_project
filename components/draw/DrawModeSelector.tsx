'use client';

import { DrawMode } from '@/types';
import { drawConfig } from '@/lib/draw/draw-config';

type DrawModeSelectorProps = {
  value: DrawMode;
  onChange: (mode: DrawMode) => void;
  disabled?: boolean;
};

export function DrawModeSelector({ value, onChange, disabled = false }: DrawModeSelectorProps) {
  const modes = [drawConfig.modes.random, drawConfig.modes.algorithmic];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-900">
        Draw Mode
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            disabled={disabled}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              value === mode.id
                ? 'border-green-600 bg-green-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                value === mode.id
                  ? 'border-green-600 bg-green-600'
                  : 'border-gray-300 bg-white'
              }`}>
                {value === mode.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{mode.label}</p>
                <p className="text-xs text-gray-600 mt-1">{mode.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {value === 'algorithmic' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
          <strong>Note:</strong> Algorithmic mode uses score-frequency information. 
          The exact weighting implementation is isolated and configurable.
        </div>
      )}
    </div>
  );
}
