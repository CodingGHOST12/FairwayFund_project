import { CharityEvent } from '@/types';
import { formatScoreDate } from '@/lib/utils/score';

type CharityEventsProps = {
  events: CharityEvent[];
};

export function CharityEvents({ events }: CharityEventsProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center">
        <p className="text-gray-500 text-sm">No upcoming events listed at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((evt) => (
        <div key={evt.id} className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-green-300 transition-colors">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-gray-900 text-base">{evt.title}</h4>
            <span className="px-2.5 py-1 bg-green-50 text-green-800 text-xs font-semibold rounded-full whitespace-nowrap">
              {formatScoreDate(evt.date)}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{evt.description}</p>
          {evt.location && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {evt.location}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
