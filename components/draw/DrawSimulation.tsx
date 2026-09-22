'use client';

import { useState } from 'react';
import { DrawSimulation as DrawSimulationType, Draw } from '@/types';
import { Button } from '@/components/ui/Button';
import { PrizePoolCard } from './PrizePoolCard';
import { formatDrawDate } from '@/lib/draw/draw-utils';

type DrawSimulationProps = {
  draw: Draw;
  simulation?: DrawSimulationType | null;
  onSimulate: (eligibleCount: number, revenueEstimate: number) => Promise<void>;
};

export function DrawSimulation({ draw, simulation, onSimulate }: DrawSimulationProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [eligibleCount, setEligibleCount] = useState(draw.totalParticipants || 234);
  const [revenueEstimate, setRevenueEstimate] = useState(2340);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await onSimulate(eligibleCount, revenueEstimate * 100);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Draw Simulation</h3>
        <p className="text-sm text-gray-600">
          Preview prize distribution before publishing the draw
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-900">SIMULATION ONLY</p>
            <p className="text-xs text-amber-700 mt-0.5">
              This is a development simulation. No actual winners will be generated or published.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="eligible-count" className="block text-sm font-semibold text-gray-900 mb-2">
            Eligible Subscribers
          </label>
          <input
            id="eligible-count"
            type="number"
            value={eligibleCount}
            onChange={(e) => setEligibleCount(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="revenue-estimate" className="block text-sm font-semibold text-gray-900 mb-2">
            Revenue Estimate (£)
          </label>
          <input
            id="revenue-estimate"
            type="number"
            value={revenueEstimate}
            onChange={(e) => setRevenueEstimate(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0"
          />
        </div>

        <Button
          onClick={handleSimulate}
          loading={isSimulating}
          className="w-full"
        >
          Run Simulation
        </Button>
      </div>

      {simulation && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Simulation Result</p>
            <div className="space-y-1 text-xs text-purple-700">
              <p><strong>Mode:</strong> {simulation.mode}</p>
              <p><strong>Eligible:</strong> {simulation.eligibleCount} subscribers</p>
              <p><strong>Simulated:</strong> {formatDrawDate(simulation.simulatedAt)}</p>
              <p className="pt-2 text-purple-900 font-semibold">{simulation.note}</p>
            </div>
          </div>

          <PrizePoolCard prizePool={simulation.projectedPrizePool} showBreakdown={true} />
        </div>
      )}
    </div>
  );
}
