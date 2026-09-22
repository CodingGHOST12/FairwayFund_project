import { describe, it, expect, beforeEach } from 'vitest';
import { drawService } from '@/lib/services/draw.service';
import { drawConfig } from '@/lib/draw/draw-config';
import { validateDrawMode, validatePrizeTierTotal } from '@/lib/validation/draw.validation';

describe('Draw System', () => {
  beforeEach(() => {
    drawService._resetForTesting();
  });

  describe('Draw Configuration', () => {
    it('validates random mode as valid', () => {
      expect(validateDrawMode('random')).toBe(true);
      expect(drawConfig.isValidMode('random')).toBe(true);
    });

    it('validates algorithmic mode as valid', () => {
      expect(validateDrawMode('algorithmic')).toBe(true);
      expect(drawConfig.isValidMode('algorithmic')).toBe(true);
    });

    it('rejects invalid draw modes', () => {
      expect(drawConfig.isValidMode('invalid')).toBe(false);
      expect(drawConfig.isValidMode('weighted')).toBe(false);
    });

    it('validates prize tier percentages total 100', () => {
      expect(validatePrizeTierTotal()).toBe(true);
      expect(drawConfig.validatePrizeTierPercentages()).toBe(true);
    });
  });

  describe('Draw Status Transitions', () => {
    it('creates draw in draft status', async () => {
      const draw = await drawService.createDraw('October', 2026, 'random');
      expect(draw.status).toBe('draft');
      expect(draw.mode).toBe('random');
    });

    it('transitions from draft to configuring', async () => {
      const draw = await drawService.createDraw('November', 2026, 'random');
      const configured = await drawService.configureDraw(draw.id, {
        drawId: draw.id,
        mode: 'algorithmic',
        drawDate: new Date('2026-12-01'),
        prizePoolSource: 0,
        configuredAt: new Date(),
      });

      expect(configured.success).toBe(true);
      expect(configured.draw?.status).toBe('configuring');
      expect(configured.draw?.mode).toBe('algorithmic');
    });

    it('transitions from configuring to ready after simulation', async () => {
      const draw = await drawService.createDraw('December', 2026, 'random');
      await drawService.configureDraw(draw.id, {
        drawId: draw.id,
        mode: 'random',
        drawDate: new Date('2027-01-01'),
        prizePoolSource: 0,
        configuredAt: new Date(),
      });

      const simulation = await drawService.simulateDraw(draw.id, 250, 250000);
      expect(simulation.success).toBe(true);
      
      const updated = await drawService.getDrawById(draw.id);
      expect(updated?.status).toBe('ready');
    });
  });

  describe('Draw Service', () => {
    it('retrieves current draw', async () => {
      const draw = await drawService.getCurrentDraw();
      expect(draw).not.toBeNull();
      expect(draw?.status).not.toBe('completed');
    });

    it('retrieves draw by ID', async () => {
      const draw = await drawService.getDrawById('draw-sep-2026');
      expect(draw).not.toBeNull();
      expect(draw?.id).toBe('draw-sep-2026');
    });

    it('retrieves draw history', async () => {
      const history = await drawService.getDrawHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history.every(d => d.status === 'completed')).toBe(true);
    });

    it('gets prize pool for draw', async () => {
      const pool = await drawService.getPrizePool('draw-sep-2026');
      expect(pool).not.toBeNull();
      expect(pool?.total).toBeGreaterThan(0);
    });

    it('creates simulation with correct structure', async () => {
      const draw = await drawService.createDraw('January', 2027, 'random');
      const result = await drawService.simulateDraw(draw.id, 200, 200000);

      expect(result.success).toBe(true);
      expect(result.simulation).toBeDefined();
      expect(result.simulation?.mode).toBe('random');
      expect(result.simulation?.eligibleCount).toBe(200);
      expect(result.simulation?.status).toBe('completed');
      expect(result.simulation?.note).toContain('SIMULATION');
    });
  });

  describe('Draw Modes', () => {
    it('creates draw with random mode', async () => {
      const draw = await drawService.createDraw('February', 2027, 'random');
      expect(draw.mode).toBe('random');
    });

    it('creates draw with algorithmic mode', async () => {
      const draw = await drawService.createDraw('March', 2027, 'algorithmic');
      expect(draw.mode).toBe('algorithmic');
    });

    it('can change mode during configuration', async () => {
      const draw = await drawService.createDraw('April', 2027, 'random');
      const configured = await drawService.configureDraw(draw.id, {
        drawId: draw.id,
        mode: 'algorithmic',
        drawDate: draw.drawDate,
        prizePoolSource: 0,
        configuredAt: new Date(),
      });

      expect(configured.success).toBe(true);
      expect(configured.draw?.mode).toBe('algorithmic');
    });
  });
});
