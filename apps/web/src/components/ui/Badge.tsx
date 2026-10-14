import React from 'react';
import { LucideIcon, CheckCircle2, AlertTriangle, HelpCircle, AlertOctagon } from 'lucide-react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'default'
  | 'strong'
  | 'needsImprovement'
  | 'notAssessed'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'success'
  | 'outline'
  | 'neutral'
  | 'terracotta'
  | 'blue'
  | 'purple'
  | 'emerald'
  | 'pink'
  | 'amber';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  icon?: LucideIcon | boolean;
}

export function Badge({ className, variant = 'default', icon, children, ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold',
    terracotta: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold',
    pink: 'bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800/60 font-semibold',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 font-semibold',
    strong: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    needsImprovement: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    notAssessed: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/25',
    critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25',
    medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/25',
    outline: 'border-border text-foreground bg-transparent',
    neutral: 'bg-secondary text-secondary-foreground border-border'
  };

  // Determine default icon if icon === true
  let DefaultIcon: LucideIcon | null = null;
  if (icon === true) {
    if (variant === 'strong' || variant === 'success') DefaultIcon = CheckCircle2;
    else if (variant === 'needsImprovement' || variant === 'high' || variant === 'medium') DefaultIcon = AlertTriangle;
    else if (variant === 'critical') DefaultIcon = AlertOctagon;
    else if (variant === 'notAssessed') DefaultIcon = HelpCircle;
  } else if (typeof icon === 'function') {
    DefaultIcon = icon;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {DefaultIcon && <DefaultIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </div>
  );
}
