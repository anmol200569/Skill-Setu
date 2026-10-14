import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <div
        className={cn('h-full w-full flex-1 bg-blue-600 dark:bg-blue-500 transition-all duration-300', indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
