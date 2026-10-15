import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { StatTile } from '../../components/ui/StatTile';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ReadinessGauge } from '../../components/dashboard/ReadinessGauge';
import { SkillRadarChart } from '../../components/dashboard/SkillRadarChart';
import { PriorityGapsHighlight } from '../../components/dashboard/PriorityGapsHighlight';
import { ReadinessTrendChart } from '../../components/dashboard/ReadinessTrendChart';
import { RoadmapSummaryCard } from '../../components/dashboard/RoadmapSummaryCard';
import { SkillGapPanel } from '../../components/dashboard/SkillGapPanel';
import { useTranslation } from 'react-i18next';
import {
  sortGapsByImpact,
  isDashboardNotStarted,
  getDashboardReadiness,
  buildDisplayGaps,
  calculateChecklistProgress
} from '../../lib/dashboardLogic';
import {
  TrendingUp,
  BrainCircuit,
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  Award,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Layers,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  Target
} from 'lucide-react';

export interface CareerRoleItem {
  id: string;
  code: string;
  title: string;
  description: string;
  industryDemand: string;
}

export interface GapItem {
  skillId: string;
  skillName: string;
  currentLevel: number | null;
  requiredLevel: number;
  gap: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  domainName: string;
  isAssessed?: boolean;
  weight?: number;
  priorityScore?: number;
  needsConfirmation?: boolean;
}

export interface RecommendedCourseItem {
  course: {
    id: string;
    title: string;
    provider: string;
    estimatedHours: number;
    difficulty: string;
    destinationUrl: string;
    isFree?: boolean;
    skillsCovered?: string[];
  };
  matchScore?: number;
  matchingSkill?: string;
  matchPercentage?: number;
  recommendationReason: string;
  gapAddressed?: string;
}

export interface WhatIfAnalysisResult {
  overallReadinessScore: number;
  gaps: GapItem[];
  role?: {
    id: string;
    title: string;
    code: string;
  };
}

