import { z } from 'zod';

export const scoreSchema = z.object({
  stablefordScore: z.coerce.number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  date: z.union([z.date(), z.string().min(1, 'Date is required')]).refine(
    (val) => {
      const d = val instanceof Date ? val : new Date(val);
      return !isNaN(d.getTime());
    },
    { message: 'Invalid calendar date' }
  ),
  courseName: z.string().optional(),
});

export type ScoreFormData = z.infer<typeof scoreSchema>;

export function normalizeDateOnly(d: Date | string): string {
  if (typeof d === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return d;
    }
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } else if (d instanceof Date && !isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return '';
}

export function parseDateOnly(dateString: string | Date): Date {
  if (dateString instanceof Date) return dateString;
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return new Date(dateString);
}

export function validateNoDuplicateDate(
  newDate: Date | string,
  existingScores: Array<{ id?: string; date: Date | string }>,
  excludeScoreId?: string
): { valid: boolean; error?: string } {
  const newDateString = normalizeDateOnly(newDate);
  if (!newDateString) {
    return { valid: false, error: 'Invalid date provided' };
  }

  const hasDuplicate = existingScores.some((score) => {
    if (excludeScoreId && score.id === excludeScoreId) return false;
    return normalizeDateOnly(score.date) === newDateString;
  });

  if (hasDuplicate) {
    return {
      valid: false,
      error: 'A score already exists for this date. Edit the existing score instead.',
    };
  }

  return { valid: true };
}
