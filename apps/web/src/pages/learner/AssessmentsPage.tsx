import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  Target,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  domain?: { name: string };
}

interface Question {
  id: string;
  skillId: string;
  questionText: string;
  type: string;
  difficulty: string;
  options: { id: string; text: string }[];
  explanation: string;
}

export function AssessmentsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Assessment State
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient<Skill[]>('/competency/skills'),
      apiClient<any>('/profile'),
      apiClient<any[]>('/assessment/history')
    ])
      .then(([skillsData, profileData, historyData]) => {
        setSkills(skillsData || []);
        setUserSkills(profileData?.userSkills || []);
        setHistory(historyData || []);
      })
      .catch((err) => console.warn('Could not load assessments:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const startAssessment = async (skill: Skill) => {
    setActiveSkill(skill);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setAssessmentResult(null);
    setIsModalOpen(true);

    try {
      const q = await apiClient<Question[]>(`/assessment/questions/${skill.id}`);
      setQuestions(q || []);
    } catch (err: any) {
      console.warn('Could not load questions:', err);
    }
  };

  const toggleOption = (questionId: string, optionId: string, type: string) => {
    if (type === 'multi_mcq') {
      const current = selectedAnswers[questionId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setSelectedAnswers({ ...selectedAnswers, [questionId]: updated });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: [optionId] });
    }
  };

  const submitTest = async () => {
    if (!activeSkill) return;
    setIsSubmitting(true);

    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedOptions: selectedAnswers[q.id] || []
    }));

    try {
      const result = await apiClient('/assessment/submit', {
        method: 'POST',
        body: JSON.stringify({
          skillId: activeSkill.id,
          answers: answersPayload
        })
      });

      setAssessmentResult(result);
      confetti({ particleCount: 80, spread: 60 });

      // Refresh history & profile skills
      apiClient<any[]>('/assessment/history').then((data) => setHistory(data || []));
      apiClient<any>('/profile').then((data) => setUserSkills(data?.userSkills || []));
    } catch (err: any) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const domains = Array.from(new Set(skills.map((s) => s.domain?.name).filter(Boolean)));

  const filteredSkills = skills.filter((s) =>
    selectedDomain === 'all' ? true : s.domain?.name === selectedDomain
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
          Practical Competency Verification
        </span>
        <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
          Diagnostic Assessments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Take targeted question sets to establish verified proficiency scores (1 to 5 scale).
        </p>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => setSelectedDomain('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedDomain === 'all'
              ? 'bg-[#C2410C] text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          All Domains
        </button>
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom as string)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedDomain === dom
                ? 'bg-[#C2410C] text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((skill) => {
          const userSkill = userSkills.find((us) => us.skillId === skill.id);
          const hasVerified = userSkill?.verifiedScore !== null && userSkill?.verifiedScore !== undefined;

          return (
            <Card key={skill.id} className="flex flex-col justify-between hover:border-[#C2410C]/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px]">
                    {skill.domain?.name || skill.category}
                  </Badge>
                  {hasVerified ? (
                    <Badge variant="success">Verified {userSkill.verifiedScore}/5</Badge>
                  ) : (
                    <Badge variant="neutral">Self: {userSkill?.selfAssessedLevel || 1}/5</Badge>
                  )}
                </div>
                <CardTitle className="text-base font-serif">{skill.name}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{skill.description}</p>
              </CardHeader>

              <CardContent className="pt-0 border-t border-border mt-3 flex items-center justify-between pt-3">
                <div className="text-xs text-muted-foreground">
                  Effective: <strong className="text-foreground">{userSkill?.effectiveScore || userSkill?.selfAssessedLevel || 1}/5</strong>
                </div>
                <Button
                  size="sm"
                  variant={hasVerified ? 'outline' : 'primary'}
                  onClick={() => startAssessment(skill)}
                  className="text-xs"
                >
                  {hasVerified ? 'Re-assess' : 'Start Diagnostic'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Assessment History */}
      {history.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C2410C]" />
              Recent Diagnostic Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border text-xs">
              {history.slice(0, 5).map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{att.skillName}</span>
                    <span className="text-muted-foreground ml-2">
                      ({att.correctQuestions}/{att.totalQuestions} correct)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{Math.round(att.score)}%</span>
                    <Badge variant="success">Level {att.assessedLevel}/5</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnostic Player Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeSkill ? `Diagnostic: ${activeSkill.name}` : 'Assessment'}
        className="max-w-2xl"
      >
        {questions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#C2410C] mx-auto" />
            <p>Loading curated diagnostic questions...</p>
          </div>
        ) : assessmentResult ? (
          /* Result View */
          <div className="space-y-6 py-2">
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border text-center space-y-2">
              <Award className="w-12 h-12 text-[#C2410C] mx-auto" />
              <h3 className="text-2xl font-serif font-bold text-foreground">
                Diagnostic Complete!
              </h3>
              <p className="text-sm text-muted-foreground">
                You scored <strong className="text-foreground">{assessmentResult.scorePercentage}%</strong> ({assessmentResult.correctQuestions}/{assessmentResult.totalQuestions} questions correct)
              </p>
              <div className="pt-2">
                <Badge variant="success" className="text-sm px-4 py-1 font-semibold">
                  Assessed Proficiency: Level {assessmentResult.assessedLevel} of 5
                </Badge>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {assessmentResult.evaluatedAnswers?.map((ans: any, idx: number) => (
                <div
                  key={ans.questionId}
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
                    <span>Question {idx + 1}: {ans.isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </div>
                  <p className="text-muted-foreground pl-6">{ans.explanation}</p>
                </div>
              ))}
            </div>

            <Button onClick={() => setIsModalOpen(false)} className="w-full">
              Close & Update Skill Dashboard
            </Button>
          </div>
        ) : (
          /* Question View */
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span className="capitalize">{questions[currentQuestionIdx].difficulty}</span>
            </div>

            <div className="text-sm font-semibold text-foreground leading-relaxed">
              {questions[currentQuestionIdx].questionText}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {questions[currentQuestionIdx].options.map((opt) => {
                const isSelected = (selectedAnswers[questions[currentQuestionIdx].id] || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      toggleOption(
                        questions[currentQuestionIdx].id,
                        opt.id,
                        questions[currentQuestionIdx].type
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
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              {currentQuestionIdx < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={submitTest}
                  isLoading={isSubmitting}
                  className="font-semibold shadow-md"
                >
                  Submit Assessment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
