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
import { Skeleton } from '../../components/ui/Skeleton';
import { Toast } from '../../components/ui/Toast';
import {
  Route,
  Clock,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Layers,
  AlertCircle,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  careerRoadmaps,
  getCareerRoadmap,
  CareerRoadmapData,
  RoadmapMilestone
} from '../../data/careerRoadmaps';

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

  // Active career role selection for roadmap.sh exploration
  const initialRoleKey = profile?.targetRoleId || profile?.targetRole?.code || profile?.targetRoleName || 'fullstack-dev';
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>(initialRoleKey);
  const [activeTab, setActiveTab] = useState<'structured' | 'remedial'>('structured');

  // Milestone completion progress tracking with localStorage persistence
  const [milestoneStatusMap, setMilestoneStatusMap] = useState<Record<string, 'not_started' | 'in_progress' | 'completed'>>(() => {
    try {
      const saved = localStorage.getItem('skill_setu_roadmap_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  useEffect(() => {
    if (profile?.targetRoleId || profile?.targetRole?.code || profile?.targetRoleName) {
      const role = profile.targetRoleId || profile.targetRole?.code || profile.targetRoleName;
      if (role) {
        setSelectedRoleKey(role);
      }
    }
  }, [profile]);

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

  const updateCourseStatus = async (courseId: string, nextStatus: 'not_started' | 'in_progress' | 'completed') => {
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

  const updateMilestoneStatus = (milestoneId: string, nextStatus: 'not_started' | 'in_progress' | 'completed') => {
    setMilestoneStatusMap((prev) => {
      const updated = { ...prev, [milestoneId]: nextStatus };
      try {
        localStorage.setItem('skill_setu_roadmap_milestones', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    if (nextStatus === 'completed') {
      confetti({ particleCount: 75, spread: 65 });
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

  const activeRoadmap: CareerRoadmapData = getCareerRoadmap(selectedRoleKey);
  const allMilestones: RoadmapMilestone[] = activeRoadmap.phases.flatMap((p) => p.milestones);
  const completedMilestonesCount = allMilestones.filter((m) => milestoneStatusMap[m.id] === 'completed').length;
  const milestoneProgressPercent = allMilestones.length > 0
    ? Math.round((completedMilestonesCount / allMilestones.length) * 100)
    : 0;

  const remedialCourses: PathItem[] = learningPath?.courses || [];
  const completedRemedialCount = remedialCourses.filter((c) => c.status === 'completed').length;
  const remedialTotalItems = remedialCourses.length;
  const remedialProgressPercent = remedialTotalItems > 0
    ? Math.round((completedRemedialCount / remedialTotalItems) * 100)
    : 0;

  const roleTitle = activeRoadmap.roleTitle;
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

      {/* Header Banner: Career Goal, roadmap.sh Badge, Total Hours, Completion & Recalibrate */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('roadmapPage.rolePrefix')} {roleTitle}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('roadmapPage.totalHours', { hours: activeRoadmap.totalEstimatedHours })}</span>
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            {/* Official roadmap.sh external guide link */}
            <a
              href={activeRoadmap.roadmapShUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>roadmap.sh/{activeRoadmap.roadmapShSlug}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Route className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>{activeRoadmap.roleTitle} Career Roadmap</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {activeRoadmap.overview}
          </p>
        </div>

        {/* Completion Progress Gauge & Recalibrate */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto flex-shrink-0">
          <div className="space-y-1.5 w-full sm:w-48">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>{t('roadmapPage.completion')}</span>
              <span className="font-sans font-bold text-base text-blue-600 dark:text-blue-400">
                {activeTab === 'structured' ? milestoneProgressPercent : remedialProgressPercent}%
              </span>
            </div>
            <ProgressBar
              value={activeTab === 'structured' ? milestoneProgressPercent : remedialProgressPercent}
              max={100}
              size="md"
              variant="primary"
            />
            <div className="text-[11px] text-muted-foreground text-right font-medium">
              {activeTab === 'structured'
                ? t('roadmapPage.milestonesProgress', {
                    completed: completedMilestonesCount,
                    total: allMilestones.length
                  })
                : t('roadmapPage.milestonesDone', {
                    completed: completedRemedialCount,
                    total: remedialTotalItems
                  })}
            </div>
          </div>

          {remedialCourses.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Career Roles Switcher Bar (Explore all 6 roadmap.sh careers) */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{t('roadmapPage.exploreRoles', { defaultValue: 'Explore Career Roadmaps:' })}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(careerRoadmaps).map(([key, data]) => {
            const isCurrent = key === activeRoadmap.roleId;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRoleKey(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-600'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-secondary/40'
                }`}
              >
                {data.roleTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher Tabs (Structured roadmap.sh vs Diagnostic Remedial Courses) */}
      {remedialCourses.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('structured')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'structured'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>{t('roadmapPage.tabStructured', { defaultValue: 'Structured Career Roadmap (roadmap.sh)' })}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('remedial')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'remedial'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('roadmapPage.tabRemedial', { defaultValue: 'Diagnostic Gap Courses' })} ({remedialCourses.length})</span>
          </button>
        </div>
      )}

      {/* Unmapped Skills Notice if any gap skill lacks a catalog course */}
      {unmappedSkills.length > 0 && activeTab === 'remedial' && (
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

      {/* TAB 1: STRUCTURED ROADMAP.SH PHASES & MILESTONES */}
      {activeTab === 'structured' && (
        <div className="space-y-10">
          {activeRoadmap.phases.map((phase) => {
            const phaseCompleted = phase.milestones.filter(
              (m) => milestoneStatusMap[m.id] === 'completed'
            ).length;

            return (
              <div key={phase.phaseNumber} className="space-y-4">
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-secondary/40 border border-border">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {t('roadmapPage.phaseNumber', { num: phase.phaseNumber })}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <h2 className="text-base sm:text-lg font-bold font-sans text-foreground">
                        {phase.title}
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {phase.subtitle}
                    </p>
                  </div>
                  <Badge variant="outline" className="self-start sm:self-auto text-xs">
                    {phaseCompleted} / {phase.milestones.length} Done
                  </Badge>
                </div>

                {/* Milestones connected vertical timeline */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                  {phase.milestones.map((milestone) => {
                    const status = milestoneStatusMap[milestone.id] || 'not_started';
                    const isDone = status === 'completed';
                    const isInProgress = status === 'in_progress';

                    return (
                      <div key={milestone.id} className="relative group">
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
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : milestone.step}
                        </div>

                        {/* Milestone Card */}
                        <Card
                          hoverEffect
                          className="border border-border bg-card shadow-card p-5 space-y-4 rounded-2xl"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                Step {milestone.step}
                              </span>
                              <Badge
                                variant={
                                  isDone
                                    ? 'strong'
                                    : isInProgress
                                    ? 'needsImprovement'
                                    : 'notAssessed'
                                }
                              >
                                {isDone
                                  ? t('roadmapPage.completed')
                                  : isInProgress
                                  ? t('roadmapPage.inProgress')
                                  : t('roadmapPage.notStarted')}
                              </Badge>
                              <Badge variant="outline">
                                {milestone.difficulty}
                              </Badge>
                            </div>

                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>{t('roadmapPage.hoursUnit', { hours: milestone.estimatedHours })}</span>
                            </div>
                          </div>

                          {/* Milestone Title & Description */}
                          <div>
                            <h3 className="text-base sm:text-lg font-sans font-bold text-foreground">
                              {milestone.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>

                          {/* Topics Pill List */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              {t('roadmapPage.topicsLabel', { defaultValue: 'Key Topics & Competencies' })}:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {milestone.topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2.5 py-1 rounded-lg bg-secondary/60 text-foreground border border-border/60 font-medium"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Free Course & Actions */}
                          <div className="pt-3 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                            {milestone.recommendedCourse ? (
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">
                                  <strong className="text-foreground">{milestone.recommendedCourse.title}</strong>{' '}
                                  ({milestone.recommendedCourse.provider})
                                </span>
                              </div>
                            ) : (
                              <span />
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Direct Diagnostic Assessment Link */}
                              {milestone.skillCode && (
                                <Link
                                  to={`/assessments?role=${encodeURIComponent(activeRoadmap.roleId)}&skill=${encodeURIComponent(milestone.skillCode)}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs hover:bg-blue-100 transition-colors"
                                >
                                  <Target className="w-3.5 h-3.5" />
                                  <span>{t('roadmapPage.takeAssessment', { defaultValue: 'Take Diagnostic' })}</span>
                                </Link>
                              )}

                              {/* Direct Course Launch Link */}
                              {milestone.recommendedCourse && (
                                <a
                                  href={milestone.recommendedCourse.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors"
                                >
                                  <span>{t('roadmapPage.launchCourse', { provider: milestone.recommendedCourse.provider })}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Milestone Status Toggle Bar */}
                          <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground font-medium mr-1">
                              {t('roadmapPage.status')}:
                            </span>
                            <button
                              type="button"
                              onClick={() => updateMilestoneStatus(milestone.id, 'not_started')}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                status === 'not_started'
                                  ? 'bg-secondary text-foreground font-bold border-border'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {t('roadmapPage.notStarted')}
                            </button>
                            <button
                              type="button"
                              onClick={() => updateMilestoneStatus(milestone.id, 'in_progress')}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                status === 'in_progress'
                                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border-amber-500/30'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {t('roadmapPage.inProgress')}
                            </button>
                            <button
                              type="button"
                              onClick={() => updateMilestoneStatus(milestone.id, 'completed')}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border-emerald-500/30'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {t('roadmapPage.completed')}
                            </button>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REMEDIAL COURSES (When assessed gap courses exist) */}
      {activeTab === 'remedial' && remedialCourses.length > 0 && (
        <div className="space-y-8">
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
              {remedialCourses.map((item) => {
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
                            onClick={() => updateCourseStatus(item.courseId, 'not_started')}
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
                            onClick={() => updateCourseStatus(item.courseId, 'in_progress')}
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
                            onClick={() => updateCourseStatus(item.courseId, 'completed')}
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
