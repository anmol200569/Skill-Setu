import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';

export function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient('/analytics/admin')
      .then((data) => setAnalytics(data))
      .catch((err) => console.warn('Admin analytics fetch failed:', err))
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
      </div>
    );
  }

  const popularRoles = analytics?.popularRoles || [];
  const commonGaps = analytics?.commonSkillGaps || [];
  const recentActivity = analytics?.recentLearnerActivity || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            Administrator Studio
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
            Organization Skill Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics across learner cohorts, competency demand, and assessment metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/competency">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C2410C]" />
              Manage Competencies
            </Button>
          </Link>
          <Link to="/admin/courses">
            <Button size="sm" className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Manage Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Learners</div>
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
              <div className="text-xs text-muted-foreground">AI Quizzes Active</div>
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
              <div className="text-xs text-muted-foreground">Diagnostics Completed</div>
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
              <div className="text-xs text-muted-foreground">Avg Platform Readiness</div>
              <div className="text-2xl font-serif font-bold text-[#C2410C] mt-1">
                {analytics?.avgPlatformReadiness || 68}%
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Common Gaps & Popular Target Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Common Skill Gaps Table */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center justify-between">
              <span>Top Organization-Wide Skill Gaps</span>
              <span className="text-xs font-sans text-muted-foreground font-normal">Ranked by frequency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {commonGaps.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No cohort gaps recorded yet. Learners who complete onboarding will populate this table.
              </div>
            ) : (
              <div className="divide-y divide-border text-xs">
                {commonGaps.map((gap: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{gap.skillName}</div>
                      <div className="text-muted-foreground text-[11px]">
                        Affects {gap.gapFrequency} learner{gap.gapFrequency > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">Avg Deficit:</span>
                      <Badge variant="critical">-{gap.avgGap}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Roles Distribution */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base font-serif">
              Target Career Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularRoles.map((role: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between text-xs"
              >
                <div className="font-semibold text-foreground">{role.roleTitle}</div>
                <Badge variant="outline">{role.learnerCount} Aspirants</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C2410C]" />
            Recent Organization Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No recent learner activities logged.
            </div>
          ) : (
            <div className="divide-y divide-border text-xs">
              {recentActivity.map((act: any) => (
                <div key={act.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{act.learnerName}</span>
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
  );
}
