'use client';

import { useState } from 'react';
import { useDraw } from '@/hooks/useDraw';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { DrawOverview } from '@/components/draw/DrawOverview';
import { DrawConfiguration } from '@/components/draw/DrawConfiguration';
import { DrawSimulation } from '@/components/draw/DrawSimulation';
import { DrawEmptyState } from '@/components/draw/DrawEmptyState';
import { DrawResultDisplay } from '@/components/draw/DrawResultDisplay';
import { Button } from '@/components/ui/Button';
import { drawService } from '@/lib/services/draw.service';
import { DrawMode } from '@/types';

export function AdminDrawsContent() {
  const { draw, isLoading, error, refreshDraw, simulateDraw } = useDraw();
  const [simulation, setSimulation] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleConfigure = async (mode: DrawMode, drawDate: Date) => {
    if (!draw) return;
    
    const result = await drawService.configureDraw(draw.id, {
      drawId: draw.id,
      mode,
      drawDate,
      prizePoolSource: 0,
      configuredAt: new Date(),
    });

    if (result.success) {
      await refreshDraw();
    }
  };

  const handleSimulate = async (eligibleCount: number, revenueEstimate: number) => {
    if (!draw) return;
    
    const result = await simulateDraw(draw.id, eligibleCount, revenueEstimate);
    if (result.success && result.simulation) {
      setSimulation(result.simulation);
    }
  };

  const handleExecute = async () => {
    if (!draw) return;
    
    setIsExecuting(true);
    setActionError(null);
    
    try {
      const execResult = await drawService.executeDraw(draw.id);
      if (execResult.success && execResult.result) {
        setResult(execResult.result);
        await refreshDraw();
      } else {
        setActionError(execResult.error || 'Failed to execute draw');
      }
    } catch (err) {
      setActionError('An error occurred while executing the draw');
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePublish = async () => {
    if (!draw) return;
    
    setIsPublishing(true);
    setActionError(null);
    
    try {
      const pubResult = await drawService.publishDraw(draw.id);
      if (pubResult.success) {
        await refreshDraw();
        alert('Draw published successfully! Results are now visible to subscribers.');
      } else {
        setActionError(pubResult.error || 'Failed to publish draw');
      }
    } catch (err) {
      setActionError('An error occurred while publishing the draw');
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const loadResult = async () => {
    if (!draw) return;
    const drawResult = await drawService.getDrawResult(draw.id);
    if (drawResult) {
      setResult(drawResult);
    }
  };

  if (isLoading) {
    return <Loading text="Loading draw administration..." />;
  }

  if (error) {
    return <ErrorState message={error} retry={refreshDraw} />;
  }

  if (!draw) {
    return (
      <DrawEmptyState 
        message="No active draw available. Create a new draw to get started."
        actionLabel="Create New Draw"
      />
    );
  }

  const canExecute = draw.status === 'ready' || draw.status === 'configuring';
  const canPublish = draw.status === 'ready' && result !== null;
  const isPublished = draw.status === 'published' || draw.status === 'completed';

  return (
    <div className="space-y-8">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm font-semibold text-blue-900">
          Step 7B: Draw Execution & Results
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Execute the draw to generate winners, then publish results to make them visible to subscribers.
        </p>
      </div>

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
          {actionError}
        </div>
      )}

      <DrawOverview draw={draw} showActions={false} />

      {/* Draw Actions */}
      {!isPublished && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Draw Actions</h3>
          
          <div className="flex flex-wrap gap-3">
            {canExecute && (
              <Button
                onClick={handleExecute}
                loading={isExecuting}
                size="lg"
              >
                Execute Draw
              </Button>
            )}
            
            {canPublish && (
              <Button
                onClick={handlePublish}
                loading={isPublishing}
                variant="outline"
                size="lg"
              >
                Publish Results
              </Button>
            )}
            
            {result && !isPublished && (
              <Button
                onClick={loadResult}
                variant="ghost"
                size="lg"
              >
                View Result
              </Button>
            )}
          </div>

          {!canExecute && !canPublish && !isPublished && (
            <p className="text-sm text-gray-600">
              Configure and simulate the draw before execution.
            </p>
          )}
        </div>
      )}

      {/* Draw Result Display */}
      {(result || isPublished) && (
        <DrawResultDisplay 
          result={result} 
          drawId={draw.id}
          isPublished={isPublished}
        />
      )}

      {/* Configuration and Simulation (only if not published) */}
      {!isPublished && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DrawConfiguration 
            draw={draw}
            onConfigure={handleConfigure}
          />
          
          <DrawSimulation 
            draw={draw}
            simulation={simulation}
            onSimulate={handleSimulate}
          />
        </div>
      )}
    </div>
  );
}
