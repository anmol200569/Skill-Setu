import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Trash2, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export function QuizManagerPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient<any[]>('/quizzes?publishedOnly=false');
      setQuizzes(data || []);
    } catch (err: any) {
      console.warn('Failed to load quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (quiz: any) => {
    try {
      await apiClient(`/quizzes/${quiz.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished: !quiz.isPublished })
      });
      await loadQuizzes();
    } catch (err: any) {
      alert('Could not update status: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await apiClient(`/quizzes/${id}`, { method: 'DELETE' });
      await loadQuizzes();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Assessment Studio
        </span>
        <h1 className="text-3xl font-bold text-foreground mt-1 tracking-tight">
          Quiz Governance & Publishing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, publish, and moderate AI-generated quizzes across the organization.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border">
            <tr>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Creator</th>
              <th className="p-3.5">Questions</th>
              <th className="p-3.5">Attempts</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Loading quizzes...
                </td>
              </tr>
            ) : quizzes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No quizzes generated yet.
                </td>
              </tr>
            ) : (
              quizzes.map((q) => (
                <tr key={q.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3.5 font-medium text-foreground max-w-xs truncate">
                    {q.title}
                  </td>
                  <td className="p-3.5 text-muted-foreground">{q.creatorEmail}</td>
                  <td className="p-3.5">{q.questionCount}</td>
                  <td className="p-3.5">{q.attemptCount || 0}</td>
                  <td className="p-3.5">
                    <Badge variant={q.isPublished ? 'success' : 'neutral'}>
                      {q.isPublished ? 'Published' : 'Draft / Hidden'}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => togglePublish(q)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      title={q.isPublished ? 'Hide from learners' : 'Publish for learners'}
                    >
                      {q.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-600"
                      title="Delete quiz"
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
    </div>
  );
}
