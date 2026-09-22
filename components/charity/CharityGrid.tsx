import { Charity } from '@/types';
import { CharityCard } from './CharityCard';

type CharityGridProps = {
  charities: Charity[];
  selectedCharityId?: string;
  onSelect?: (charityId: string) => void;
  showSelectAction?: boolean;
};

export function CharityGrid({
  charities,
  selectedCharityId,
  onSelect,
  showSelectAction = false,
}: CharityGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {charities.map((charity) => (
        <CharityCard
          key={charity.id}
          charity={charity}
          isSelected={selectedCharityId === charity.id}
          onSelect={onSelect}
          showSelectAction={showSelectAction}
        />
      ))}
    </div>
  );
}
