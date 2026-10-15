import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Toast } from '../../components/ui/Toast';
import {
  Route,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Layers,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PathItem {
  step: number;
  courseId: string;
  course: {
    id: string;
    title: string;
    provider: string;
    destinationUrl: string;
    estimatedHours: number;
    difficulty: string;
    language: string;
    skillsCovered?: string[];
  };
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercent: number;
  reason: string;
  source?: string;
  isOutsideRoleGaps?: boolean;
}

export function LearningPathPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [learningPath, setLearningPath] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadLearningPath();

    const handleDiagnosticDone = () => {
      loadLearningPath();
    };
    window.addEventListener('skill_setu_diagnostic_completed', handleDiagnosticDone);
    return () => {
      window.removeEventListener('skill_setu_diagnostic_completed', handleDiagnosticDone);
    };
  }, []);

  const loadLearningPath = async () => {
    setIsLoading(true);
    try {
      const path = await apiClient('/learning-paths');
      setLearningPath(path);
    } catch (err: any) {
      console.warn('Could not load learning path:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const targetRoleId = learningPath?.targetRoleId || profile?.targetRoleId;
      const refreshed = await apiClient<any>('/learning-paths/regenerate', {
        method: 'POST',
        body: JSON.stringify({ targetRoleId })
      });
      setLearningPath(refreshed);
      setToast({
        message: t('roadmapPage.recalibrateSuccess'),
        type: 'success'
      });
    } catch (err: any) {
      console.warn('Could not regenerate learning path:', err);
      setToast({
        message: t('roadmapPage.recalibrateError'),
        type: 'error'
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const updateStatus = async (courseId: string, nextStatus: 'not_started' | 'in_progress' | 'completed') => {
    try {
      await apiClient('/learning-paths/progress', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
          status: nextStatus,
          progressPercent: nextStatus === 'completed' ? 100 : nextStatus === 'in_progress' ? 50 : 0
        })
      });

      if (nextStatus === 'completed') {
        confetti({ particleCount: 75, spread: 65 });
      }

      await loadLearningPath();
    } catch (err: any) {
      console.warn('Could not update status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-pulse">
        <Skeleton variant="title" className="w-48 h-8" />
        <Skeleton variant="card" className="h-32" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  const courses: PathItem[] = learningPath?.courses || [];
  const completedCoursesCount = courses.filter((c) => c.status === 'completed').length;
  const totalItems = courses.length;
  const completedTotal = completedCoursesCount;
  const overallPercent = totalItems > 0 ? Math.round((completedTotal / totalItems) * 100) : 0;
  const totalHours = learningPath?.totalEstimatedHours || 0;
  const roleTitle =
    learningPath?.targetRoleTitle ||
    profile?.targetRoleName ||
    profile?.targetRole?.title ||
    'Target Career';
  const unmappedSkills = learningPath?.unmappedSkills || [];

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-[1720px] mx-auto pb-20">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumb Hierarchy */}
      <Breadcrumbs items={[{ label: t('nav.roadmap') }]} />

      {/* Header Banner: Career Goal, Total Hours, Completion & Recalibrate */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('roadmapPage.rolePrefix')} {roleTitle}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground font-medium">
              {t('roadmapPage.totalHours', { hours: totalHours })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Route className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{t('roadmapPage.title')}</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            {t('roadmapPage.subtitle')}
          </p>
        </div>

        {/* Completion Progress Gauge & Recalibrate */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="space-y-1 w-full sm:w-44">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>{t('roadmapPage.completion')}</span>
              <span className="font-sans font-bold text-base text-blue-600 dark:text-blue-400">
                {overallPercent}%
              </span>
            </div>
            <ProgressBar value={overallPercent} max={100} size="md" variant="primary" />
            <div className="text-[11px] text-muted-foreground text-right">
              {t('roadmapPage.milestonesDone', { completed: completedTotal, total: totalItems })}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={isRegenerating}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 text-xs font-semibold self-stretch sm:self-auto h-9 rounded-xl hover:border-blue-400 hover:text-blue-600"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t('roadmapPage.recalibrate')}</span>
          </Button>
        </div>
      </div>

      {/* Unmapped Skills Notice if any gap skill lacks a catalog course */}
      {unmappedSkills.length > 0 && (
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{t('roadmapPage.unmappedNotice')}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {unmappedSkills.map((sk: any) => (
              <Badge key={sk.skillId} variant="outline" className="border-amber-500/30 text-amber-800 dark:text-amber-300">
                {sk.skillName} (Gap: {sk.gap})
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t('roadmapPage.unmappedSuggestion')}</p>
        </div>
      )}

      {courses.length === 0 ? (
        <EmptyState
          icon={Route}
          title={t('roadmapPage.emptyTitle')}
          description={t('roadmapPage.emptySubtitle')}
          primaryAction={{
            label: t('roadmapPage.startDiagnostic'),
            onClick: () => navigate('/assessments?returnTo=/learning-path'),
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Sequential Mapped Courses */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-sans text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t('roadmapPage.coursesHeading')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t('roadmapPage.coursesDesc')}
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
              {courses.map((item) => {
                const isDone = item.status === 'completed';
                const isInProgress = item.status === 'in_progress';

                return (
                  <div key={item.courseId} className="relative group">
                    {/* Node Circle */}
                    <div
                      className={`absolute -left-[30px] sm:-left-[38px] top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                          : 'bg-card border-border text-muted-foreground'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                    </div>

                    {/* Course Item Card */}
                    <Card
                      hoverEffect
                      className="border border-border bg-card shadow-card p-5 space-y-3 rounded-2xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {t('roadmapPage.stepNumber', { step: item.step })}
                          </span>
                          <Badge variant="outline">{item.course.provider}</Badge>
                          <Badge variant={isDone ? 'strong' : isInProgress ? 'needsImprovement' : 'notAssessed'}>
                            {isDone
                              ? t('roadmapPage.completed')
                              : isInProgress
                              ? t('roadmapPage.inProgress')
                              : t('roadmapPage.notStarted')}
                          </Badge>
                          {item.source === 'manual' && (
                            <Badge variant="default" className="bg-blue-600 text-white">
                              {t('roadmapPage.addedByUser')}
                            </Badge>
                          )}
                          {item.isOutsideRoleGaps && (
                            <Badge variant="needsImprovement">
                              {t('roadmapPage.outsideRoleGaps')}
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{t('roadmapPage.hoursUnit', { hours: item.course.estimatedHours })}</span>
                          <span>•</span>
                          <span>{item.course.difficulty}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-sans font-bold text-foreground">
                          {item.course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          <strong className="text-foreground">{t('common.whyShown')}:</strong>{' '}
                          {item.reason || `Directly bridges identified competency deficit.`}
                        </p>
                      </div>

                      {/* Interactive Status Logging & Direct Launch Action */}
                      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-muted-foreground font-medium mr-1">
                            {t('roadmapPage.status')}:
                          </span>
                          <button
                            type="button"
                            onClick={() => updateStatus(item.courseId, 'not_started')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                              item.status === 'not_started'
                                ? 'bg-secondary text-foreground font-bold border-border'
                                : 'text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {t('roadmapPage.notStarted')}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(item.courseId, 'in_progress')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                              item.status === 'in_progress'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border-amber-500/30'
                                : 'text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {t('roadmapPage.inProgress')}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(item.courseId, 'completed')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                              item.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border-emerald-500/30'
                                : 'text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {t('roadmapPage.completed')}
                          </button>
                        </div>

                        <a
                          href={item.course.destinationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
                        >
                          <span>{t('roadmapPage.launchCourse', { provider: item.course.provider })}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default LearningPathPage;
