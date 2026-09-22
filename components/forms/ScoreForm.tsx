'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ScoreForm() {
  const [formData, setFormData] = useState({
    stablefordScore: '',
    date: '',
    courseName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    setFormData({ stablefordScore: '', date: '', courseName: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        name="stablefordScore"
        label="Stableford Score"
        placeholder="1-45"
        value={formData.stablefordScore}
        onChange={handleChange}
        required
      />

      <Input
        type="date"
        name="date"
        label="Date Played"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <Input
        type="text"
        name="courseName"
        label="Course Name (Optional)"
        placeholder="e.g., Sunnydale Golf Club"
        value={formData.courseName}
        onChange={handleChange}
      />

      <Button type="submit" loading={loading} className="w-full">
        {loading ? 'Adding Score...' : 'Add Score'}
      </Button>
    </form>
  );
}
