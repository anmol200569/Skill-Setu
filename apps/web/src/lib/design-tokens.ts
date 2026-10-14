/**
 * Skill-Setu Design Tokens
 * Centralized design tokens for colors, spacing, radius, typography, and shadows.
 * All UI components should derive their styling variables from this system.
 */

export const tokens = {
  colors: {
    brand: {
      terracotta: '#2563EB', // Royal blue primary
      terracottaHover: '#1D4ED8',
      terracottaDark: '#3B82F6', // Dark mode accessible royal blue
      terracottaDarkHover: '#60A5FA',
      terracottaSubtle: 'rgba(37, 99, 235, 0.08)',
      terracottaSubtleDark: 'rgba(59, 130, 246, 0.15)',
      blue: '#2563EB',
      blueHover: '#1D4ED8',
    },
    status: {
      strong: {
        bg: 'rgba(22, 163, 74, 0.10)',
        text: '#15803D',
        darkText: '#4ADE80',
        border: 'rgba(22, 163, 74, 0.25)',
      },
      needsImprovement: {
        bg: 'rgba(217, 119, 6, 0.10)',
        text: '#B45309',
        darkText: '#FBBF24',
        border: 'rgba(217, 119, 6, 0.25)',
      },
      notAssessed: {
        bg: 'rgba(100, 116, 139, 0.10)',
        text: '#475569',
        darkText: '#94A3B8',
        border: 'rgba(100, 116, 139, 0.25)',
      },
      critical: {
        bg: 'rgba(220, 38, 38, 0.10)',
        text: '#B91C1C',
        darkText: '#F87171',
        border: 'rgba(220, 38, 38, 0.25)',
      }
    },
    light: {
      background: '#FFFFFF',
      foreground: '#0F172A',
      card: '#FFFFFF',
      cardForeground: '#0F172A',
      secondary: '#F8FAFC',
      secondaryForeground: '#0F172A',
      muted: '#F1F5F9',
      mutedForeground: '#64748B',
      border: '#E2E8F0',
      input: '#E2E8F0',
    },
    dark: {
      background: '#0B0F19',
      foreground: '#F8FAFC',
      card: '#111827',
      cardForeground: '#F8FAFC',
      secondary: '#1E293B',
      secondaryForeground: '#F8FAFC',
      muted: '#1E293B',
      mutedForeground: '#94A3B8',
      border: '#334155',
      input: '#334155',
    }
  },
  spacing: {
    // 8px base spacing grid
    0: '0px',
    1: '4px',   // 0.5 unit
    2: '8px',   // 1 unit
    3: '12px',  // 1.5 units
    4: '16px',  // 2 units
    5: '20px',  // 2.5 units
    6: '24px',  // 3 units
    8: '32px',  // 4 units
    10: '40px', // 5 units
    12: '48px', // 6 units
    16: '64px', // 8 units
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  typography: {
    fontSerif: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    fontSans: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    fontScript: 'Caveat, cursive',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
    cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    glowTerracotta: '0 0 20px -3px rgba(37, 99, 235, 0.25)',
  }
} as const;

export type DesignTokens = typeof tokens;
