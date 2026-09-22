import { z } from 'zod';
import { drawConfig } from '@/lib/draw/draw-config';

export const drawConfigurationSchema = z.object({
  mode: z.enum(['random', 'algorithmic'], {
    errorMap: () => ({ message: 'Draw mode must be either random or algorithmic' }),
  }),
  drawDate: z.date({
    required_error: 'Draw date is required',
  }),
  period: z.string().min(1, 'Draw period is required'),
});

export type DrawConfigurationFormData = z.infer<typeof drawConfigurationSchema>;

export const drawCreationSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: z.number().int().min(2024, 'Year must be 2024 or later'),
  mode: z.enum(['random', 'algorithmic']).default('random'),
});

export type DrawCreationFormData = z.infer<typeof drawCreationSchema>;

export const prizeTierPercentagesSchema = z.object({
  fiveMatchPercent: z.number().int().min(0).max(100),
  fourMatchPercent: z.number().int().min(0).max(100),
  threeMatchPercent: z.number().int().min(0).max(100),
}).refine(
  (data) => data.fiveMatchPercent + data.fourMatchPercent + data.threeMatchPercent === 100,
  {
    message: 'Prize tier percentages must total exactly 100%',
    path: ['threeMatchPercent'],
  }
);

export function validateDrawMode(mode: string): boolean {
  return drawConfig.isValidMode(mode);
}

export function validatePrizeTierTotal(): boolean {
  return drawConfig.validatePrizeTierPercentages();
}
