'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { scoreSchema, normalizeDateOnly } from '@/lib/validation/score.validation';
import { CreateScoreInput, GolfScore } from '@/types';

type ScoreFormProps = {
  initialScore?: GolfScore | null;
  onSubmit: (data: CreateScoreInput) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  isModal?: boolean;
};

export function ScoreForm({ initialScore, onSubmit, onCancel, isModal = false }: ScoreFormProps) {
  const [stablefordScore, setStablefordScore] = useState<string>(
    initialScore ? String(initialScore.stablefordScore) : ''
  );
  const [date, setDate] = useState<string>(
    initialScore ? normalizeDateOnly(initialScore.date) : normalizeDateOnly(new Date())
  );
  const [courseName, setCourseName] = useState<string>(
    initialScore?.courseName || ''
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ stablefordScore?: string; date?: string; general?: string }>({});

  useEffect(() => {
    if (initialScore) {
      setStablefordScore(String(initialScore.stablefordScore));
      setDate(normalizeDateOnly(initialScore.date));
      setCourseName(initialScore.courseName || '');
    }
  }, [initialScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const numericScore = parseInt(stablefordScore, 10);

    const validation = scoreSchema.safeParse({
      stablefordScore: isNaN(numericScore) ? undefined : numericScore,
      date,
      courseName: courseName || undefined,
    });

    if (!validation.success) {
      const fieldErrors: { stablefordScore?: string; date?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'stablefordScore') fieldErrors.stablefordScore = err.message;
        if (err.path[0] === 'date') fieldErrors.date = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await onSubmit({
        stablefordScore: numericScore,
        date,
        courseName: courseName.trim() || undefined,
      });

      if (!res.success) {
        setErrors({ general: res.error || 'Failed to save score' });
      } else if (!initialScore) {
        setStablefordScore('');
        setDate(normalizeDateOnly(new Date()));
        setCourseName('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" role="alert">
          {errors.general}
        </div>
      )}

      <div>
        <Input
          type="number"
          name="stablefordScore"
          label="Stableford Points (1 - 45)"
          placeholder="e.g. 36"
          value={stablefordScore}
          onChange={(e) => {
            setStablefordScore(e.target.value);
            setErrors((prev) => ({ ...prev, stablefordScore: undefined, general: undefined }));
          }}
          error={errors.stablefordScore}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Must be an integer score between 1 and 45.</p>
      </div>

      <div>
        <Input
          type="date"
          name="date"
          label="Round Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((prev) => ({ ...prev, date: undefined, general: undefined }));
          }}
          error={errors.date}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Only one score per date is permitted.</p>
      </div>

      <div>
        <Input
          type="text"
          name="courseName"
          label="Course / Club Name (Optional)"
          placeholder="e.g. St Andrews Links, Sunnydale GC"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading} className={onCancel ? 'flex-1' : 'w-full'}>
          {initialScore ? 'Update Score' : 'Save Score'}
        </Button>
      </div>
    </form>
  );
}
