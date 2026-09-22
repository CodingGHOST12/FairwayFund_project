'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

type CharitySelectorProps = {
  charities: Array<{ id: string; name: string }>;
  selectedCharityId?: string;
  onSelect: (charityId: string) => void;
};

export function CharitySelector({ charities, selectedCharityId, onSelect }: CharitySelectorProps) {
  const [selected, setSelected] = useState(selectedCharityId || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSelect(selected);
    setLoading(false);
  };

  const options = charities.map(c => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        name="charity"
        label="Select Your Charity"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        options={options}
        placeholder="Choose a charity"
        required
      />

      <Button type="submit" loading={loading} disabled={!selected} className="w-full">
        {loading ? 'Saving...' : 'Save Selection'}
      </Button>
    </form>
  );
}
