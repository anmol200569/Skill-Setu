import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import {
  Route,
  Clock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Award
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
  };
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercent: number;
  reason: string;
}

export function LearningPathPage() {
  const { t } = useTranslation();
  const [learningPath, setLearningPath] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

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
        confetti({ particleCount: 70, spread: 60 });
      }

      await loadLearningPath();
    } catch (err: any) {
      console.warn('Could not update status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-card rounded-2xl border border-border" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  const courses: PathItem[] = learningPath?.courses || [];
  const completedCount = courses.filter((c) => c.status === 'completed').length;
  const overallPercent = courses.length > 0 ? Math.round((completedCount / courses.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs">
              Personalized Learning Path
            </Badge>
            <span className="text-xs text-muted-foreground">
              Total {learningPath?.totalEstimatedHours || 0} Hours
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Roadmap to {learningPath?.targetRoleTitle || 'Target Career'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Sequential course recommendations prioritized by your diagnostic skill gap scores.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto">
          <div className="text-right w-full sm:w-auto">
            <div className="text-xs text-muted-foreground">Path Completion</div>
            <div className="text-2xl font-serif font-bold text-[#C2410C]">
              {overallPercent}% ({completedCount}/{courses.length})
            </div>
            <div className="w-32 mt-1">
              <Progress value={overallPercent} />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={isRegenerating}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Recalibrate</span>
          </Button>
        </div>
      </div>

      {/* Sequential Roadmap Steps or Real Empty State */}
      {courses.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mx-auto">
              <Route className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-foreground">
                {t('learningPath.emptyTitle', { defaultValue: 'Take your first diagnostic to unlock your roadmap' })}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('learningPath.emptySubtitle', {
                  defaultValue: 'Complete diagnostic assessments in your target skills to personalize your milestone roadmap and track progress.'
                })}
              </p>
            </div>
            <div className="pt-2">
              <Link to="/assessments">
                <Button className="shadow-sm">
                  <Award className="w-4 h-4 mr-1.5" />
                  {t('learningPath.startDiagnostic', { defaultValue: 'Start Diagnostic' })}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
          {courses.map((item, idx) => {
            const isDone = item.status === 'completed';
            const isInProgress = item.status === 'in_progress';

            return (
              <div key={item.courseId} className="relative group">
                {/* Step indicator node */}
                <div
                  className={`absolute -left-[30px] sm:-left-[38px] top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-green-600 border-green-600 text-white'
                      : isInProgress
                      ? 'bg-[#C2410C] border-[#C2410C] text-white animate-pulse'
                      : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                </div>

                {/* Course Card */}
                <Card className="hover:border-[#C2410C]/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                          Step {item.step}
                        </span>
                        <Badge variant="outline">{item.course.provider}</Badge>
                        <Badge variant={isDone ? 'success' : isInProgress ? 'high' : 'neutral'}>
                          {isDone ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.course.estimatedHours} hours</span>
                      </div>
                    </div>

                    <CardTitle className="text-base font-serif mt-1">
                      {item.course.title}
                    </CardTitle>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      <strong className="text-foreground">Why Recommended:</strong> {item.reason}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 border-t border-border mt-3 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <button
                        onClick={() => updateStatus(item.courseId, 'not_started')}
                        className={`px-2.5 py-1 rounded border text-[11px] font-medium ${
                          item.status === 'not_started' ? 'bg-secondary font-bold' : 'hover:bg-muted'
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => updateStatus(item.courseId, 'in_progress')}
                        className={`px-2.5 py-1 rounded border text-[11px] font-medium ${
                          item.status === 'in_progress' ? 'bg-orange-500/10 text-orange-600 font-bold border-orange-500/20' : 'hover:bg-muted'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(item.courseId, 'completed')}
                        className={`px-2.5 py-1 rounded border text-[11px] font-medium ${
                          item.status === 'completed' ? 'bg-green-500/10 text-green-600 font-bold border-green-500/20' : 'hover:bg-muted'
                        }`}
                      >
                        Completed
                      </button>
                    </div>

                    {/* Provider Action */}
                    <a
                      href={item.course.destinationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#C2410C] hover:underline self-end sm:self-auto"
                    >
                      <span>Launch Course on {item.course.provider}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
