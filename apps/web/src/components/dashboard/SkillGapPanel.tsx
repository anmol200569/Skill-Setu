import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  FileText,
  Target,
  ArrowRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { GapItem } from '../../pages/learner/DashboardPage';
import { cn } from '../../lib/utils';

export interface SkillGapPanelProps {
  gaps: GapItem[];
  title?: string;
  description?: string;
  initialFilter?: 'all' | 'needsImprovement' | 'strong' | 'notAssessed';
  className?: string;
}

export function SkillGapPanel({
  gaps,
  title,
  description,
  initialFilter = 'all',
  className,
}: SkillGapPanelProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'needsImprovement' | 'strong' | 'notAssessed'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Compute status & priority score for each item
  const enrichedGaps = useMemo(() => {
    return gaps.map((gap) => {
      const isAssessed = gap.isAssessed !== false && gap.currentLevel !== null && gap.currentLevel !== undefined;
      const current = isAssessed ? (gap.currentLevel as number) : 0;
      const required = gap.requiredLevel;
      const weight = gap.weight ?? 1.0;
      const gapSize = isAssessed ? Math.max(0, required - current) : 0;
      const priorityScore = weight * gapSize;

      let status: 'strong' | 'needsImprovement' | 'notAssessed';
      if (!isAssessed) {
        status = 'notAssessed';
      } else if (current >= required) {
        status = 'strong';
      } else {
        status = 'needsImprovement';
      }

      return {
        ...gap,
        isAssessed,
        current,
        required,
        weight,
        gapSize,
        priorityScore,
        status,
      };
    });
  }, [gaps]);

  // Default sort: priority (role weight * gap size) descending, then alphabetical
  const filteredAndSortedGaps = useMemo(() => {
    let list = enrichedGaps;

    // Filter by tab
    if (filter === 'needsImprovement') {
      list = list.filter((g) => g.status === 'needsImprovement');
    } else if (filter === 'strong') {
      list = list.filter((g) => g.status === 'strong');
    } else if (filter === 'notAssessed') {
      list = list.filter((g) => g.status === 'notAssessed');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.skillName.toLowerCase().includes(q) ||
          (g.domainName && g.domainName.toLowerCase().includes(q))
      );
    }

    // Sort by priorityScore descending, then deficit descending, then name
    return [...list].sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      if (b.gapSize !== a.gapSize) {
        return b.gapSize - a.gapSize;
      }
      return a.skillName.localeCompare(b.skillName);
    });
  }, [enrichedGaps, filter, searchQuery]);

  const toggleExpand = (skillId: string) => {
    setExpandedSkillId((prev) => (prev === skillId ? null : skillId));
  };

  const panelTitle = title || t('dashboard.skillGapPanel.title');
  const panelDescription = description || t('dashboard.skillGapPanel.description');

  return (
    <Card className={cn('border border-border shadow-card bg-card', className)}>
      <CardHeader className="space-y-4 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C2410C] dark:text-[#FB923C]" />
              <CardTitle>{panelTitle}</CardTitle>
            </div>
            <CardDescription className="mt-1">{panelDescription}</CardDescription>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground self-start sm:self-auto font-medium">
            <span>Sorted by:</span>
            <span className="font-semibold text-foreground bg-secondary px-2 py-0.5 rounded border border-border">
              Priority (Weight × Gap)
            </span>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Status Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter skills by status"
            className="inline-flex items-center p-1 rounded-xl bg-secondary border border-border text-xs font-medium overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              onClick={() => setFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C]',
                filter === 'all'
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('dashboard.skillGapPanel.filterAll')} ({enrichedGaps.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'needsImprovement'}
              onClick={() => setFilter('needsImprovement')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C]',
                filter === 'needsImprovement'
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('dashboard.skillGapPanel.filterNeedsImprovement')} (
              {enrichedGaps.filter((g) => g.status === 'needsImprovement').length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'strong'}
              onClick={() => setFilter('strong')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C]',
                filter === 'strong'
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('dashboard.skillGapPanel.filterStrong')} (
              {enrichedGaps.filter((g) => g.status === 'strong').length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'notAssessed'}
              onClick={() => setFilter('notAssessed')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C]',
                filter === 'notAssessed'
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('dashboard.skillGapPanel.filterNotAssessed')} (
              {enrichedGaps.filter((g) => g.status === 'notAssessed').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.skillGapPanel.searchPlaceholder')}
              aria-label={t('dashboard.skillGapPanel.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2410C]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredAndSortedGaps.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
            <p>No competencies match the current filter or search criteria.</p>
            <Button variant="ghost" size="sm" onClick={() => { setFilter('all'); setSearchQuery(''); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAndSortedGaps.map((item) => {
              const isExpanded = expandedSkillId === item.skillId;

              return (
                <div
                  key={item.skillId}
                  className={cn(
                    'transition-colors',
                    isExpanded ? 'bg-secondary/30' : 'hover:bg-muted/30'
                  )}
                >
                  {/* Skill Row Summary (Clickable) */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`skill-details-${item.skillId}`}
                    onClick={() => toggleExpand(item.skillId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(item.skillId);
                      }
                    }}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
                  >
                    {/* Left: Skill Name & Importance */}
                    <div className="sm:w-1/3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm sm:text-base text-foreground">
                          {item.skillName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.domainName || 'Core Area'}</span>
                        <span>•</span>
                        <span className="tabular-nums font-medium text-foreground">
                          Weight: {item.weight.toFixed(1)}x
                        </span>
                      </div>
                    </div>

                    {/* Middle: Achieved vs Target Bar with Target Marker */}
                    <div className="sm:w-1/3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Achieved: {item.isAssessed ? `${item.current.toFixed(1)} / 5` : 'Not Assessed'}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          Target: {item.required.toFixed(1)} / 5
                        </span>
                      </div>
                      <ProgressBar
                        value={item.current}
                        max={5}
                        target={item.required}
                        size="md"
                        variant={
                          item.status === 'strong'
                            ? 'strong'
                            : item.status === 'needsImprovement'
                            ? 'needsImprovement'
                            : 'neutral'
                        }
                      />
                    </div>

                    {/* Right: Gap Size & Status Badge + Chevron */}
                    <div className="sm:w-1/4 flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-semibold tabular-nums">
                          {item.isAssessed ? (
                            item.gapSize > 0 ? (
                              <span className="text-amber-600 dark:text-amber-400">
                                -{item.gapSize.toFixed(1)} gap
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Meets Target
                              </span>
                            )
                          ) : (
                            <span className="text-slate-500">Unassessed</span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge with Icon & Text Label */}
                      <div>
                        {item.status === 'strong' ? (
                          <Badge variant="strong" icon={CheckCircle2}>
                            {t('common.strong')}
                          </Badge>
                        ) : item.status === 'needsImprovement' ? (
                          <Badge variant="needsImprovement" icon={AlertTriangle}>
                            {t('common.needsImprovement')}
                          </Badge>
                        ) : (
                          <Badge variant="notAssessed" icon={HelpCircle}>
                            {t('common.notAssessed')}
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground p-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div
                      id={`skill-details-${item.skillId}`}
                      className="px-4 sm:px-6 py-5 bg-card/90 border-t border-border space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Topics inside this skill */}
                        <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#C2410C]" />
                            <span>{t('common.topicsCovered')}</span>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            Practical application, design tradeoffs, optimization techniques, and error handling for{' '}
                            <strong>{item.skillName}</strong>.
                          </p>
                        </div>

                        {/* 2. Evidence (which assessments it came from) */}
                        <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#C2410C]" />
                            <span>{t('common.evidence')}</span>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            {item.isAssessed
                              ? `Derived from Diagnostic Evaluation score (${item.current.toFixed(1)}/5) calibrated against standard rubrics.`
                              : 'No assessment taken yet. Baseline level currently pending diagnostic verification.'}
                          </p>
                        </div>

                        {/* 3. Why this is shown & Action */}
                        <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#C2410C]" />
                            <span>{t('common.whyShown')}</span>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            {item.gapSize > 0
                              ? `Role requires Level ${item.required.toFixed(1)} with high priority (${(item.weight * item.gapSize).toFixed(1)} score impact).`
                              : `Requirement satisfied for target role (${item.required.toFixed(1)} required, achieved ${item.current.toFixed(1)}).`}
                          </p>
                        </div>
                      </div>

                      {/* Mapped Action Button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-muted-foreground">
                          {item.status === 'notAssessed'
                            ? 'Take the 10-minute diagnostic assessment to measure your baseline.'
                            : item.gapSize > 0
                            ? `Recommended courses and hands-on modules available to close this -${item.gapSize.toFixed(1)} gap.`
                            : 'Skill verified. Practice quiz available to maintain proficiency.'}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === 'notAssessed' ? (
                            <Link to={`/assessments?skill=${encodeURIComponent(item.skillId)}`}>
                              <Button size="sm" className="bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs">
                                <Target className="w-3.5 h-3.5 mr-1" />
                                <span>Take Diagnostic</span>
                              </Button>
                            </Link>
                          ) : item.gapSize > 0 ? (
                            <Link to={`/courses?skill=${encodeURIComponent(item.skillId)}`}>
                              <Button size="sm" className="bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{t('common.closeGap')}</span>
                                <ArrowRight className="w-3 h-3 ml-0.5" />
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/quizzes?skill=${encodeURIComponent(item.skillId)}`}>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#C2410C]" />
                                <span>Practice Quiz</span>
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
