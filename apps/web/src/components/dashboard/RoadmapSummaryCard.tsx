import React from 'react';
import { Link } from 'react-router-dom';
import { Route, Clock, Calendar, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { RecommendedCourseItem } from '../../pages/learner/DashboardPage';

export interface RoadmapSummaryCardProps {
  recommendations: RecommendedCourseItem[];
  weeklyHours?: number;
  completedCount?: number;
  totalCount?: number;
}

export function RoadmapSummaryCard({
  recommendations = [],
  weeklyHours = 10,
  completedCount = 0,
  totalCount = 4,
}: RoadmapSummaryCardProps) {
  const { t } = useTranslation();

  const effectiveTotal = Math.max(totalCount, recommendations.length, 1);
  const progressPercent = Math.min(100, Math.round((completedCount / effectiveTotal) * 100));

  // Compute target date based on remaining estimated hours
  const totalRemainingHours = recommendations.reduce(
    (acc, r) => acc + (r.course?.estimatedHours || 15),
    0
  );
  const weeksNeeded = Math.ceil(totalRemainingHours / Math.max(weeklyHours, 1));
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);
  const formattedDate = targetDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const nextStep = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <Card className="border border-border bg-card shadow-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-[#C2410C] dark:text-[#FB923C]" />
            <CardTitle>{t('dashboard.roadmapSummary.title')}</CardTitle>
          </div>
          <CardDescription className="mt-1">
            {t('dashboard.roadmapSummary.description')}
          </CardDescription>
        </div>

        <Link to="/roadmap">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-[#C2410C] hover:bg-[#C2410C]/10 flex items-center gap-1"
          >
            <span>{t('dashboard.roadmapSummary.viewFullRoadmap')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Progress & Target Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{t('dashboard.roadmapSummary.weeklyTime')}</span>
            </div>
            <div className="text-base sm:text-lg font-serif font-bold text-foreground">
              {t('dashboard.roadmapSummary.hoursPerWeek', { hours: weeklyHours })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{t('dashboard.roadmapSummary.targetDate')}</span>
            </div>
            <div className="text-base sm:text-lg font-serif font-bold text-foreground">
              {formattedDate}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>{t('dashboard.roadmapSummary.progress')}</span>
              <span className="font-semibold text-foreground">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} max={100} size="sm" variant="primary" />
          </div>
        </div>

        {/* Immediate Next Step Card */}
        {nextStep ? (
          <div className="p-4 rounded-xl border border-[#C2410C]/25 bg-[#C2410C]/5 dark:bg-[#FB923C]/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-wider text-[11px]">
                {t('dashboard.roadmapSummary.nextStep')}
              </span>
              <span className="text-muted-foreground">
                ~{nextStep.course.estimatedHours} hrs • {nextStep.course.provider}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-serif font-bold text-foreground">
              {nextStep.course.title}
            </h4>

            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Why this is shown:</strong>{' '}
              {nextStep.recommendationReason ||
                `Directly addresses identified gap in ${nextStep.gapAddressed || 'core competency'}.`}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Addresses: {nextStep.gapAddressed || nextStep.matchingSkill || 'Core Gap'}
              </span>
              <Link to="/roadmap">
                <Button size="sm" className="h-7 text-xs bg-[#C2410C] hover:bg-[#9A3412] text-white">
                  Continue Module
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">
            Complete a diagnostic assessment to generate your personalized step-by-step roadmap.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
