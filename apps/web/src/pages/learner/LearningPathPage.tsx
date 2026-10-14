import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatTile } from '../../components/ui/StatTile';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Route,
  Clock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  Code2,
  FolderGit2
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

interface MilestoneProject {
  id: string;
  titleKey: string;
  descKey: string;
  skills: string[];
  estimatedHours: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export function LearningPathPage() {
  const { t } = useTranslation();
  const [learningPath, setLearningPath] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Projects state (persisted locally so learner can track project progress)
  const [projectStatus, setProjectStatus] = useState<Record<string, 'not_started' | 'in_progress' | 'completed'>>(() => {
    try {
      const saved = localStorage.getItem('skill_setu_project_status');
      return saved ? JSON.parse(saved) : { 'proj-1': 'not_started', 'proj-2': 'not_started' };
    } catch (_) {
      return { 'proj-1': 'not_started', 'proj-2': 'not_started' };
    }
  });

  const milestoneProjects: MilestoneProject[] = [
    {
      id: 'proj-1',
      titleKey: 'roadmapPage.project1Title',
      descKey: 'roadmapPage.project1Desc',
      skills: ['Microservices', 'Docker', 'API Security', 'System Design'],
      estimatedHours: 24,
      status: projectStatus['proj-1'] || 'not_started',
    },
    {
      id: 'proj-2',
      titleKey: 'roadmapPage.project2Title',
      descKey: 'roadmapPage.project2Desc',
      skills: ['React Architecture', 'State Management', 'WebSockets', 'A11y'],
      estimatedHours: 32,
      status: projectStatus['proj-2'] || 'not_started',
    },
  ];

  const updateProjectStatus = (projId: string, nextStatus: 'not_started' | 'in_progress' | 'completed') => {
    setProjectStatus((prev) => {
      const updated = { ...prev, [projId]: nextStatus };
      try {
        localStorage.setItem('skill_setu_project_status', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    if (nextStatus === 'completed') {
      confetti({ particleCount: 60, spread: 55 });
    }
  };

  useEffect(() => {
    loadLearningPath();
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
      const refreshed = await apiClient('/learning-paths/regenerate', { method: 'POST' });
      setLearningPath(refreshed);
    } catch (err: any) {
      console.warn('Could not regenerate learning path:', err);
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
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
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
  const completedProjectsCount = milestoneProjects.filter((p) => p.status === 'completed').length;
  const totalItems = courses.length + milestoneProjects.length;
  const completedTotal = completedCoursesCount + completedProjectsCount;
  const overallPercent = totalItems > 0 ? Math.round((completedTotal / totalItems) * 100) : 0;
  const totalHours = (learningPath?.totalEstimatedHours || 0) + 56;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-20">
      {/* Breadcrumb Hierarchy */}
      <Breadcrumbs items={[{ label: t('nav.roadmap') }]} />

      {/* Header Banner: Career Goal, Total Hours, Completion & Recalibrate */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C]">
              {t('roadmapPage.rolePrefix')} {learningPath?.targetRoleTitle || 'Target Career'}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground font-medium">
              {t('roadmapPage.totalHours', { hours: totalHours })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Route className="w-6 h-6 text-[#C2410C] dark:text-[#FB923C]" />
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
              <span className="font-serif font-bold text-base text-[#C2410C] dark:text-[#FB923C]">
                {overallPercent}%
              </span>
            </div>
            <ProgressBar value={overallPercent} max={100} size="md" variant="primary" />
            <div className="text-[11px] text-muted-foreground text-right">
              {completedTotal} of {totalItems} milestones done
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={isRegenerating}
            className="flex items-center gap-1.5 text-xs font-semibold self-stretch sm:self-auto h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#FB923C]" />
            <span>{t('roadmapPage.recalibrate')}</span>
          </Button>
        </div>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={Route}
          title={t('roadmapPage.emptyTitle')}
          description={t('roadmapPage.emptySubtitle')}
          primaryAction={{
            label: t('roadmapPage.startDiagnostic'),
            onClick: () => window.location.assign('/assessments'),
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Phase 1: Sequential Mapped Courses */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C2410C] dark:text-[#FB923C]" />
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
                          ? 'bg-[#C2410C] border-[#C2410C] text-white animate-pulse'
                          : 'bg-card border-border text-muted-foreground'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                    </div>

                    {/* Course Item Card */}
                    <Card
                      hoverEffect
                      className="border border-border bg-card shadow-card p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C]">
                            Step {item.step}
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
                            <Badge variant="terracotta">
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
                          <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                          <span>{item.course.estimatedHours} hours</span>
                          <span>•</span>
                          <span>{item.course.difficulty}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-serif font-bold text-foreground">
                          {item.course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          <strong className="text-foreground">Why this is shown:</strong>{' '}
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
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline self-start sm:self-auto"
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

          {/* Phase 2: Applied Milestone Projects (Demonstrate Improvement) */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-foreground flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#C2410C] dark:text-[#FB923C]" />
                <span>{t('roadmapPage.projectsHeading')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t('roadmapPage.projectsDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestoneProjects.map((proj, idx) => {
                const isDone = proj.status === 'completed';
                const isInProgress = proj.status === 'in_progress';

                return (
                  <Card
                    key={proj.id}
                    hoverEffect
                    className="p-5 border border-border bg-card shadow-card flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C]">
                          Capstone Project #{idx + 1}
                        </span>
                        <Badge variant={isDone ? 'strong' : isInProgress ? 'needsImprovement' : 'notAssessed'}>
                          {isDone ? t('roadmapPage.completed') : isInProgress ? t('roadmapPage.inProgress') : t('roadmapPage.notStarted')}
                        </Badge>
                      </div>

                      <h3 className="font-serif font-bold text-base text-foreground">
                        {t(proj.titleKey)}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(proj.descKey)}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.skills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-foreground/80 border border-border"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                        ~{proj.estimatedHours} hrs practical work
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateProjectStatus(proj.id, 'not_started')}
                          className={`px-2 py-0.5 rounded text-[11px] border ${
                            proj.status === 'not_started' ? 'bg-secondary font-bold' : 'hover:bg-muted'
                          }`}
                        >
                          Not Started
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProjectStatus(proj.id, 'in_progress')}
                          className={`px-2 py-0.5 rounded text-[11px] border ${
                            proj.status === 'in_progress' ? 'bg-amber-500/10 text-amber-600 font-bold border-amber-500/20' : 'hover:bg-muted'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProjectStatus(proj.id, 'completed')}
                          className={`px-2 py-0.5 rounded text-[11px] border ${
                            proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 font-bold border-emerald-500/20' : 'hover:bg-muted'
                          }`}
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                  </Card>
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
