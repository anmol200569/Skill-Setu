import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = () => {
    setIsLoading(true);
    setError(null);
    apiClient('/analytics/admin')
      .then((data) => setAnalytics(data))
      .catch((err) => {
        console.warn('Admin analytics fetch failed:', err);
        setError(err.message || 'Failed to load organization analytics');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-card rounded-xl border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-card rounded-xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <div className="text-sm font-semibold text-red-600">
          {t('admin.skillsAnalysis.error', 'Failed to load organization analytics')}
        </div>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={fetchAnalytics} size="sm" variant="outline" className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          {t('admin.skillsAnalysis.retry', 'Retry')}
        </Button>
      </div>
    );
  }

  const popularRoles = analytics?.popularRoles || [];
  const commonGaps = analytics?.commonSkillGaps || [];
  const recentActivity = analytics?.recentLearnerActivity || [];

  // Chart data: skills with sufficient assessed learners (>= 3)
  const chartSkills = commonGaps.filter((g: any) => g.hasEnoughData && g.gapPercentage !== null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            {t('admin.title', 'Administrator Studio')}
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
            {t('admin.heading', 'Organization Skill Intelligence')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('admin.subheading', 'Real-time analytics across learner cohorts, competency demand, and assessment metrics.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/competency">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C2410C]" />
              {t('admin.manageCompetencies', 'Manage Competencies')}
            </Button>
          </Link>
          <Link to="/admin/courses">
            <Button size="sm" className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {t('admin.manageCourses', 'Manage Courses')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('admin.totalLearners', 'Total Learners')}</div>
              <div className="text-2xl font-serif font-bold text-foreground mt-1">
                {analytics?.totalLearners || 0}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('admin.activeQuizzes', 'AI Quizzes Active')}</div>
              <div className="text-2xl font-serif font-bold text-foreground mt-1">
                {analytics?.totalQuizzesGenerated || 0}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('admin.diagnosticsCompleted', 'Diagnostics Completed')}</div>
              <div className="text-2xl font-serif font-bold text-foreground mt-1">
                {analytics?.totalAssessmentsCompleted || 0}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('admin.avgPlatformReadiness', 'Avg Platform Readiness')}</div>
              <div className="text-2xl font-serif font-bold text-[#C2410C] mt-1">
                {analytics?.avgPlatformReadiness !== null && analytics?.avgPlatformReadiness !== undefined
                  ? `${analytics.avgPlatformReadiness}%`
                  : t('admin.notEnoughData', 'Not enough data')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Skill Gaps Horizontal Bar Chart & Detailed Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-serif flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C2410C]" />
              <span>{t('admin.skillsAnalysis.title', 'Organization-Wide Skill Gap Frequency')}</span>
            </span>
            <span className="text-xs font-sans text-muted-foreground font-normal">
              {t('admin.skillsAnalysis.subtitle', 'Percentage of assessed learners exhibiting a competency gap per skill')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-5">
          {/* Horizontal Bar Chart */}
          {chartSkills.length === 0 ? (
            <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border p-6 space-y-2">
              <BarChart3 className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <p className="text-xs font-medium text-foreground">
                {t('admin.skillsAnalysis.emptyChart', 'Not enough assessment data to plot cohort trends (minimum 3 assessed learners per skill required).')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-foreground">
                {t('admin.skillsAnalysis.chartTitle', 'Cohort Skill Gap Distribution (% Affected)')}
              </div>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={chartSkills.slice(0, 10)}
                    margin={{ top: 10, right: 30, left: 110, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="skillName"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: any, _name: any, props: any) => [
                        `${value}% (${props.payload.learnersWithGap} of ${props.payload.assessedLearners} assessed learners)`,
                        'Gap Prevalence'
                      ]}
                    />
                    <Bar dataKey="gapPercentage" fill="#C2410C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Detailed Skill Metrics Table */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="text-xs font-semibold text-foreground">
              {t('admin.skillsAnalysis.tableTitle', 'Detailed Skill Metrics')}
            </div>
            {commonGaps.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No skill gap data recorded.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="py-2.5 font-medium">{t('admin.skillsAnalysis.skillCol', 'Skill & Domain')}</th>
                      <th className="py-2.5 font-medium text-center">{t('admin.skillsAnalysis.assessedCol', 'Assessed Learners')}</th>
                      <th className="py-2.5 font-medium text-center">{t('admin.skillsAnalysis.withGapCol', 'Learners with Gap')}</th>
                      <th className="py-2.5 font-medium text-center">{t('admin.skillsAnalysis.gapPercentCol', 'Prevalence (% with gap)')}</th>
                      <th className="py-2.5 font-medium text-right">{t('admin.skillsAnalysis.avgGapCol', 'Avg Deficit')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {commonGaps.map((skill: any) => (
                      <tr key={skill.skillId} className="hover:bg-secondary/20">
                        <td className="py-2.5 pr-4">
                          <div className="font-semibold text-foreground">{skill.skillName}</div>
                          <div className="text-[10px] text-muted-foreground">{skill.domainName}</div>
                        </td>
                        <td className="py-2.5 text-center text-muted-foreground">{skill.assessedLearners}</td>
                        <td className="py-2.5 text-center text-muted-foreground">{skill.learnersWithGap}</td>
                        <td className="py-2.5 text-center">
                          {skill.hasEnoughData && skill.gapPercentage !== null ? (
                            <Badge variant={skill.gapPercentage >= 50 ? 'critical' : skill.gapPercentage >= 25 ? 'high' : 'medium'}>
                              {skill.gapPercentage}%
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              {t('admin.skillsAnalysis.notEnoughData', 'Not enough data (< 3 assessed)')}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right font-medium text-[#C2410C]">
                          {skill.avgGap > 0 ? `-${skill.avgGap}` : '0.0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Target Roles Distribution & Recent Organization Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Popular Roles Distribution */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base font-serif">
              {t('admin.popularRolesTitle', 'Target Career Role Distribution')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularRoles.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                {t('admin.noRoles', 'No target career roles selected yet.')}
              </div>
            ) : (
              popularRoles.map((role: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between text-xs"
                >
                  <div className="font-semibold text-foreground">{role.roleTitle}</div>
                  <Badge variant="outline">{role.learnerCount} {t('admin.aspirants', 'Aspirants')}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed (Strictly Anonymized: NO names or emails) */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C2410C]" />
              <span>{t('admin.recentActivityTitle', 'Recent Organization Activity')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                {t('admin.noRecentActivity', 'No recent learner activities logged.')}
              </div>
            ) : (
              <div className="divide-y divide-border text-xs">
                {recentActivity.map((act: any) => (
                  <div key={act.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">{act.learnerDisplay || 'Learner'}</span>
                      <span className="text-muted-foreground ml-2">{act.detail}</span>
                    </div>
                    <span className="text-muted-foreground text-[11px]">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
