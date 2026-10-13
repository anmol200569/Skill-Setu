import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Plus, Trash2, ExternalLink, GraduationCap, Search } from 'lucide-react';

export function CourseManagerPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Course form
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('freeCodeCamp');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [skillsCovered, setSkillsCovered] = useState('react, ts-js');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [estimatedHours, setEstimatedHours] = useState(15);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<{ data: any[] }>('/courses?limit=100');
      setCourses(res.data || []);
    } catch (err: any) {
      console.warn('Could not load courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destinationUrl) return;

    try {
      await apiClient('/courses', {
        method: 'POST',
        body: JSON.stringify({
          title,
          provider,
          destinationUrl,
          skillsCovered: skillsCovered.split(',').map((s) => s.trim()),
          difficulty,
          estimatedHours: Number(estimatedHours),
          language: 'English',
          isFree: true,
          description
        })
      });

      setIsModalOpen(false);
      setTitle('');
      setDestinationUrl('');
      setDescription('');
      await loadCourses();
    } catch (err: any) {
      alert('Failed to add course: ' + err.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to remove this course?')) return;
    try {
      await apiClient(`/courses/${id}`, { method: 'DELETE' });
      await loadCourses();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            Content Management
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
            Course Catalogue Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage verified learning materials from freeCodeCamp, Microsoft Learn, NPTEL, and Google Cloud.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 font-semibold">
          <Plus className="w-4 h-4" />
          Add Learning Track
        </Button>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter courses..."
            className="w-full bg-secondary rounded-lg pl-9 pr-3 py-2 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Total Tracks: {courses.length}
        </span>
      </div>

      {/* Courses Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border">
            <tr>
              <th className="p-3.5">Course Title</th>
              <th className="p-3.5">Provider</th>
              <th className="p-3.5">Difficulty</th>
              <th className="p-3.5">Hours</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading courses...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No courses found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((course) => (
                <tr key={course.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3.5 font-medium text-foreground max-w-xs truncate">
                    {course.title}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="outline">{course.provider}</Badge>
                  </td>
                  <td className="p-3.5">{course.difficulty}</td>
                  <td className="p-3.5">{course.estimatedHours} hrs</td>
                  <td className="p-3.5 text-right space-x-2">
                    <a
                      href={course.destinationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="inline-flex p-1.5 rounded hover:bg-red-500/10 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Learning Track"
        className="max-w-md"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4 py-2">
          <Input
            label="Course Title"
            placeholder="e.g. System Design Primer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Provider Name"
            placeholder="e.g. Microsoft Learn, freeCodeCamp"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
          <Input
            label="Destination URL"
            placeholder="https://..."
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
          />
          <Input
            label="Skills Covered (comma-separated codes)"
            placeholder="react, ts-js, nodejs"
            value={skillsCovered}
            onChange={(e) => setSkillsCovered(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground/80">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-secondary rounded-lg p-2 text-xs border border-border"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <Input
                label="Estimated Hours"
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value, 10) || 10)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/80">Short Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary rounded-lg p-2 text-xs border border-border"
            />
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
