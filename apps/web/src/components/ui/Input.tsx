import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, id, rightElement, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-foreground/80">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={id}
            type={type}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error && id ? `${id}-error` : undefined}
            className={cn(
              'flex h-11 w-full rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
              rightElement && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={id ? `${id}-error` : undefined} role="alert" className="text-xs text-red-600 dark:text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
