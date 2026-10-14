import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  sampleBadge?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  primaryAction,
  secondaryAction,
  sampleBadge = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-6',
        className
      )}
    >
      {sampleBadge && (
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
          Sample
        </span>
      )}

      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h4 className="text-base sm:text-lg font-sans font-bold text-foreground">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={primaryAction.onClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            >
              {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
              <span>{primaryAction.label}</span>
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
