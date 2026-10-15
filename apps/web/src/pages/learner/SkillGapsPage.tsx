import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { SkillGapPanel } from '../../components/dashboard/SkillGapPanel';
import { PriorityGapsHighlight } from '../../components/dashboard/PriorityGapsHighlight';
import { GapItem, CareerRoleItem } from './DashboardPage';
import { sortGapsByImpact, buildDisplayGaps } from '../../lib/dashboardLogic';
import {
  GitCompare,
  Compass,
  Target,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';

export function SkillGapsPage() {
  const { profile } = useAuth();
  const { t } = useTranslation();

  const [stats, setStats] = useState<any>(null);
  const [roles, setRoles] = useState<CareerRoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGapsData = () => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      apiClient<any>('/analytics/learner'),
      apiClient<CareerRoleItem[]>('/competency/roles').catch(() => [])
    ])
      .then(([learnerData, rolesData]) => {
        setStats(learnerData);
        setRoles(rolesData || []);
      })
      .catch((err) => {
        console.warn('Could not load skill gap analytics:', err);
        setError(err.message || 'Could not load skill gaps');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadGapsData();

    const handleDiagnosticCompleted = () => {
      loadGapsData();
    };
    window.addEventListener('skill_setu_diagnostic_completed', handleDiagnosticCompleted);
    return () => {
      window.removeEventListener('skill_setu_diagnostic_completed', handleDiagnosticCompleted);
    };
  }, []);

  const targetRoleId = stats?.targetRoleId ?? profile?.targetRoleId;
  const targetRoleTitle =
    stats?.targetRoleTitle ||
    profile?.targetRoleName ||
    roles.find((r) => r.id === targetRoleId)?.title ||
    'Target Career Role';

  const rawGaps: GapItem[] = stats?.topGaps ?? [];
  const unassessedSkillsList = stats?.unassessedSkills ?? [];
  const sortedGaps = useMemo(() => sortGapsByImpact(rawGaps), [rawGaps]);
  const displayGaps = useMemo(
    () => buildDisplayGaps(sortedGaps, unassessedSkillsList),
    [sortedGaps, unassessedSkillsList]
  );

  // Counts for summary tiles
  const totalCompetencies = displayGaps.length;
  const needsImprovementCount = displayGaps.filter(
    (g) => g.isAssessed !== false && g.currentLevel !== null && (g.currentLevel as number) < g.requiredLevel
  ).length;
  const strongCount = displayGaps.filter(
    (g) => g.isAssessed !== false && g.currentLevel !== null && (g.currentLevel as number) >= g.requiredLevel
  ).length;
  const notAssessedCount = displayGaps.filter(
    (g) => g.isAssessed === false || g.currentLevel === null || g.currentLevel === undefined
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-pulse">
        <Skeleton variant="title" className="w-48 h-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="statTile" />
          ))}
        </div>
        <Skeleton variant="card" className="h-96" />
      </div>
    );
  }

  if (!targetRoleId && displayGaps.length === 0) {
    return (
      <div className="space-y-6 w-full max-w-[1720px] mx-auto">
        <Breadcrumbs items={[{ label: t('nav.skillGaps') }]} />
        <EmptyState
          icon={Compass}
          title={t('skillGapsPage.noRoleTitle')}
          description={t('skillGapsPage.noRoleDesc')}
          primaryAction={{
            label: t('skillGapsPage.selectRoleBtn'),
            onClick: () => window.location.assign('/profile'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-[1720px] mx-auto pb-20">
      {/* Breadcrumb Hierarchy */}
      <Breadcrumbs items={[{ label: t('nav.skillGaps') }]} />

      {/* Header with Career Goal and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('skillGapsPage.roleLabel')}: {targetRoleTitle}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{t('skillGapsPage.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
            {t('skillGapsPage.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link to="/assessments?returnTo=/skill-gaps">
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('skillGapsPage.takeDiagnostic')}</span>
            </Button>
          </Link>
          <Link to="/profile">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('skillGapsPage.changeRole')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile
          label={t('skillGapsPage.statTotal')}
          value={totalCompetencies}
          unit="skills"
          tooltip={t('skillGapsPage.statTotalTooltip')}
          icon={Layers}
        />

        <StatTile
          label={t('skillGapsPage.statNeedsImprovement')}
          value={needsImprovementCount}
          unit="gaps"
          tooltip={t('skillGapsPage.statNeedsImprovementTooltip')}
          icon={AlertTriangle}
          badge={
            needsImprovementCount > 0 ? (
              <Badge variant="needsImprovement" icon={AlertTriangle}>
                {t('skillGapsPage.badgeHighLeverage')}
              </Badge>
            ) : undefined
          }
        />

        <StatTile
          label={t('skillGapsPage.statStrong')}
          value={strongCount}
          unit="skills"
          tooltip={t('skillGapsPage.statStrongTooltip')}
          icon={CheckCircle2}
          badge={
            strongCount > 0 ? (
              <Badge variant="strong" icon={CheckCircle2}>
                {t('skillGapsPage.badgeProficient', { defaultValue: 'Proficient' })}
              </Badge>
            ) : undefined
          }
        />

        <StatTile
          label={t('skillGapsPage.statNotAssessed')}
          value={notAssessedCount}
          unit="pending"
          tooltip={t('skillGapsPage.statNotAssessedTooltip')}
          icon={HelpCircle}
          badge={
            notAssessedCount > 0 ? (
              <Badge variant="notAssessed" icon={HelpCircle}>
                {t('skillGapsPage.badgeNeedsTest')}
              </Badge>
            ) : undefined
          }
        />
      </div>

      {/* Top 3 Priority Skill Gaps Highlight */}
      <PriorityGapsHighlight gaps={sortedGaps} />

      {/* Comprehensive Skill Gap Panel with Filters, Search, Evidence & Courses */}
      <SkillGapPanel
        gaps={displayGaps}
        title={t('dashboard.skillGapPanel.title')}
        description={t('dashboard.skillGapPanel.description')}
      />
    </div>
  );
}
export default SkillGapsPage;
