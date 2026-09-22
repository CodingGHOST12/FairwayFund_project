import { cn } from '@/lib/utils/cn';

type StatusMessageProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
};

export function StatusMessage({ type, message, className }: StatusMessageProps) {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={cn('p-4 rounded-lg border', styles[type], className)}>
      <p className="text-sm">{message}</p>
    </div>
  );
}
