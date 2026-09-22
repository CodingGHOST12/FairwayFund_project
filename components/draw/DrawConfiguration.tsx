'use client';

import { useState } from 'react';
import { Draw, DrawMode } from '@/types';
import { Button } from '@/components/ui/Button';
import { DrawModeSelector } from './DrawModeSelector';
import { PrizeTierList } from './PrizeTierList';

type DrawConfigurationProps = {
  draw: Draw;
  onConfigure: (mode: DrawMode, drawDate: Date) => Promise<void>;
};

export function DrawConfiguration({ draw, onConfigure }: DrawConfigurationProps) {
  const [mode, setMode] = useState<DrawMode>(draw.mode);
  const [drawDate, setDrawDate] = useState(
    draw.drawDate.toISOString().split('T')[0]
  );
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfiguring(true);
    try {
      await onConfigure(mode, new Date(drawDate));
    } finally {
      setIsConfiguring(false);
    }
  };

  const canConfigure = draw.status === 'draft' || draw.status === 'configuring';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Draw Configuration</h3>
        <p className="text-sm text-gray-600">
          Configure the draw settings before simulation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="draw-period" className="block text-sm font-bold text-gray-900 mb-2">
            Draw Period
          </label>
          <input
            id="draw-period"
            type="text"
            value={draw.period}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
          />
        </div>

        <div>
          <label htmlFor="draw-date" className="block text-sm font-bold text-gray-900 mb-2">
            Draw Date
          </label>
          <input
            id="draw-date"
            type="date"
            value={drawDate}
            onChange={(e) => setDrawDate(e.target.value)}
            disabled={!canConfigure}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <DrawModeSelector
          value={mode}
          onChange={setMode}
          disabled={!canConfigure}
        />

        <div>
          <p className="text-sm font-bold text-gray-900 mb-3">Prize Distribution</p>
          <PrizeTierList />
        </div>

        {canConfigure && (
          <Button
            type="submit"
            loading={isConfiguring}
            className="w-full"
          >
            Save Configuration
          </Button>
        )}

        {!canConfigure && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            Draw cannot be configured in current status: <strong>{draw.status}</strong>
          </div>
        )}
      </form>
    </div>
  );
}
