import { Draw, DrawStatus, DrawMode } from '@/types';

export function getDrawPeriod(month: string, year: number): string {
  return `${month} ${year}`;
}

export function getNextDrawDate(referenceDate: Date = new Date()): Date {
  const nextMonth = new Date(referenceDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  nextMonth.setHours(12, 0, 0, 0);
  return nextMonth;
}

export function formatDrawPeriod(draw: Draw): string {
  return `${draw.month} ${draw.year}`;
}

export function formatDrawDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function isDrawPast(draw: Draw): boolean {
  return new Date() > draw.drawDate;
}

export function isDrawUpcoming(draw: Draw): boolean {
  return new Date() < draw.drawDate;
}

export function getDrawStatusLabel(status: DrawStatus): string {
  const labels: Record<DrawStatus, string> = {
    draft: 'Draft',
    configuring: 'Configuring',
    simulating: 'Simulating',
    ready: 'Ready',
    published: 'Published',
    completed: 'Completed',
  };
  return labels[status] || status;
}

export function getDrawModeLabel(mode: DrawMode): string {
  const labels: Record<DrawMode, string> = {
    random: 'Random',
    algorithmic: 'Algorithmic',
  };
  return labels[mode] || mode;
}

export function canConfigureDraw(draw: Draw): boolean {
  return draw.status === 'draft' || draw.status === 'configuring';
}

export function canSimulateDraw(draw: Draw): boolean {
  return draw.status === 'configuring' || draw.status === 'ready';
}

export function canPublishDraw(draw: Draw): boolean {
  return draw.status === 'ready';
}
