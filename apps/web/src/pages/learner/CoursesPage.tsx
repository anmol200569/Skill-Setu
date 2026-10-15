import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  BookOpen,
  Search,
  ExternalLink,
  Clock,
  Filter,
  PlusCircle,
  CheckCircle2,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  provider: string;
  destinationUrl: string;
  skillsCovered: string[];
  difficulty: string;
  estimatedHours: number;
  language: string;
  isFree: boolean;
  rating?: number | null;
  ratingSource?: string | null;
  description: string;
}

export function CoursesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState(initialSkill);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(61);

  // Detail Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [difficultyFilter, languageFilter, freeOnly]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (difficultyFilter !== 'all') queryParams.set('difficulty', difficultyFilter);
      if (languageFilter !== 'all') queryParams.set('language', languageFilter);
      if (freeOnly) queryParams.set('isFree', 'true');
      queryParams.set('limit', '100');

      const res = await apiClient<{ data: Course[]; totalCount?: number }>(`/courses?${queryParams.toString()}`);
      setCourses(res.data || []);
      if (typeof res.totalCount === 'number') {
        setTotalCount(res.totalCount);
      }
    } catch (err: any) {
      console.warn('Failed to load courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const clearSearch = () => {
    setSearch('');
    searchParams.delete('skill');
    setSearchParams(searchParams);
    const queryParams = new URLSearchParams();
    if (difficultyFilter !== 'all') queryParams.set('difficulty', difficultyFilter);
    if (languageFilter !== 'all') queryParams.set('language', languageFilter);
    if (freeOnly) queryParams.set('isFree', 'true');
    queryParams.set('limit', '100');

    apiClient<{ data: Course[] }>(`/courses?${queryParams.toString()}`)
      .then((res) => setCourses(res.data || []))
      .catch(() => {});
  };

  const enrollCourse = async (courseId: string) => {
    try {
      await apiClient('/learning-paths/progress', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
          status: 'in_progress',
          progressPercent: 10,
          source: 'manual',
          reason: 'Added manually from course catalogue'
        })
      });

      apiClient('/learning-paths').catch(() => {});

      setToast({
        message: t('coursesPage.enrolledToast'),
        type: 'success'
      });
    } catch (err: any) {
      console.warn('Enrollment error:', err);
      setToast({
        message: err.message || 'Could not enroll in course. Please try again.',
        type: 'error'
      });
    }
  };

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
      <Breadcrumbs items={[{ label: t('nav.courses') }]} />

      {/* Header with Explicit "61 courses" count label */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t('coursesPage.curatedTracks', { defaultValue: 'Curated Learning Tracks' })}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <Badge variant="blue" className="text-xs font-semibold">
              {t('coursesPage.coursesCount', { count: totalCount })}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{t('coursesPage.title')}</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t('coursesPage.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-card space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('coursesPage.searchPlaceholder')}
              className="w-full bg-secondary rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            className="font-semibold px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-500/20"
          >
            {t('coursesPage.searchBtn')}
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('coursesPage.filters')}</span>
          </div>

          {/* Difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="Filter courses by difficulty level"
            className="bg-secondary text-foreground rounded-lg px-2.5 py-1.5 border border-border text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
          >
            <option value="all">{t('coursesPage.allDifficulties')}</option>
            <option value="Beginner">{t('coursesPage.diffBeginner')}</option>
            <option value="Intermediate">{t('coursesPage.diffIntermediate')}</option>
            <option value="Advanced">{t('coursesPage.diffAdvanced')}</option>
          </select>

          {/* Language filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="Filter courses by instructional language"
            className="bg-secondary text-foreground rounded-lg px-2.5 py-1.5 border border-border text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
          >
            <option value="all">{t('coursesPage.allLanguages')}</option>
            <option value="English">{t('coursesPage.langEnglish')}</option>
            <option value="Hindi">{t('coursesPage.langHindi')}</option>
            <option value="Bilingual">{t('coursesPage.langBilingual')}</option>
          </select>

          {/* Free Only Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground select-none">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>{t('coursesPage.freeOnly')}</span>
          </label>

          <span className="ml-auto text-muted-foreground tabular-nums">
            {t('coursesPage.showingCount', { count: courses.length, total: totalCount })}
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-64" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={t('coursesPage.emptyTitle')}
          description={t('coursesPage.emptyDesc')}
          primaryAction={{
            label: t('coursesPage.clearFilters'),
            onClick: clearSearch,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Card
              key={course.id}
              hoverEffect
              className="flex flex-col justify-between border border-border bg-card shadow-card group"
            >
              <CardHeader className="p-5 pb-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {course.provider}
                  </Badge>
                  {course.isFree && (
                    <Badge variant="strong" className="text-[10px]">
                      {t('coursesPage.freeBadge')}
                    </Badge>
                  )}
                </div>

                <div>
                  <CardTitle
                    onClick={() => setSelectedCourse(course)}
                    className="text-base font-extrabold text-foreground line-clamp-2 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {course.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Skills Covered Tags */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('coursesPage.skillsCovered')}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skillsCovered.slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-foreground/85 border border-border"
                      >
                        {sk}
                      </span>
                    ))}
                    {course.skillsCovered.length > 3 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        {t('coursesPage.moreSkills', { count: course.skillsCovered.length - 3 })}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 border-t border-border mt-3 pt-3 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {t('coursesPage.hoursUnit', { hours: course.estimatedHours })}
                  </span>
                  <span className="capitalize">{course.difficulty}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => enrollCourse(course.id)}
                    className="text-xs flex-1 flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('coursesPage.enrollBtn')}</span>
                  </Button>

                  <a
                    href={course.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-muted transition-colors"
                  >
                    <span>{t('coursesPage.launch')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <Modal
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse?.title || t('coursesPage.courseDetails')}
        className="max-w-xl"
      >
        {selectedCourse && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
              <Badge variant="outline">{selectedCourse.provider}</Badge>
              <span className="text-muted-foreground">
                {selectedCourse.estimatedHours} hrs • {selectedCourse.difficulty} • {selectedCourse.language}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">{t('coursesPage.overview')}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">{t('coursesPage.competenciesCovered')}</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCourse.skillsCovered.map((sk) => (
                  <span
                    key={sk}
                    className="text-[11px] font-mono bg-secondary px-2.5 py-1 rounded-md text-foreground border border-border"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => enrollCourse(selectedCourse.id)}
                className="flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('coursesPage.enrollBtn')}</span>
              </Button>
              <a
                href={selectedCourse.destinationUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm shadow-blue-500/20">
                  <span>{t('coursesPage.launch')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default CoursesPage;
