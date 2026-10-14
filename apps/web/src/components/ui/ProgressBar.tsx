import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // current value
  max?: number;
  target?: number; // optional target marker value (e.g. required skill level)
  label?: string;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'strong' | 'needsImprovement' | 'neutral';
}

export function ProgressBar({
  value,
  max = 100,
  target,
  label,
  showValues = false,
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const targetPercentage = target !== undefined ? Math.min(100, Math.max(0, (target / max) * 100)) : undefined;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    strong: 'bg-emerald-600 dark:bg-emerald-500',
    needsImprovement: 'bg-amber-600 dark:bg-amber-500',
    neutral: 'bg-slate-400 dark:bg-slate-500',
  };

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {(label || showValues) && (
        <div className="flex items-center justify-between text-xs font-medium text-foreground">
          {label && <span className="truncate">{label}</span>}
          {showValues && (
            <span className="text-muted-foreground ml-2 tabular-nums">
              {value} / {max}
              {target !== undefined && ` (Target: ${target})`}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-secondary border border-border/40',
          heightClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Optional Target Marker */}
        {targetPercentage !== undefined && (
          <div
            title={`Target: ${target}/${max}`}
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10 -ml-[1px]"
            style={{ left: `${targetPercentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
