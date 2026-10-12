import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
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
  PlayCircle
} from 'lucide-react';

export function DashboardPage() {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient('/analytics/learner')
      .then((data) => setStats(data))
      .catch((err) => console.warn('Could not load learner stats:', err))
      .finally(() => setIsLoading(false));
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
        <div className="h-80 bg-card rounded-xl border border-border" />
      </div>
    );
  }

  const targetRoleId = stats?.targetRoleId ?? stats?.profile?.targetRoleId ?? profile?.targetRoleId;
  const isNotStarted = stats?.status === 'not_started' || !targetRoleId;
  const readiness = isNotStarted ? null : stats?.overallReadiness;
  const radarData = stats?.radarData ?? [];
  const topGaps = stats?.topGaps ?? [];
  const recommendations = stats?.recommendedCourses ?? [];
  const suggestedActions = stats?.suggestedNextActions ?? [];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            AI Skill Intelligence Dashboard
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
            {t('dashboard.welcome')}, {profile?.fullName || 'Learner'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Targeting:{' '}
            <strong className="text-foreground">
              {isNotStarted ? (
                <Link to="/profile" className="text-[#C2410C] underline">
                  Not Selected (Set Target Role in Profile)
                </Link>
              ) : (
                stats?.targetRoleTitle || profile?.targetRoleName || 'Target Role'
              )}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/assessments">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C2410C]" />
              Take Diagnostic
            </Button>
          </Link>
          <Link to="/quizzes">
            <Button size="sm" className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-4 h-4" />
              Generate Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('dashboard.readinessTitle')}</div>
              <div className="text-2xl font-serif font-bold text-[#C2410C] mt-1">
                {readiness !== null ? `${readiness}%` : 'Not Started'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('dashboard.hoursStudied')}</div>
              <div className="text-2xl font-serif font-bold text-foreground mt-1">{stats?.totalLearningHours || 0} hrs</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('dashboard.coursesDone')}</div>
              <div className="text-2xl font-serif font-bold text-foreground mt-1">{stats?.completedCoursesCount || 0}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{t('dashboard.avgScore')}</div>
              <div className="text-2xl font-serif font-bold text-foreground mt-1">{stats?.averageQuizScore || 0}%</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Radar Chart + Ranked Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center justify-between">
              <span>Competency Radar Analysis</span>
              <span className="text-xs font-sans text-muted-foreground font-normal">1 - 5 Scale</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#D4D0C5" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#6B6861', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6B6861', fontSize: 10 }} />
                  <Radar name="Current Score" dataKey="current" stroke="#C2410C" fill="#C2410C" fillOpacity={0.4} />
                  <Radar name="Required" dataKey="required" stroke="#1A1A18" fill="#1A1A18" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t border-border mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#C2410C]"></span> Your Current Level
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1A1A18]"></span> Target Role Requirement
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ranked Gaps */}
        <Card className="lg:col-span-6 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center justify-between">
              <span>Ranked Priority Skill Gaps</span>
              <Link to="/assessments" className="text-xs font-sans text-[#C2410C] hover:underline">
                View All Gaps
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topGaps.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                You currently meet all benchmark requirements for this role!
              </div>
            ) : (
              topGaps.slice(0, 4).map((gap: any) => (
                <div
                  key={gap.skillId}
                  className="p-3.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-foreground">{gap.skillName}</div>
                    <div className="text-xs text-muted-foreground">
                      Current: {gap.currentLevel}/5 • Required: {gap.requiredLevel}/5 • Domain: {gap.domainName}
                    </div>
                  </div>
                  <Badge variant={gap.priority === 'critical' ? 'critical' : gap.priority === 'high' ? 'high' : 'medium'}>
                    Gap -{gap.gap}
                  </Badge>
                </div>
              ))
            )}

            {/* AI Explanation Banner */}
            {stats?.aiExplanation && (
              <div className="p-4 rounded-xl border border-[#C2410C]/20 bg-[#C2410C]/5 text-xs text-foreground/90 space-y-1 mt-4">
                <div className="font-bold flex items-center gap-1.5 text-[#C2410C]">
                  <BrainCircuit className="w-4 h-4" />
                  AI Synthesis & Strategy
                </div>
                <p className="leading-relaxed text-muted-foreground">{stats.aiExplanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggested Actions & Curated Recommended Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Suggested Next Actions */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C2410C]" />
            Suggested Next Actions
          </h3>
          <div className="space-y-3">
            {suggestedActions.map((action: any, idx: number) => (
              <Link key={idx} to={action.link} className="block group">
                <div className="p-4 rounded-xl border border-border bg-card hover:border-[#C2410C]/60 hover:shadow-sm transition-all">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
                    {action.action}
                  </div>
                  <div className="font-semibold text-sm text-foreground mt-0.5 group-hover:text-[#C2410C] transition-colors">
                    {action.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C2410C]" />
              Recommended for Your Top Gaps
            </h3>
            <Link to="/courses" className="text-xs text-[#C2410C] hover:underline font-semibold">
              Browse Catalogue ({stats?.totalCoursesAvailable || '50+'} courses)
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between hover:border-[#C2410C]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">
                      {rec.course.provider}
                    </Badge>
                    <Badge variant="default" className="text-[10px]">
                      Match {rec.matchScore}%
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground line-clamp-2">
                    {rec.course.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {rec.recommendationReason}
                  </p>
                </div>

                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {rec.course.estimatedHours} hrs • {rec.course.difficulty}
                  </span>
                  <a
                    href={rec.course.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:underline"
                  >
                    <span>View Track</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
