import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  BookOpen,
  Search,
  ExternalLink,
  Clock,
  Globe,
  Star,
  CheckCircle,
  Filter,
  Play
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
      queryParams.set('limit', '50');

      const res = await apiClient<{ data: Course[] }>(`/courses?${queryParams.toString()}`);
      setCourses(res.data || []);
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

  const enrollCourse = async (courseId: string) => {
    try {
      await apiClient('/learning-paths/progress', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
          status: 'in_progress',
          progressPercent: 10
        })
      });
      alert('Enrolled! This course has been added to your Learning Path.');
    } catch (err: any) {
      console.warn('Enrollment error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
          Verified Learning Tracks
        </span>
        <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
          Curated Course Catalogue
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Over 50 zero-cost and industry-aligned tracks from Microsoft Learn, freeCodeCamp, NPTEL, and Google Cloud.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, skill (e.g. React, SQL, RAG), or provider..."
              className="w-full bg-secondary rounded-lg pl-9 pr-4 py-2 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
            />
          </div>
          <Button type="submit" size="sm" className="font-semibold px-4">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-secondary rounded-md px-2.5 py-1.5 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Language filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-secondary rounded-md px-2.5 py-1.5 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi / Hinglish</option>
            <option value="Bilingual">Bilingual</option>
          </select>

          {/* Free toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
              className="rounded accent-[#C2410C]"
            />
            <span>Free Only</span>
          </label>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-card border border-border" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-2 text-muted-foreground/60" />
          <p className="text-base font-semibold text-foreground">No courses found matching your criteria</p>
          <p className="text-xs mt-1">Try relaxing filters or searching for broader terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col justify-between hover:border-[#C2410C]/60 hover:shadow-md transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {course.provider}
                  </Badge>
                  {course.isFree && <Badge variant="success">100% Free</Badge>}
                </div>

                <CardTitle
                  onClick={() => setSelectedCourse(course)}
                  className="text-base font-serif line-clamp-2 cursor-pointer group-hover:text-[#C2410C] transition-colors"
                >
                  {course.title}
                </CardTitle>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Covered skills */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {course.skillsCovered.slice(0, 3).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-foreground/80 border border-border/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="pt-0 border-t border-border mt-3 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.estimatedHours} hrs
                  </span>
                  {course.rating && (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {course.rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="font-semibold text-foreground hover:text-[#C2410C]"
                  >
                    Details
                  </button>
                  <a
                    href={course.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md bg-[#C2410C]/10 text-[#C2410C] hover:bg-[#C2410C] hover:text-white transition-colors"
                    title="Open on provider website"
                  >
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
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse?.title || 'Course Overview'}
        className="max-w-2xl"
      >
        {selectedCourse && (
          <div className="space-y-5 text-xs text-foreground">
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-border">
              <Badge variant="outline">{selectedCourse.provider}</Badge>
              <Badge variant="neutral">{selectedCourse.difficulty}</Badge>
              <Badge variant="neutral">{selectedCourse.language}</Badge>
              {selectedCourse.isFree && <Badge variant="success">Free Track</Badge>}
              {selectedCourse.rating && (
                <span className="flex items-center gap-1 text-amber-600 font-bold ml-auto">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {selectedCourse.rating} ({selectedCourse.ratingSource || 'Verified Reviews'})
                </span>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1 text-foreground">Course Description</h4>
              <p className="text-muted-foreground leading-relaxed">{selectedCourse.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1.5 text-foreground">Target Skills Mastered</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCourse.skillsCovered.map((s, idx) => (
                  <Badge key={idx} variant="default">{s}</Badge>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
              <div>
                <span className="text-muted-foreground">Estimated Time Investment:</span>
                <span className="font-bold text-foreground ml-1">{selectedCourse.estimatedHours} hours</span>
              </div>
              <Button size="sm" onClick={() => enrollCourse(selectedCourse.id)} className="font-semibold">
                Add to My Learning Path
              </Button>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">Direct Provider Destination</span>
              <a
                href={selectedCourse.destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#C2410C] hover:underline text-sm"
              >
                <span>Go to course on {selectedCourse.provider}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
