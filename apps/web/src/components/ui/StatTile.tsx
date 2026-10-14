import React, { useState } from 'react';
import { LucideIcon, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from './Card';

export interface StatTileProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  tooltip: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  className?: string;
  onClick?: () => void;
}

export function StatTile({
  label,
  value,
  unit,
  tooltip,
  icon: Icon,
  badge,
  trend,
  className,
  onClick,
}: StatTileProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Card
      className={cn(
        'relative p-4 sm:p-5 flex flex-col justify-between overflow-hidden',
        onClick && 'cursor-pointer hover:border-[#C2410C]/40',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {label}
          </span>
          <div className="relative inline-block flex-shrink-0">
            <button
              type="button"
              className="text-muted-foreground/70 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded p-0.5"
              aria-label={`About ${label}: ${tooltip}`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {showTooltip && (
              <div
                role="tooltip"
                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-60 sm:w-72 p-2.5 rounded-lg bg-foreground text-background text-xs shadow-lg pointer-events-none transition-opacity"
              >
                <p className="leading-snug">{tooltip}</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
              </div>
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#C2410C]/10 dark:bg-[#FB923C]/10 text-[#C2410C] dark:text-[#FB923C] flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>

      {(badge || trend) && (
        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium',
                trend.positive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}
            >
              <span>{trend.positive ? '↑' : '↓'} {trend.value}</span>
              {trend.label && <span className="text-muted-foreground font-normal">{trend.label}</span>}
            </span>
          )}
          {badge && <div className="ml-auto">{badge}</div>}
        </div>
      )}
    </Card>
  );
}
