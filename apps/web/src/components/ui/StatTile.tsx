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
        'relative p-5 sm:p-6 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/75 dark:bg-slate-900/65 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_36px_rgb(0,0,0,0.45)]',
        onClick && 'cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">
            {label}
          </span>
          <div className="relative inline-block flex-shrink-0">
            <button
              type="button"
              className="text-muted-foreground/70 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 rounded p-0.5"
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
                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-60 sm:w-72 p-2.5 rounded-xl bg-foreground text-background text-xs shadow-xl pointer-events-none transition-opacity"
              >
                <p className="leading-snug">{tooltip}</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
              </div>
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600/15 via-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl sm:text-3xl font-bold font-sans text-foreground tracking-tight">
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
