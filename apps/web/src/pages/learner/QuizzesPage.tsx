import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  Sparkles,
  Upload,
  FileText,
  FileCheck,
  Download,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { stripInactivePrefix } from '@skill-setu/shared';

interface QuizItem {
  id: string;
  title: string;
  description: string;
  creatorEmail: string;
  sourceType: string;
  questionCount: number;
  attemptCount: number;
  difficulty: string;
  language: string;
  createdAt: string;
}

interface Question {
  id: string;
  questionText: string;
  type: string;
  difficulty: string;
  options: { id: string; text: string }[];
  explanation?: string;
  correctAnswers?: string[];
  topicTag: string;
}

export function QuizzesPage() {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'upload' | 'paste' | 'topic'>('upload');
  const [title, setTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedPreview, setExtractedPreview] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [allowedTypes, setAllowedTypes] = useState<('single_mcq' | 'multi_mcq' | 'true_false')[]>([
    'single_mcq',
    'true_false'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Attempt State
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<string, string[]>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any | null>(null);
  const [isAttemptModalOpen, setIsAttemptModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient<QuizItem[]>('/quizzes');
      setQuizzes(data || []);
    } catch (err: any) {
      console.warn('Could not load quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setErrorMsg(null);

    // Enforce client-side max size below Vercel serverless request limit (4 MB)
    const MAX_CLIENT_SIZE_BYTES = 4 * 1024 * 1024;
    if (file.size > MAX_CLIENT_SIZE_BYTES) {
      setUploadedFile(null);
      setExtractedPreview('');
      setErrorMsg('File size exceeds the 4 MB upload limit. Please upload a document smaller than 4 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsExtracting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient<{ extractedText: string; preview: string }>('/quizzes/upload', {
        method: 'POST',
        body: formData
      });
      // Show chip with 'Text extracted' ONLY after extraction really succeeded
      setUploadedFile(file);
      setPastedText(res.extractedText);
      setExtractedPreview(res.preview);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') + ' Quiz');
      }
    } catch (err: any) {
      // Ensure file chip is cleared on extraction error
      setUploadedFile(null);
      setExtractedPreview('');
      setErrorMsg(err.message || 'Failed to extract text from document');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a quiz title.');
      return;
    }
    if (!pastedText.trim() || pastedText.length < 20) {
      setErrorMsg('Please provide study material text or upload a document (at least 20 characters).');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      await apiClient('/quizzes/generate', {
        method: 'POST',
        body: JSON.stringify({
          title,
          topicOrText: pastedText,
          questionCount: Number(questionCount),
          difficulty,
          language,
          allowedTypes,
          sourceType: creationMode === 'upload' ? 'uploaded_document' : 'pasted_text',
          sourceFilename: uploadedFile?.name
        })
      });

      confetti({ particleCount: 70, spread: 60 });
      setIsCreateModalOpen(false);
      resetForm();
      await loadQuizzes();
    } catch (err: any) {
      const msg = err.message || 'Quiz generation failed.';
      if (
        msg.toLowerCase().includes('busy') ||
        msg.toLowerCase().includes('503') ||
        msg.toLowerCase().includes('unavailable') ||
        msg.toLowerCase().includes('quota') ||
        msg.toLowerCase().includes('serviceunavailable')
      ) {
        setErrorMsg('The AI quiz service is busy right now. Try again in a few minutes.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPastedText('');
    setUploadedFile(null);
    setExtractedPreview('');
    setErrorMsg(null);
  };

  const startQuiz = async (quiz: QuizItem) => {
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setUserSelections({});
    setTimeSpent(0);
    setAttemptResult(null);
    setIsAttemptModalOpen(true);

    try {
      const full = await apiClient<any>(`/quizzes/${quiz.id}`);
      setQuizQuestions(full.questions || []);
    } catch (err: any) {
      console.warn('Could not load quiz questions:', err);
    }
  };

  const toggleAnswer = (questionId: string, optionId: string, type: string) => {
    if (type === 'multi_mcq') {
      const current = userSelections[questionId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setUserSelections({ ...userSelections, [questionId]: updated });
    } else {
      setUserSelections({ ...userSelections, [questionId]: [optionId] });
    }
  };

  const submitQuizAnswers = async () => {
    if (!activeQuiz) return;
    setIsSubmittingAttempt(true);

    const answersPayload = quizQuestions.map((q) => ({
      questionId: q.id,
      selectedOptions: userSelections[q.id] || []
    }));

    try {
      const result = await apiClient('/quizzes/submit', {
        method: 'POST',
        body: JSON.stringify({
          quizId: activeQuiz.id,
          timeSpentSeconds: timeSpent,
          answers: answersPayload
        })
      });

      setAttemptResult(result);
      confetti({ particleCount: 100, spread: 70 });
      loadQuizzes();
    } catch (err: any) {
      console.warn('Quiz submission error:', err);
    } finally {
      setIsSubmittingAttempt(false);
    }
  };

  const exportPdf = async (quizId: string) => {
    try {
      const blob = await apiClient<Blob>(`/quizzes/${quizId}/export-pdf`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Skill_Setu_Quiz_${quizId.slice(0, 6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert('Could not download PDF: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            AI Assessment Generator
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
            Study Quizzes & Exam Simulator
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate customized diagnostic quizzes from your PDFs, lecture decks, or study material using Gemini AI.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-4 h-4" />
          Create New AI Quiz
        </Button>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-card rounded-xl border border-border" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border text-muted-foreground space-y-3">
          <FileCheck className="w-12 h-12 text-[#C2410C] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-foreground">No quizzes generated yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Upload your first lecture PDF, slide deck, or paste notes to generate an interactive practice quiz.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
            Generate Your First Quiz
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col justify-between hover:border-[#C2410C]/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {quiz.difficulty}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {quiz.questionCount} Questions
                  </span>
                </div>
                <CardTitle className="text-base font-serif line-clamp-2">{quiz.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{quiz.description}</p>
              </CardHeader>

              <CardContent className="pt-0 border-t border-border mt-3 pt-3 flex items-center justify-between">
                <button
                  onClick={() => exportPdf(quiz.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  title="Download printable PDF quiz with answer key"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Export</span>
                </button>

                <Button size="sm" onClick={() => startQuiz(quiz)} className="flex items-center gap-1 text-xs">
                  <Play className="w-3.5 h-3.5" />
                  <span>Attempt Quiz</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Quiz Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate AI Quiz from Study Material"
        className="max-w-2xl"
      >
        <div className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
              {!errorMsg.toLowerCase().includes('few minutes') && (errorMsg.toLowerCase().includes('busy') || errorMsg.toLowerCase().includes('service') || errorMsg.toLowerCase().includes('unavailable')) && (
                <p className="text-[11px] text-muted-foreground pl-6">
                  Try again in a few minutes.
                </p>
              )}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex border-b border-border pb-2 gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCreationMode('upload')}
              className={`pb-1 ${creationMode === 'upload' ? 'text-[#C2410C] border-b-2 border-[#C2410C]' : 'text-muted-foreground'}`}
            >
              Upload File (PDF / PPTX / DOCX / TXT)
            </button>
            <button
              type="button"
              onClick={() => setCreationMode('paste')}
              className={`pb-1 ${creationMode === 'paste' ? 'text-[#C2410C] border-b-2 border-[#C2410C]' : 'text-muted-foreground'}`}
            >
              Paste Notes / Text
            </button>
          </div>

          <Input
            label="Quiz Title"
            placeholder="e.g. Distributed Database & Consensus Quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {creationMode === 'upload' ? (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-foreground/80">Study Material File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-secondary/40 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.pptx,.txt,.ppt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C2410C]" />
                    <span>Extracting text content from file...</span>
                  </div>
                ) : uploadedFile ? (
                  <div className="flex flex-col items-center gap-1.5 text-xs text-green-600">
                    <FileCheck className="w-8 h-8" />
                    <span className="font-semibold text-foreground">{uploadedFile.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Text extracted
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
                    <Upload className="w-8 h-8 text-[#C2410C]/80" />
                    <span className="font-semibold text-foreground">Click to upload study material</span>
                    <span>Supports PDF, DOCX, PPTX, TXT (up to 4 MB)</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{t('quiz.securityNotice', 'Do not upload passwords, API keys or private data.')}</span>
              </div>
              {extractedPreview && (
                <p className="text-[11px] text-muted-foreground italic truncate">
                  Preview: {extractedPreview}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground/80">Paste Learning Material</label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste lecture excerpts, technical summaries, documentation, or study notes..."
                className="w-full bg-secondary rounded-lg p-3 text-xs border border-border focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
              />
            </div>
          )}

          {/* Configuration Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-foreground/80 mb-1">Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full bg-secondary rounded-md p-2 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
              >
                <option value="3">3 Questions</option>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground/80 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-secondary rounded-md p-2 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground/80 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-secondary rounded-md p-2 text-xs border border-border focus:ring-1 focus:ring-[#C2410C]"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              isLoading={isGenerating}
              className="font-semibold shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate Quiz with Gemini
            </Button>
          </div>
        </div>
      </Modal>

      {/* Attempt Quiz Modal */}
      <Modal
        isOpen={isAttemptModalOpen}
        onClose={() => setIsAttemptModalOpen(false)}
        title={activeQuiz?.title || 'Quiz Attempt'}
        className="max-w-2xl"
      >
        {quizQuestions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#C2410C] mx-auto" />
            <p>Loading quiz questions...</p>
          </div>
        ) : attemptResult ? (
          /* Result View with Weak Topics */
          <div className="space-y-6 py-2">
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border text-center space-y-2">
              <h3 className="text-2xl font-serif font-bold text-foreground">
                Quiz Evaluation Result
              </h3>
              <div className="text-4xl font-serif font-bold text-[#C2410C] py-1">
                {attemptResult.scorePercentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                Answered <strong className="text-foreground">{attemptResult.correctAnswersCount}</strong> out of <strong className="text-foreground">{attemptResult.totalQuestions}</strong> questions correctly.
              </p>
            </div>

            {/* Weak Topics Feedback */}
            {attemptResult.weakTopics?.length > 0 && (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs">
                <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Identified Weak Topics to Review
                </div>
                {attemptResult.weakTopics.map((wt: any, idx: number) => (
                  <div key={idx} className="pl-5 border-l-2 border-amber-500/50 py-1">
                    <div className="font-semibold text-foreground">{wt.topic} ({wt.incorrectCount} incorrect)</div>
                    <p className="text-muted-foreground mt-0.5">{wt.reviewRecommendation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Answers breakdown */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {attemptResult.answers?.map((ans: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                    ans.isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <span>Q{idx + 1}: {ans.isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </div>
                  {ans.questionText && (
                    <p className="text-foreground/90 font-medium pl-6">{stripInactivePrefix(ans.questionText)}</p>
                  )}
                  <p className="text-muted-foreground pl-6">{ans.explanation}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => exportPdf(activeQuiz.id)}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Export Quiz PDF
              </Button>
              <Button onClick={() => setIsAttemptModalOpen(false)} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Question View */
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2">
              <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
              <span className="font-mono text-[10px] bg-secondary px-2 py-0.5 rounded">
                {quizQuestions[currentIdx].topicTag}
              </span>
            </div>

            <div className="text-sm font-semibold text-foreground leading-relaxed">
              {stripInactivePrefix(quizQuestions[currentIdx].questionText)}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {quizQuestions[currentIdx].options.map((opt) => {
                const isSelected = (userSelections[quizQuestions[currentIdx].id] || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      toggleAnswer(
                        quizQuestions[currentIdx].id,
                        opt.id,
                        quizQuestions[currentIdx].type
                      )
                    }
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#C2410C] bg-[#C2410C]/10 text-foreground ring-1 ring-[#C2410C]'
                        : 'border-border bg-card text-foreground/80 hover:bg-secondary/60'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#C2410C] border-[#C2410C] text-white' : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              {currentIdx < quizQuestions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={submitQuizAnswers}
                  isLoading={isSubmittingAttempt}
                  className="font-semibold shadow-md"
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
