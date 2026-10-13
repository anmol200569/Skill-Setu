import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] border-[#C2410C]/20 dark:border-[#FB923C]/30',
    critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    outline: 'border-border text-foreground',
    neutral: 'bg-secondary text-secondary-foreground border-border'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
