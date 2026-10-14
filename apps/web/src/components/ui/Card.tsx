import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export function Card({ className, hoverEffect = false, glass = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border text-card-foreground transition-all duration-200 relative overflow-hidden',
        glass
          ? 'border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_14px_40px_rgb(0,0,0,0.45)]'
          : 'border-border bg-card shadow-card',
        hoverEffect &&
          'hover:shadow-[0_16px_40px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_16px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 hover:border-blue-500/40 dark:hover:border-blue-400/40',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-5 sm:p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg sm:text-xl font-bold leading-tight tracking-tight text-foreground font-sans', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs sm:text-sm text-muted-foreground leading-relaxed', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-5 sm:p-6 pt-0 border-t border-border mt-4', className)} {...props} />;
}
