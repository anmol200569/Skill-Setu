import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

// Lazy-load the heavy 3D scene (dynamic import performance guard)
const LazySkillConstellationScene = lazy(() => import('./SkillConstellationScene'));

interface SkillConstellationHeroProps {
  forceFallback?: boolean;
  className?: string;
}

export function SkillConstellationHero({ forceFallback = false, className = '' }: SkillConstellationHeroProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [canRender3D, setCanRender3D] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check URL override for capturing fallback vs 3D screenshots
  const forceParam = searchParams.get('fallback') === 'true' || searchParams.get('mode') === 'fallback';
  const shouldForceFallback = forceFallback || forceParam;

  useEffect(() => {
    if (shouldForceFallback) {
      setCanRender3D(false);
      return;
    }

    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCanRender3D(false);
      return;
    }

    // 2. Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (_) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setCanRender3D(false);
      return;
    }

    // 3. Performance guard: on mobile screens (<768px), show static fallback as specified
    const isMobileDevice = window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
    if (isMobileDevice) {
      setCanRender3D(false);
      return;
    }

    // Capable device and preferences allowed: enable 3D scene
    setCanRender3D(true);
  }, [shouldForceFallback]);

  // IntersectionObserver: render only when visible on screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[320px] sm:h-[380px] md:h-[440px] flex items-center justify-center overflow-hidden rounded-3xl ${className}`}
    >
      {/* Background Ambient Glow & Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 via-blue-500/5 to-transparent rounded-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 blur-3xl -top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Conditional 3D Scene or Editorial Static Fallback */}
      {canRender3D && isVisible ? (
        <Suspense fallback={<StaticConstellationFallback />}>
          <div className="relative w-full h-full">
            <LazySkillConstellationScene />

            {/* Subtle caption explaining the 3D bridge representation */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur border border-border text-[11px] text-muted-foreground select-none pointer-events-none flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>{t('landing.constellation.interactive')}</span>
            </div>
          </div>
        </Suspense>
      ) : (
        <StaticConstellationFallback />
      )}
    </div>
  );
}

// Modern Static Fallback (for prefers-reduced-motion, low-end devices, mobile, or WebGL-disabled)
function StaticConstellationFallback() {
  const { t } = useTranslation();

  return (
    <div
      data-testid="static-3d-fallback"
      className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Decorative SVG Constellation Bridge */}
      <svg
        viewBox="0 0 500 300"
        className="w-full max-w-md h-auto text-blue-600 dark:text-blue-400 opacity-90 drop-shadow-md"
        aria-hidden="true"
      >
        {/* Background connector web */}
        <path
          d="M 50 150 Q 150 70 250 150 T 450 150"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-30"
        />
        <path
          d="M 100 220 L 250 150 L 400 220"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-40"
        />
        <path
          d="M 120 80 L 250 150 L 380 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-40"
        />

        {/* Central Career Goal Hub */}
        <circle cx="250" cy="150" r="18" fill="currentColor" className="opacity-95" />
        <circle cx="250" cy="150" r="26" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40" />

        {/* Orbiting Skill Nodes */}
        <circle cx="100" cy="220" r="10" fill="#3B82F6" />
        <circle cx="400" cy="220" r="10" fill="#3B82F6" />
        <circle cx="120" cy="80" r="12" fill="#2563EB" />
        <circle cx="380" cy="80" r="12" fill="#2563EB" />
        <circle cx="50" cy="150" r="8" fill="#93C5FD" />
        <circle cx="450" cy="150" r="8" fill="#93C5FD" />
      </svg>

      <div className="mt-2 space-y-1 z-10 max-w-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {t('landing.constellation.tag')}
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('landing.constellation.description')}
        </p>
      </div>
    </div>
  );
}
