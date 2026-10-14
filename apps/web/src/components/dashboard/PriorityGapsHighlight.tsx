import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { GapItem } from '../../pages/learner/DashboardPage';

export interface PriorityGapsHighlightProps {
  gaps: GapItem[];
  onCloseGap?: (gap: GapItem) => void;
}

export function PriorityGapsHighlight({ gaps, onCloseGap }: PriorityGapsHighlightProps) {
  const { t } = useTranslation();

  // Filter only active assessed gaps with a deficit > 0, take top 3
  const top3 = gaps
    .filter((g) => g.isAssessed !== false && (g.currentLevel ?? 0) < g.requiredLevel && g.gap > 0)
    .slice(0, 3);

  if (top3.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-foreground">
            {t('dashboard.topGaps.title')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('dashboard.topGaps.description')}
          </p>
        </div>
        <Link
          to="/skill-gaps"
          className="text-xs font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>{t('common.viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((gap, index) => {
          const current = gap.currentLevel ?? 0;
          const required = gap.requiredLevel;
          const deficit = Math.max(0, required - current);
          const weight = gap.weight ?? 1.0;

          return (
            <Card
              key={gap.skillId || index}
              hoverEffect
              className="flex flex-col justify-between p-5 border-[#C2410C]/20 dark:border-[#FB923C]/20 bg-card"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="needsImprovement" icon={AlertTriangle}>
                    {t('dashboard.topGaps.priorityRank', { rank: index + 1 })}
                  </Badge>
                  <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                    {t('dashboard.topGaps.weightLabel', { weight: weight.toFixed(1) })}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-foreground line-clamp-1">
                    {gap.skillName}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {gap.domainName || t('dashboard.topGaps.coreRequirement')}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">{t('dashboard.topGaps.achievedVsTarget')}</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {current.toFixed(1)} / {required.toFixed(1)}
                    </span>
                  </div>
                  <ProgressBar
                    value={current}
                    max={5}
                    target={required}
                    size="sm"
                    variant="needsImprovement"
                  />
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium text-right tabular-nums">
                    {t('dashboard.topGaps.deficitLabel', { deficit: deficit.toFixed(1) })}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-border">
                <Link
                  to={`/courses?skill=${encodeURIComponent(gap.skillId || gap.skillName)}`}
                  className="w-full"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs font-semibold bg-[#C2410C] hover:bg-[#9A3412] text-white flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('dashboard.topGaps.action')}</span>
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
