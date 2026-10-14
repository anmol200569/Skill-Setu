import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Target, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

export interface ReadinessGaugeProps {
  score: number | null; // 0-100 or null if incomplete
  assessedCount: number;
  totalCount: number;
  coveragePercentage: number; // 0-100
  isIncomplete: boolean;
  targetRoleTitle?: string;
}

export function ReadinessGauge({
  score,
  assessedCount,
  totalCount,
  coveragePercentage,
  isIncomplete,
  targetRoleTitle,
}: ReadinessGaugeProps) {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCoverageTooltip, setShowCoverageTooltip] = useState(false);

  // SVG Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const safeScore = score !== null ? Math.min(100, Math.max(0, score)) : 0;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <Card className="overflow-hidden border border-border shadow-card bg-gradient-to-br from-card via-card to-secondary/30">
      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Readiness Ring or Incomplete State */}
          <div className="md:col-span-6 flex flex-col items-center justify-center text-center p-2">
            <div className="flex items-center gap-1.5 mb-3">
              <h3 className="text-base sm:text-lg font-serif font-bold text-foreground">
                {t('dashboard.readiness.title')}
              </h3>
              <div className="relative inline-block">
                <button
                  type="button"
                  aria-label={t('dashboard.readiness.tooltip')}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  className="text-muted-foreground/70 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded p-0.5"
                >
                  <Info className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                {showTooltip && (
                  <div
                    role="tooltip"
                    className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-64 p-2.5 rounded-lg bg-foreground text-background text-xs shadow-lg pointer-events-none"
                  >
                    <p className="leading-snug">{t('dashboard.readiness.tooltip')}</p>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
                  </div>
                )}
              </div>
            </div>

            {isIncomplete || score === null ? (
              /* Incomplete Assessment State */
              <div className="flex flex-col items-center justify-center py-4 px-3 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <AlertCircle className="w-8 h-8" aria-hidden="true" />
                </div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  {t('dashboard.readiness.incompleteTitle')}
                </h4>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {t('dashboard.readiness.incompleteDesc')}
                </p>
                <Link to="/assessments">
                  <Button
                    size="sm"
                    className="bg-[#C2410C] hover:bg-[#9A3412] text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Target className="w-4 h-4" />
                    <span>{t('dashboard.readiness.continueAssessing')}</span>
                  </Button>
                </Link>
              </div>
            ) : (
              /* Large Circular Gauge */
              <div className="flex flex-col items-center">
                <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                  <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                    aria-hidden="true"
                  >
                    {/* Background circle track */}
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      className="text-secondary"
                    />
                    {/* Animated foreground score circle */}
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke="#C2410C"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out dark:stroke-[#FB923C]"
                    />
                  </svg>

                  {/* Centered Score */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                    <span className="text-4xl sm:text-5xl font-bold font-serif text-foreground tracking-tight tabular-nums">
                      {Math.round(safeScore)}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                      / 100
                    </span>
                  </div>
                </div>

                {/* Mandatory Disclaimer Label */}
                <p className="text-xs font-medium text-muted-foreground mt-3 text-center max-w-xs">
                  {t('dashboard.readiness.disclaimer')}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Assessment Coverage & Context */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-5 md:border-l md:border-border md:pl-8">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t('dashboard.readiness.coverageTitle')}
                  </span>
                  <div className="relative inline-block">
                    <button
                      type="button"
                      aria-label={t('dashboard.readiness.coverageTooltip')}
                      onMouseEnter={() => setShowCoverageTooltip(true)}
                      onMouseLeave={() => setShowCoverageTooltip(false)}
                      onFocus={() => setShowCoverageTooltip(true)}
                      onBlur={() => setShowCoverageTooltip(false)}
                      className="text-muted-foreground/70 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C] rounded p-0.5"
                    >
                      <Info className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    {showCoverageTooltip && (
                      <div
                        role="tooltip"
                        className="absolute z-50 right-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-1.5 w-60 p-2 rounded-lg bg-foreground text-background text-xs shadow-lg pointer-events-none"
                      >
                        <p className="leading-snug">{t('dashboard.readiness.coverageTooltip')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-sm font-bold font-serif text-foreground tabular-nums">
                  {Math.round(coveragePercentage)}%
                </span>
              </div>

              <ProgressBar
                value={coveragePercentage}
                max={100}
                size="md"
                variant={coveragePercentage >= 60 ? 'strong' : 'needsImprovement'}
              />

              <p className="text-xs text-muted-foreground pt-1 flex items-center justify-between">
                <span>
                  {t('dashboard.readiness.coverageSub', {
                    assessed: assessedCount,
                    total: totalCount,
                  })}
                </span>
                {coveragePercentage >= 60 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sufficient
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                    Under 60% threshold
                  </span>
                )}
              </p>
            </div>

            {/* Target Role Context Banner */}
            <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-2">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('dashboard.targetRoleLabel')}
              </div>
              <div className="text-sm sm:text-base font-serif font-bold text-foreground">
                {targetRoleTitle || 'Target Career Role'}
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link to="/assessments">
                  <Button variant="outline" size="sm" className="text-xs font-semibold h-8">
                    <Target className="w-3.5 h-3.5 mr-1 text-[#C2410C]" />
                    <span>Take Diagnostic</span>
                  </Button>
                </Link>
                <Link to="/skill-gaps">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold h-8 text-[#C2410C] hover:bg-[#C2410C]/10">
                    <span>{t('dashboard.readiness.viewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
