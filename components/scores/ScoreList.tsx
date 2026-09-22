import { GolfScore } from '@/types';
import { ScoreRow } from './ScoreRow';

type ScoreListProps = {
  scores: GolfScore[];
  onEdit: (score: GolfScore) => void;
  onDelete: (score: GolfScore) => void;
};

export function ScoreList({ scores, onEdit, onDelete }: ScoreListProps) {
  return (
    <div className="space-y-3">
      {scores.map((score, index) => (
        <ScoreRow
          key={score.id}
          score={score}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
