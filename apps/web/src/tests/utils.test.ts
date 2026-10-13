import { describe, it, expect } from 'vitest';
import { cn, formatDuration, formatProficiency } from '../lib/utils';

import { stripInactivePrefix } from '@skill-setu/shared';

describe('Frontend Utility Helpers', () => {
  it('correctly merges conditional Tailwind CSS class names', () => {
    const result = cn('base-class', true && 'active-class', false && 'hidden-class');
    expect(result).toBe('base-class active-class');
  });

  it('formats duration in hours and minutes', () => {
    expect(formatDuration(0.5)).toBe('30 mins');
    expect(formatDuration(1)).toBe('1 hour');
    expect(formatDuration(15)).toBe('15 hours');
  });

  it('formats proficiency levels to descriptive scale', () => {
    expect(formatProficiency(1)).toBe('Novice (1/5)');
    expect(formatProficiency(2)).toBe('Developing (2/5)');
    expect(formatProficiency(3)).toBe('Competent (3/5)');
    expect(formatProficiency(4)).toBe('Proficient (4/5)');
    expect(formatProficiency(5)).toBe('Expert (5/5)');
  });

  it('strips [INACTIVE] prefix from questionText before showing it to users', () => {
    expect(stripInactivePrefix('[INACTIVE] What is a primary key in SQL?')).toBe(
      'What is a primary key in SQL?'
    );
    expect(stripInactivePrefix('[inactive] How does garbage collection work?')).toBe(
      'How does garbage collection work?'
    );
    expect(stripInactivePrefix('What is a normal question without prefix?')).toBe(
      'What is a normal question without prefix?'
    );
    expect(stripInactivePrefix('')).toBe('');
    expect(stripInactivePrefix(null)).toBe('');
    expect(stripInactivePrefix(undefined)).toBe('');
  });
});
