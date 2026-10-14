import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'chart' | 'statTile';
}

export function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-3/4 rounded-md',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-40 w-full rounded-xl',
    chart: 'h-64 w-full rounded-xl',
    statTile: 'h-28 w-full rounded-xl',
  };

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn(
        'animate-pulse bg-secondary/80 border border-border/30',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
