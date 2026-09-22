import { DrawStatus as DrawStatusType } from '@/types';
import { getDrawStatusLabel } from '@/lib/draw/draw-utils';

type DrawStatusProps = {
  status: DrawStatusType;
  showLabel?: boolean;
};

export function DrawStatus({ status, showLabel = true }: DrawStatusProps) {
  const getStatusColor = (s: DrawStatusType) => {
    switch (s) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'configuring':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'simulating':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'published':
        return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'completed':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const label = getDrawStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(status)}`}
      role="status"
      aria-label={`Draw status: ${label}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${status === 'ready' || status === 'published' ? 'bg-current animate-pulse' : 'bg-current'}`}
        aria-hidden="true"
      />
      {showLabel && label}
    </span>
  );
}
