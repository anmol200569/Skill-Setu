import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useTranslation } from 'react-i18next';
import {
  sortGapsByImpact,
  isDashboardNotStarted,
  getDashboardReadiness,
  determineNextBestAction
} from '../../lib/dashboardLogic';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
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
  PlayCircle,
  CheckCircle2,
  Circle,
  Layers,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Check
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
  const [roles, setRoles] = useState<CareerRoleItem[]>([]);

  // What-If Compare Modal State
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [compareRoleId, setCompareRoleId] = useState<string>('');
  const [whatIfData, setWhatIfData] = useState<WhatIfAnalysisResult | null>(null);
  const [isLoadingWhatIf, setIsLoadingWhatIf] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  // Quick Role Picker Modal (for empty state)
  const [isPickRoleOpen, setIsPickRoleOpen] = useState(false);

  // This-Week Plan Checkbox State
  const [completedMilestones, setCompletedMilestones] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('skill_setu_weekly_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  const toggleMilestone = (idx: number) => {
    setCompletedMilestones((prev) => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem('skill_setu_weekly_milestones', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const fetchDashboardData = () => {
    setIsLoading(true);
    apiClient('/analytics/learner')
      .then((data) => setStats(data))
      .catch((err) => console.warn('Could not load learner stats:', err))
      .finally(() => setIsLoading(false));
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
      fetchDashboardData();
      setIsWhatIfOpen(false);
      setIsPickRoleOpen(false);
    } catch (err: any) {
      console.error('Failed to switch target role:', err);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  // Mobile-first Skeleton Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-20 bg-card rounded-2xl border border-border" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-card rounded-2xl border border-border" />
          ))}
        </div>
        <div className="h-36 bg-card rounded-2xl border border-border" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-80 bg-card rounded-2xl border border-border" />
          <div className="lg:col-span-6 h-80 bg-card rounded-2xl border border-border" />
        </div>
      </div>
    );
  }

  const isNotStarted = isDashboardNotStarted(stats, profile);
  const readiness = getDashboardReadiness(stats, profile);
  const targetRoleId = stats?.targetRoleId ?? profile?.targetRoleId;
  const targetRoleTitle =
    stats?.targetRoleTitle ||
    profile?.targetRoleName ||
    roles.find((r) => r.id === targetRoleId)?.title ||
    'Target Career Role';

  const rawRadarData = stats?.radarData ?? [];
  // Radar data with short names to prevent clipped polar labels
  const radarData = rawRadarData.map((d: any) => {
    const full = d.skill || '';
    const short = full.length > 11 ? `${full.slice(0, 9)}…` : full;
    return {
      skill: short,
      fullSkill: full,
      current: d.current ?? 0,
      required: d.required ?? 0
    };
  });

  // Gaps sorted by impact (largest absolute gap first)
  const rawGaps: GapItem[] = stats?.topGaps ?? [];
  const sortedGaps = sortGapsByImpact(rawGaps);

  const recommendations: RecommendedCourseItem[] = stats?.recommendedCourses ?? [];
  const weeklyHours = profile?.weeklyStudyHours || 10;

  // Next Best Action Determination using pure logic
  const { topGap, topCourse, estimatedGain } = determineNextBestAction(
    sortedGaps,
    recommendations,
    radarData.length > 0 ? radarData : sortedGaps
  );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome & Target Role Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
              {t('dashboard.badge')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {t('dashboard.welcome')}, {profile?.fullName || 'Learner'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
            <span>{t('dashboard.targetRoleLabel')}:</span>
            {isNotStarted ? (
              <button
                onClick={() => setIsPickRoleOpen(true)}
                className="font-semibold text-[#C2410C] underline hover:opacity-80"
              >
                {t('dashboard.notSelectedRole')}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <strong className="text-foreground font-serif">{targetRoleTitle}</strong>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWhatIfOpen(true)}
                  className="h-6 text-[11px] px-2 py-0 border-[#C2410C]/30 text-[#C2410C] hover:bg-[#C2410C]/10"
                >
                  <SlidersHorizontal className="w-3 h-3 mr-1" />
                  <span>{t('dashboard.whatIf.switchButton')}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Nav Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link to="/assessments" className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <Award className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Diagnostic</span>
            </Button>
          </Link>
          <Link to="/quizzes" className="flex-1 sm:flex-none">
            <Button
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BRAND-NEW USER: EMPTY STATE CHECKLIST (NO NUMBERS IF NOT STARTED) */}
      {/* ============================================================== */}
      {isNotStarted ? (
        <div className="space-y-6">
          {/* Main Empty State Banner */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C2410C]">
                {t('dashboard.emptyState.tag')}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                {t('dashboard.emptyState.title')}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('dashboard.emptyState.subtitle')}
              </p>
            </div>

            {/* 4-Step Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground pb-1">
                <span>{t('dashboard.emptyState.checklistTitle')}</span>
                <span className="text-muted-foreground">
                  {t('dashboard.emptyState.checklistProgress', {
                    completed: targetRoleId ? 1 : 0,
                    total: 4
                  })}
                </span>
              </div>

              {/* Step 1: Pick Target Role */}
              <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {targetRoleId ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
                  className="text-xs w-full sm:w-auto"
                >
                  {t('dashboard.emptyState.step1Action')}
                </Button>
              </div>

              {/* Step 2: Take First Diagnostic */}
              <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {stats?.recentAssessments?.length > 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
                <Link to="/assessments" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                    {t('dashboard.emptyState.step2Action')}
                  </Button>
                </Link>
              </div>

              {/* Step 3: Review Skill Gaps */}
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
                <Link to="/assessments" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                    {t('dashboard.emptyState.step3Action')}
                  </Button>
                </Link>
              </div>

              {/* Step 4: Start Recommended Course */}
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
                    {t('dashboard.emptyState.step4Action')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Backend-Matched Notice: No Fake Numbers */}
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#C2410C] flex-shrink-0" />
              <span>{t('dashboard.emptyState.noNumbersNotice')}</span>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* POPULATED STATE: BENCHMARK WITH DATA                           */
        /* ============================================================== */
        <>
          {/* Top Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Tile 1: Readiness /100 */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {t('dashboard.readinessTitle')}
                  </div>
                  {readiness !== null ? (
                    <>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C2410C]">
                          {readiness}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {t('dashboard.readinessOutOf')}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {stats?.assessedRatioText ||
                          `Based on ${stats?.assessedSkillsCount ?? 0} of ${stats?.totalSkillsCount ?? stats?.topGaps?.length ?? 0} skills assessed`}
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 space-y-1.5">
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {t('dashboard.notStartedTag', { defaultValue: 'not started' })}
                      </span>
                      <div>
                        <Link to="/assessments">
                          <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 py-0 mt-1 border-[#C2410C]/40 text-[#C2410C]">
                            {t('dashboard.takeFirstDiagnostic', { defaultValue: 'Take your first diagnostic' })}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Tile 2: Hours Logged */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {t('dashboard.hoursStudied')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
                    {stats?.totalLearningHours || 0} hrs
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Tile 3: Completed Courses */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {t('dashboard.coursesDone')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
                    {stats?.completedCoursesCount || 0}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Tile 4: Average Quiz Score */}
            <Card className="border-border">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {t('dashboard.avgScore')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
                    {stats?.averageQuizScore || 0}%
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================================== */}
          {/* ONE PROMINENT "NEXT BEST ACTION" CARD                         */}
          {/* ============================================================== */}
          <div className="rounded-2xl border border-[#C2410C]/40 bg-gradient-to-r from-[#C2410C]/10 via-[#C2410C]/5 to-transparent p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
                    {t('dashboard.nextAction.tag')}
                  </span>
                  {readiness !== null && estimatedGain > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {t('dashboard.nextAction.impactLabel', {
                        pts: estimatedGain
                      })}
                    </Badge>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  {topGap
                    ? `${t('dashboard.nextAction.title')}: Bridge ${topGap.skillName}`
                    : `${t('dashboard.nextAction.title')}: Take Diagnostic Assessment`}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {topCourse
                    ? `${topCourse.recommendationReason} (${topCourse.course.title} • ${topCourse.course.estimatedHours} hrs)`
                    : topGap
                    ? t('dashboard.nextAction.noCourseCoveringGap', {
                        defaultValue: 'No curated course currently covers this specific gap in the catalog. Explore all catalog courses or start with foundational practice.'
                      })
                    : 'Complete your competency evaluation to isolate specific skill deficiencies against industry benchmarks.'}
                </p>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                {topCourse ? (
                  <a
                    href={topCourse.course.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full sm:w-auto"
                  >
                    <Button size="sm" className="w-full sm:w-auto text-xs font-semibold shadow-sm">
                      <span>{t('dashboard.nextAction.button')}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </a>
                ) : topGap && !topGap.isAssessed ? (
                  <Link to="/assessments" className="inline-block w-full sm:w-auto">
                    <Button size="sm" className="w-full sm:w-auto text-xs font-semibold shadow-sm">
                      <span>{t('dashboard.takeFirstDiagnostic', { defaultValue: 'Take your first diagnostic' })}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/courses" className="inline-block w-full sm:w-auto">
                    <Button size="sm" className="w-full sm:w-auto text-xs font-semibold shadow-sm">
                      <span>{t('dashboard.browseCatalogue', { count: 61 })}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MAIN GRID: RADAR CHART (NO CLIPPING) + IMPACT-SORTED GAPS    */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* RADAR CHART WITH SHORT LABELS & TOOLTIP */}
            <Card className="lg:col-span-6 border-border flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-serif flex items-center justify-between">
                  <span>{t('dashboard.radar.title')}</span>
                  <span className="text-xs font-sans text-muted-foreground font-normal">
                    {t('dashboard.radar.scale')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 15, right: 25, bottom: 15, left: 25 }}>
                      <PolarGrid stroke="#D4D0C5" className="dark:stroke-border/60" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: '#6B6861', fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tick={{ fill: '#6B6861', fontSize: 10 }}
                        tickCount={6}
                      />
                      <Tooltip
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-popover border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                                <div className="font-semibold text-foreground">
                                  {item.fullSkill || item.skill}
                                </div>
                                <div className="text-[#C2410C] font-medium">
                                  {t('dashboard.radar.tooltipCurrent', { score: item.current })}
                                </div>
                                <div className="text-muted-foreground">
                                  {t('dashboard.radar.tooltipRequired', { score: item.required })}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#C2410C"
                        fill="#C2410C"
                        fillOpacity={0.4}
                      />
                      <Radar
                        name="Required"
                        dataKey="required"
                        stroke="#1A1A18"
                        className="dark:stroke-foreground/60"
                        fill="#1A1A18"
                        fillOpacity={0.15}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Radar Legend */}
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-3 border-t border-border">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
                    <span>{t('dashboard.radar.currentLegend')}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A18] dark:bg-foreground/60" />
                    <span>{t('dashboard.radar.requiredLegend')}</span>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* SKILL-BY-SKILL GAP BARS SORTED BY IMPACT */}
            <Card className="lg:col-span-6 border-border flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-serif flex items-center justify-between">
                  <div>
                    <span>{t('dashboard.gapBars.title')}</span>
                    <p className="text-[11px] font-sans text-muted-foreground font-normal mt-0.5">
                      {t('dashboard.gapBars.subtitle')}
                    </p>
                  </div>
                  <Link
                    to="/assessments"
                    className="text-xs font-sans text-[#C2410C] hover:underline flex items-center gap-0.5 whitespace-nowrap"
                  >
                    <span>{t('dashboard.viewAllGaps')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {sortedGaps.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span>{t('dashboard.gapBars.allMet')}</span>
                  </div>
                ) : (
                  sortedGaps.slice(0, 5).map((gap) => {
                    const isAssessed = gap.isAssessed !== false && gap.currentLevel !== null && gap.currentLevel !== undefined;
                    const currentPct = isAssessed ? Math.min(100, ((gap.currentLevel as number) / 5) * 100) : 0;
                    const requiredPct = Math.min(100, (gap.requiredLevel / 5) * 100);
                    const isCritical = Math.abs(gap.gap) >= 1.5;
                    const isHigh = Math.abs(gap.gap) >= 1.0;

                    return (
                      <div
                        key={gap.skillId}
                        className="p-3 rounded-xl border border-border bg-card space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                              {gap.skillName}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {isAssessed
                                ? t('dashboard.gapBars.current', { current: gap.currentLevel })
                                : t('dashboard.gapBars.notAssessed', { defaultValue: 'Not assessed' })} •{' '}
                              {t('dashboard.gapBars.required', { required: gap.requiredLevel })}
                            </div>
                          </div>
                          <Badge
                            variant={isCritical ? 'critical' : isHigh ? 'high' : 'medium'}
                            className="text-[10px] whitespace-nowrap flex-shrink-0"
                          >
                            {isAssessed
                              ? t('dashboard.gapBars.gapTag', { gap: Math.abs(gap.gap).toFixed(1) })
                              : t('dashboard.gapBars.notAssessed', { defaultValue: 'Not assessed' })}
                          </Badge>
                        </div>

                        {/* Visual Gap Progress Bar */}
                        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                          {/* Required Benchmark Marker */}
                          <div
                            className="absolute top-0 bottom-0 bg-muted-foreground/30 rounded-full"
                            style={{ width: `${requiredPct}%` }}
                          />
                          {/* Current Level */}
                          <div
                            className="absolute top-0 bottom-0 bg-[#C2410C] rounded-full transition-all duration-300"
                            style={{ width: `${currentPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}

                {/* AI Strategy Synthesis */}
                {stats?.aiExplanation && stats.aiExplanation.trim().length > 0 && stats?.assessedSkillsCount !== 0 && (
                  <div className="p-3.5 rounded-xl border border-[#C2410C]/20 bg-[#C2410C]/5 text-xs text-foreground/90 space-y-1 mt-2">
                    <div className="font-bold flex items-center gap-1.5 text-[#C2410C]">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>{t('dashboard.aiSynthesisTitle')}</span>
                    </div>
                    <p className="leading-relaxed text-muted-foreground text-[11px]">
                      {stats.aiExplanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ============================================================== */}
          {/* LOWER GRID: THIS-WEEK PLAN + RECOMMENDED COURSES              */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* THIS-WEEK STRUCTURED LEARNING PLAN */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C2410C]" />
                    <span>{t('dashboard.thisWeek.title')}</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t('dashboard.thisWeek.targetHours', { hours: weeklyHours })}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    idx: 1,
                    text: topCourse
                      ? `Core Module: ${topGap ? topGap.skillName : 'Target Skill'} via ${topCourse.course.title} (${(weeklyHours * 0.4).toFixed(1)} hrs)`
                      : topGap
                      ? `Core Module: Focus on ${topGap.skillName} (${(weeklyHours * 0.4).toFixed(1)} hrs)`
                      : `Core Module: Foundational Competencies (${(weeklyHours * 0.4).toFixed(1)} hrs)`
                  },
                  {
                    idx: 2,
                    text: `Hands-on Lab Practice & Problem Sets (${(weeklyHours * 0.3).toFixed(1)} hrs)`
                  },
                  {
                    idx: 3,
                    text: `Diagnostic & Knowledge Check Quizzes (${(weeklyHours * 0.15).toFixed(1)} hrs)`
                  },
                  {
                    idx: 4,
                    text: `Concept Revision & Code Reflection (${(weeklyHours * 0.15).toFixed(1)} hrs)`
                  }
                ].map((item) => {
                  const isChecked = Boolean(completedMilestones[item.idx]);
                  return (
                    <div
                      key={item.idx}
                      onClick={() => toggleMilestone(item.idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isChecked
                          ? 'border-green-600/30 bg-green-500/5 text-muted-foreground line-through'
                          : 'border-border bg-card hover:bg-secondary/30 text-foreground'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-muted-foreground/40 bg-background'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-medium leading-relaxed select-none">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-muted-foreground pt-1">
                {t('dashboard.thisWeek.progress', {
                  done: Object.values(completedMilestones).filter(Boolean).length,
                  total: 4
                })}
              </div>
            </div>

            {/* CURATED RECOMMENDED COURSES FOR TOP GAPS */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#C2410C]" />
                    <span>{t('dashboard.recommendedCoursesTitle')}</span>
                  </h3>
                </div>
                <Link
                  to="/courses"
                  className="text-xs text-[#C2410C] hover:underline font-semibold whitespace-nowrap"
                >
                  {t('dashboard.browseCatalogue', { count: 61 })}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {recommendations.slice(0, 4).map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between hover:border-[#C2410C]/50 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px]">
                          {rec.course.provider}
                        </Badge>
                        {rec.matchScore && rec.matchScore > 0 ? (
                          <Badge variant="default" className="text-[10px]">
                            Match {rec.matchScore}%
                          </Badge>
                        ) : null}
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2">
                        {rec.course.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">
                        {rec.recommendationReason}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {rec.course.estimatedHours} hrs • {rec.course.difficulty}
                      </span>
                      <a
                        href={rec.course.destinationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:underline"
                      >
                        <span>{t('dashboard.viewTrack')}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* WHAT-IF COMPARE & TARGET ROLE SWITCHER MODAL                   */}
      {/* ============================================================== */}
      <Modal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        title={t('dashboard.whatIf.modalTitle')}
        className="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            {t('dashboard.whatIf.modalSubtitle')}
          </p>

          {/* Role Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              {t('dashboard.whatIf.selectRoleLabel')}
            </label>
            <select
              value={compareRoleId}
              onChange={(e) => setCompareRoleId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-[#C2410C]"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.industryDemand} Demand)
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Side-by-Side Display */}
          {isLoadingWhatIf ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">
              Simulating readiness calculation for comparison role...
            </div>
          ) : whatIfData ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                {/* Active Role Card */}
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <Badge variant="outline" className="text-[9px]">
                    {t('dashboard.whatIf.activeBadge')}
                  </Badge>
                  <div className="font-serif font-bold text-sm text-foreground">
                    {targetRoleTitle}
                  </div>
                  <div className="text-lg font-bold text-[#C2410C]">
                    {readiness ?? '--'}/100
                  </div>
                </div>

                {/* Simulated Role Card */}
                <div className="p-3.5 rounded-xl border border-[#C2410C]/40 bg-[#C2410C]/5 space-y-1">
                  <Badge variant="default" className="text-[9px]">
                    {t('dashboard.whatIf.comparedBadge')}
                  </Badge>
                  <div className="font-serif font-bold text-sm text-foreground">
                    {roles.find((r) => r.id === compareRoleId)?.title || 'Compared Role'}
                  </div>
                  <div className="text-lg font-bold text-[#C2410C]">
                    {whatIfData.overallReadinessScore}/100
                  </div>
                </div>
              </div>

              {/* Delta Qualification Badge */}
              <div className="p-2.5 rounded-lg bg-secondary/50 border border-border text-center text-xs font-semibold">
                {(() => {
                  const curr = readiness || 0;
                  const delta = whatIfData.overallReadinessScore - curr;
                  if (delta > 0) {
                    return (
                      <span className="text-green-600">
                        {t('dashboard.whatIf.deltaGain', { delta })}
                      </span>
                    );
                  }
                  if (delta < 0) {
                    return (
                      <span className="text-amber-600">
                        {t('dashboard.whatIf.deltaLoss', { delta })}
                      </span>
                    );
                  }
                  return (
                    <span className="text-muted-foreground">
                      {t('dashboard.whatIf.deltaEqual')}
                    </span>
                  );
                })()}
              </div>

              {/* Gaps for Compared Role */}
              <div className="space-y-1.5 pt-1">
                <div className="font-semibold text-foreground text-[11px]">
                  {t('dashboard.whatIf.topGapsTitle', {
                    role: roles.find((r) => r.id === compareRoleId)?.title || 'Compared Role'
                  })}
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(whatIfData.gaps || []).slice(0, 4).map((g) => (
                    <div
                      key={g.skillId}
                      className="p-2 rounded-lg border border-border bg-background flex items-center justify-between text-[11px]"
                    >
                      <span className="text-foreground font-medium">{g.skillName}</span>
                      <span className="text-[#C2410C] font-semibold">Gap -{Math.abs(g.gap).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWhatIfOpen(false)}
            >
              {t('dashboard.whatIf.close')}
            </Button>
            <Button
              type="button"
              size="sm"
              isLoading={isSwitchingRole}
              onClick={() => handleApplyRoleSwitch(compareRoleId)}
            >
              {t('dashboard.whatIf.switchAction', {
                role: roles.find((r) => r.id === compareRoleId)?.title || 'Target Role'
              })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* QUICK ROLE PICKER MODAL (FOR BRAND-NEW / EMPTY STATE USERS)    */}
      {/* ============================================================== */}
      <Modal
        isOpen={isPickRoleOpen}
        onClose={() => setIsPickRoleOpen(false)}
        title="Select Your Target Career Role"
        className="max-w-lg"
      >
        <div className="space-y-3 text-xs">
          <p className="text-muted-foreground">
            Choose your target role to calibrate your skills and generate customized course recommendations:
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {roles.map((r) => (
              <div
                key={r.id}
                onClick={() => handleApplyRoleSwitch(r.id)}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-[#C2410C] hover:bg-[#C2410C]/5 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-serif font-bold text-sm text-foreground">{r.title}</div>
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
