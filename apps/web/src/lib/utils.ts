import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} mins`;
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
}

export function formatProficiency(level: number): string {
  const rounded = Math.round(level);
  switch (rounded) {
    case 1: return 'Novice (1/5)';
    case 2: return 'Developing (2/5)';
    case 3: return 'Competent (3/5)';
    case 4: return 'Proficient (4/5)';
    case 5: return 'Expert (5/5)';
    default: return `${level}/5`;
  }
}
