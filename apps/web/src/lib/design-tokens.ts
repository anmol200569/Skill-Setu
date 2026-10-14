/**
 * Skill-Setu Design Tokens
 * Centralized design tokens for colors, spacing, radius, typography, and shadows.
 * All UI components should derive their styling variables from this system.
 */

export const tokens = {
  colors: {
    brand: {
      terracotta: '#C2410C', // Light mode primary burnt orange
      terracottaHover: '#9A3412',
      terracottaDark: '#FB923C', // Dark mode accessible terracotta (WCAG AA compliant)
      terracottaDarkHover: '#F97316',
      terracottaSubtle: 'rgba(194, 65, 12, 0.08)',
      terracottaSubtleDark: 'rgba(251, 146, 60, 0.12)',
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
      background: '#FAF8F4',
      foreground: '#1A1A18',
      card: '#FFFFFF',
      cardForeground: '#1A1A18',
      secondary: '#F2EFE9',
      secondaryForeground: '#1A1A18',
      muted: '#EFECE5',
      mutedForeground: '#636058',
      border: '#E2DED4',
      input: '#E2DED4',
    },
    dark: {
      background: '#121110',
      foreground: '#F5F3EF',
      card: '#1C1B19',
      cardForeground: '#F5F3EF',
      secondary: '#252422',
      secondaryForeground: '#F5F3EF',
      muted: '#201F1D',
      mutedForeground: '#A39F95',
      border: '#383633',
      input: '#383633',
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
    fontSerif: 'Fraunces, Georgia, serif',
    fontSans: '"DM Sans", system-ui, -apple-system, sans-serif',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
    cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    glowTerracotta: '0 0 20px -3px rgba(194, 65, 12, 0.25)',
  }
} as const;

export type DesignTokens = typeof tokens;