export function DashboardPage() {
  const { profile, refreshProfile } = useAuth();
  const { t } = useTranslation();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [roles, setRoles] = useState<CareerRoleItem[]>([]);

  // What-If Compare Modal State
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [compareRoleId, setCompareRoleId] = useState<string>('');
  const [whatIfData, setWhatIfData] = useState<WhatIfAnalysisResult | null>(null);
  const [isLoadingWhatIf, setIsLoadingWhatIf] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  // Quick Role Picker Modal (for empty state)
  const [isPickRoleOpen, setIsPickRoleOpen] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setDashboardError(null);
    try {
      const data = await apiClient<any>('/analytics/learner');
      setStats(data);
      return data;
    } catch (err: any) {
      console.warn('Could not load learner stats:', err);
      setDashboardError(err.message || 'Could not load learner stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Fetch all available roles for What-If Compare & Role Picker
    apiClient<CareerRoleItem[]>('/competency/roles')
      .then((data) => {
        const rolesList = data || [];
        setRoles(rolesList);
        if (rolesList.length > 0) {
          setCompareRoleId(rolesList[0].id);
        }
      })
      .catch((err) => console.warn('Could not load roles:', err));

    const handleDiagnosticCompleted = () => {
      fetchDashboardData();
      refreshProfile();
    };
    window.addEventListener('skill_setu_diagnostic_completed', handleDiagnosticCompleted);
    return () => {
      window.removeEventListener('skill_setu_diagnostic_completed', handleDiagnosticCompleted);
    };
  }, []);

  // When Compare Role is changed, fetch what-if analysis
  useEffect(() => {
    if (!compareRoleId || !isWhatIfOpen) return;
    setIsLoadingWhatIf(true);
    apiClient<WhatIfAnalysisResult>(`/gap-analysis?roleId=${compareRoleId}`)
      .then((data) => {
        setWhatIfData(data);
      })
      .catch((err) => console.warn('What-if analysis error:', err))
      .finally(() => setIsLoadingWhatIf(false));
  }, [compareRoleId, isWhatIfOpen]);

  const handleApplyRoleSwitch = async (newRoleId: string) => {
    setIsSwitchingRole(true);
    try {
      await apiClient('/profile', {
        method: 'PUT',
        body: JSON.stringify({ targetRoleId: newRoleId })
      });
      await refreshProfile();
      await fetchDashboardData();
      setIsWhatIfOpen(false);
      setIsPickRoleOpen(false);
    } catch (err: any) {
      console.error('Failed to switch target role:', err);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-secondary rounded-lg" />
        <div className="h-44 bg-card rounded-2xl border border-border" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-card rounded-xl border border-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-80 bg-card rounded-xl border border-border" />
          <div className="lg:col-span-6 h-80 bg-card rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  const isNotStarted = isDashboardNotStarted(stats, profile);
  const readiness = getDashboardReadiness(stats, profile);
  const targetRoleId = stats?.targetRoleId ?? profile?.targetRoleId;
  const hasSavedTargetRole = Boolean(targetRoleId);
  const targetRoleTitle =
    stats?.targetRoleTitle ||
    profile?.targetRoleName ||
    roles.find((r) => r.id === targetRoleId)?.title ||
    'Target Career Role';

  const rawRadarData = stats?.radarData ?? [];
  const radarData = rawRadarData
    .filter((d: any) => d.current !== null && d.current !== undefined)
    .map((d: any) => {
      const full = d.skill || '';
      const short = full.length > 13 ? `${full.slice(0, 11)}…` : full;
      return {
        skill: short,
        fullSkill: full,
        current: d.current,
        required: d.required ?? 0
      };
    });

  const unassessedSkillsList = stats?.unassessedSkills || [];
  const rawGaps: GapItem[] = stats?.topGaps ?? [];
  const sortedGaps = sortGapsByImpact(rawGaps);
  const displayGaps = buildDisplayGaps(sortedGaps, unassessedSkillsList);

  const recommendations: RecommendedCourseItem[] = stats?.recommendedCourses ?? [];
  const weeklyHours = profile?.weeklyStudyHours || 10;
  const totalSkills = stats?.totalSkillsCount ?? displayGaps.length ?? 0;
  const assessedSkills = stats?.assessedSkillsCount ?? 0;
  const coveragePercentage = totalSkills > 0 ? Math.min(100, Math.round((assessedSkills / totalSkills) * 100)) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-[1720px] mx-auto pb-20">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: t('nav.dashboard') }]} />

      {/* Top Header: Welcome, Career Goal, and Primary Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('dashboard.badge')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t('dashboard.welcome')}, {profile?.fullName || 'Learner'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
            <span>{t('dashboard.targetRoleLabel')}:</span>
            {!hasSavedTargetRole ? (
              <button
                type="button"
                onClick={() => setIsPickRoleOpen(true)}
                className="font-semibold text-blue-600 dark:text-blue-400 underline hover:opacity-80"
              >
                {t('dashboard.notSelectedRole')}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <strong className="text-foreground font-semibold">{targetRoleTitle}</strong>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWhatIfOpen(true)}
                  className="h-6 text-[11px] px-2 py-0 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <SlidersHorizontal className="w-3 h-3 mr-1" />
                  <span>{t('dashboard.whatIf.switchButton')}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Primary Screen Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link to="/assessments?returnTo=/dashboard" className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('nav.assessments')}</span>
            </Button>
          </Link>
          <Link to="/quizzes" className="flex-1 sm:flex-none">
            <Button
              variant="primary"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 rounded-xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav.quizzes')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Brand-New User: Clean Checklist State */}
      {isNotStarted ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
              {t('dashboard.emptyState.tag')}
            </span>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-foreground">
              {t('dashboard.emptyState.title')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('dashboard.emptyState.subtitle')}
            </p>
          </div>

          {/* 4-Step Checklist */}
          {(() => {
            const checklist = calculateChecklistProgress(hasSavedTargetRole, {
              diagnosticAttemptsCount: (stats?.recentAssessments?.length ?? 0) > 0 ? 1 : 0,
              activeGapsCount: 0,
              completedCoursesCount: 0
            });

            return (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground pb-1">
                  <span>{t('dashboard.emptyState.checklistTitle')}</span>
                  <span className="text-muted-foreground">
                    {t('dashboard.emptyState.checklistProgress', {
                      completed: checklist.completedCount,
                      total: checklist.totalCount
                    })}
                  </span>
                </div>

                {/* Step 1: Target Role */}
                <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {checklist.step1Completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-foreground">
                        1. {t('dashboard.emptyState.step1Title')}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('dashboard.emptyState.step1Desc')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsPickRoleOpen(true)}
                    className="text-xs w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  >
                    {t('dashboard.emptyState.selectRoleBtn')}
                  </Button>
                </div>

                {/* Step 2: Diagnostic Assessment */}
                <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {checklist.step2Completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-foreground">
                        2. {t('dashboard.emptyState.step2Title')}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('dashboard.emptyState.step2Desc')}
                      </p>
                    </div>
                  </div>
                  <Link to="/assessments?returnTo=/dashboard" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                      {t('dashboard.readiness.takeDiagnostic')}
                    </Button>
                  </Link>
                </div>

                {/* Step 3: Skill Gaps */}
                <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-foreground">
                        3. {t('dashboard.emptyState.step3Title')}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('dashboard.emptyState.step3Desc')}
                      </p>
                    </div>
                  </div>
                  <Link to="/skill-gaps" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                      {t('dashboard.emptyState.viewGapsBtn')}
                    </Button>
                  </Link>
                </div>

                {/* Step 4: First Course */}
                <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-foreground">
                        4. {t('dashboard.emptyState.step4Title')}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('dashboard.emptyState.step4Desc')}
                      </p>
                    </div>
                  </div>
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                      {t('dashboard.emptyState.exploreCoursesBtn')}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* Populated State with Full Dashboard Analytics */
        <div className="space-y-6 sm:space-y-8">
          {/* Section 1: Large Readiness Ring & Coverage Gauge */}
          <ReadinessGauge
            score={readiness}
            assessedCount={assessedSkills}
            totalCount={totalSkills}
            coveragePercentage={coveragePercentage}
            isIncomplete={readiness === null}
            targetRoleTitle={targetRoleTitle}
          />

          {/* Section 2: Reusable Stat Tiles (Every number labeled with unit + calculation tooltip) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatTile
              label={t('dashboard.statAssessed')}
              value={assessedSkills}
              unit={t('dashboard.statAssessedUnit', { total: totalSkills })}
              tooltip={t('dashboard.statAssessedTooltip')}
              icon={Target}
              badge={
                <Badge variant={coveragePercentage >= 60 ? 'strong' : 'needsImprovement'}>
                  {coveragePercentage}% {t('dashboard.readiness.coverageTitle')}
                </Badge>
              }
            />

            <StatTile
              label={t('dashboard.statHours')}
              value={stats?.totalLearningHours || 0}
              unit={t('dashboard.statHoursUnit')}
              tooltip={t('dashboard.statHoursTooltip')}
              icon={Clock}
            />

            <StatTile
              label={t('dashboard.statCompleted')}
              value={stats?.completedCoursesCount || 0}
              unit={t('dashboard.statCompletedUnit')}
              tooltip={t('dashboard.statCompletedTooltip')}
              icon={CheckCircle}
            />

            <StatTile
              label={t('dashboard.statQuizAvg')}
              value={stats?.averageQuizScore || 0}
              unit={t('dashboard.statQuizAvgUnit')}
              tooltip={t('dashboard.statQuizAvgTooltip')}
              icon={Award}
              trend={{
                value: t('dashboard.statCalibrated'),
                positive: (stats?.averageQuizScore || 0) >= 70,
              }}
            />
          </div>

          {/* Section 3: Top 3 Priority Skill Gaps (Highlighted Cards with Single Close Action) */}
          <PriorityGapsHighlight gaps={sortedGaps} />

          {/* Section 4: 2-Column Grid: Skill-vs-Target Radar Chart & Readiness Progress Over Time */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-6">
              <SkillRadarChart data={radarData} />
            </div>
            <div className="lg:col-span-6">
              <ReadinessTrendChart
                history={stats?.readinessHistory || []}
                currentScore={readiness}
              />
            </div>
          </div>

          {/* Section 5: The Skill Gap Panel (Most Important Part of Product) */}
          <SkillGapPanel gaps={displayGaps} />

          {/* Section 6: Roadmap Summary Card */}
          <RoadmapSummaryCard
            recommendations={recommendations}
            weeklyHours={weeklyHours}
            completedCount={stats?.completedCoursesCount || 0}
            totalCount={Math.max(4, recommendations.length)}
          />

          {/* Section 7: Recent Quiz History (Preserved from Module B1) */}
          {(!stats?.quizScoreHistory || stats.quizScoreHistory.length === 0) ? (
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-sans flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>{t('dashboard.quizHistory.title')}</span>
                  </span>
                  <Link to="/quizzes" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                    <span>{t('dashboard.quizHistory.practiceCta')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 text-center space-y-2">
                <p className="text-xs font-medium text-foreground">
                  {t('dashboard.quizHistory.emptyTitle')}
                </p>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  {t('dashboard.quizHistory.emptyDesc')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-sans flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>{t('dashboard.quizHistory.title')}</span>
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t('dashboard.quizHistory.subtitle')}
                  </p>
                </div>
                <Link
                  to="/quizzes"
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>{t('common.viewAll')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {stats.quizScoreHistory.map((item: any) => {
                    const isHigh = item.score >= 80;
                    const isMedium = item.score >= 60;
                    // Strip [INACTIVE] prefix if present
                    const cleanTitle = (item.title || 'Quiz Attempt').replace(/^\[INACTIVE\]\s*/i, '');

                    return (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{cleanTitle}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(item.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge variant={isHigh ? 'strong' : isMedium ? 'needsImprovement' : 'critical'}>
                            {item.score}%
                          </Badge>
                          <Link to={`/quizzes?attemptId=${item.id}`}>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 hover:text-blue-700 px-2.5">
                              {t('dashboard.quizHistory.review')}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* What-If Compare & Role Switcher Modal */}
      <Modal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        title={t('dashboard.whatIfModal.title')}
        className="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.whatIfModal.desc')}
          </p>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">{t('dashboard.whatIfModal.selectLabel')}</label>
            <select
              value={compareRoleId}
              onChange={(e) => setCompareRoleId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.industryDemand} Demand)
                </option>
              ))}
            </select>
          </div>

          {isLoadingWhatIf ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">
              {t('dashboard.whatIfModal.simulating')}
            </div>
          ) : whatIfData ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <Badge variant="outline" className="text-[9px]">{t('dashboard.whatIfModal.activeGoal')}</Badge>
                  <div className="font-sans font-bold text-sm text-foreground truncate">{targetRoleTitle}</div>
                  <div className="text-lg font-bold text-blue-600">{readiness ?? '--'}/100</div>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 space-y-1">
                  <Badge variant="default" className="text-[9px] bg-blue-600">{t('dashboard.whatIfModal.simulatedGoal')}</Badge>
                  <div className="font-sans font-bold text-sm text-foreground truncate">
                    {roles.find((r) => r.id === compareRoleId)?.title || 'Compared Role'}
                  </div>
                  <div className="text-lg font-bold text-blue-600">{whatIfData.overallReadinessScore}/100</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-secondary/50 border border-border text-center text-xs font-semibold">
                {(() => {
                  const curr = readiness || 0;
                  const delta = whatIfData.overallReadinessScore - curr;
                  if (delta > 0) return <span className="text-emerald-600">{t('dashboard.whatIfModal.increase', { delta })}</span>;
                  if (delta < 0) return <span className="text-amber-600">{t('dashboard.whatIfModal.decrease', { delta })}</span>;
                  return <span className="text-muted-foreground">{t('dashboard.whatIfModal.identical')}</span>;
                })()}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="font-semibold text-foreground text-[11px]">
                  {t('dashboard.whatIfModal.topGaps', { role: roles.find((r) => r.id === compareRoleId)?.title || '' })}
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(whatIfData.gaps || []).length === 0 ? (
                    <div className="p-3 text-center text-muted-foreground text-[11px]">
                      {t('dashboard.whatIfModal.noGaps')}
                    </div>
                  ) : (
                    (whatIfData.gaps || []).slice(0, 4).map((g) => (
                      <div
                        key={g.skillId}
                        className="p-2 rounded-lg border border-border bg-background flex items-center justify-between text-[11px]"
                      >
                        <span className="text-foreground font-medium">{g.skillName}</span>
                        <span className="text-blue-600 font-semibold">
                          {t('dashboard.whatIfModal.gapLabel', { gap: Math.abs(g.gap).toFixed(1) })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWhatIfOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              size="sm"
              isLoading={isSwitchingRole}
              onClick={() => handleApplyRoleSwitch(compareRoleId)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            >
              {t('dashboard.whatIfModal.switchGoal', {
                role: roles.find((r) => r.id === compareRoleId)?.title || t('dashboard.readiness.targetRoleFallback')
              })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick Role Picker Modal */}
      <Modal
        isOpen={isPickRoleOpen}
        onClose={() => setIsPickRoleOpen(false)}
        title={t('dashboard.rolePickerModal.title')}
        className="max-w-lg"
      >
        <div className="space-y-3 text-xs">
          <p className="text-muted-foreground">
            {t('dashboard.rolePickerModal.desc')}
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {roles.map((r) => (
              <div
                key={r.id}
                onClick={() => handleApplyRoleSwitch(r.id)}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-sans font-bold text-sm text-foreground">{r.title}</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{r.description}</p>
                </div>
                <Badge variant="outline" className="text-[10px] whitespace-nowrap ml-2">
                  {r.industryDemand}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default DashboardPage;
