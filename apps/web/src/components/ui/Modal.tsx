import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export function Modal({ isOpen, onClose, title, children, className, size = 'lg' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div
        className={cn(
          'relative w-full rounded-3xl border border-white/40 dark:border-white/10 bg-card/95 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden max-h-[92vh] flex flex-col',
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
