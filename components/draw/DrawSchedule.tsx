import { Draw } from '@/types';
import { formatDrawDate } from '@/lib/draw/draw-utils';
import { DrawStatus } from './DrawStatus';

type DrawScheduleProps = {
  draw: Draw;
};

export function DrawSchedule({ draw }: DrawScheduleProps) {
  const isUpcoming = new Date() < draw.drawDate;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Draw Schedule</h3>
        <DrawStatus status={draw.status} />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Period
          </p>
          <p className="text-lg font-bold text-gray-900">{draw.period}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Draw Date
          </p>
          <p className="text-base font-semibold text-gray-900">
            {formatDrawDate(draw.drawDate)}
          </p>
          {isUpcoming && (
            <p className="text-xs text-green-600 mt-1">
              Upcoming draw
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Draw Mode
          </p>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
            {draw.mode === 'random' ? 'Random' : 'Algorithmic'}
          </span>
        </div>

        {draw.totalParticipants > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              Participants
            </p>
            <p className="text-base font-semibold text-gray-900">
              {draw.totalParticipants} eligible subscribers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
