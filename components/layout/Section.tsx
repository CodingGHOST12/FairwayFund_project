import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type SectionProps = {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'white' | 'gray' | 'green';
};

export function Section({ 
  children, 
  className, 
  padding = 'lg',
  background = 'white'
}: SectionProps) {
  const paddingStyles = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 lg:py-24',
  };

  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    green: 'bg-green-50',
  };

  return (
    <section className={cn(paddingStyles[padding], backgroundStyles[background], className)}>
      {children}
    </section>
  );
}
