import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { stripInactivePrefix } from '@skill-setu/shared';

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
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Assessment State
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
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
    setQuestions([]);
    setIsLoadingQuestions(true);
    setIsModalOpen(true);

    try {
      const q = await apiClient<Question[]>(`/assessment/questions/${skill.id}`);
      setQuestions(q || []);
    } catch (err: any) {
      console.warn('Could not load questions:', err);
      setQuestions([]);
    } finally {
      setIsLoadingQuestions(false);
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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-card border border-border" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Target className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
          <p className="font-semibold text-foreground text-base">
            {t('assessment.noAssessmentsTitle', 'No diagnostic assessments available yet')}
          </p>
          <p className="text-xs mt-1">
            {t('assessment.noAssessmentsSub', 'Diagnostic evaluations will appear once competencies and question banks are configured.')}
          </p>
        </Card>
      ) : filteredSkills.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <p className="font-semibold text-foreground text-sm">
            {t('assessment.noDomainAssessments', 'No assessments found for this domain.')}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDomain('all')}
            className="mt-3 text-xs"
          >
            {t('assessment.viewAllDomains', 'View All Domains')}
          </Button>
        </Card>
      ) : (
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
                      <Badge variant="neutral">Not assessed</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-serif">{skill.name}</CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{skill.description}</p>
                </CardHeader>

                <CardContent className="pt-0 border-t border-border mt-3 flex items-center justify-between pt-3">
                  <div className="text-xs text-muted-foreground">
                    {hasVerified ? (
                      <>
                        Effective: <strong className="text-foreground">{userSkill?.effectiveScore || userSkill?.verifiedScore}/5</strong>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">Not assessed</span>
                    )}
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
      )}

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
        {isLoadingQuestions ? (
          <div className="py-12 text-center text-sm text-muted-foreground space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#C2410C] mx-auto" />
            <p>Loading curated diagnostic questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground space-y-3">
            <HelpCircle className="w-10 h-10 text-muted-foreground/50 mx-auto" />
            <h3 className="font-semibold text-foreground text-base">No Questions Available</h3>
            <p className="text-xs max-w-sm mx-auto text-muted-foreground">
              There are currently no diagnostic questions configured for {activeSkill?.name || 'this skill'}. Please check back later or explore other skills.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
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
                  {ans.questionText && (
                    <p className="text-foreground/90 font-medium pl-6">{stripInactivePrefix(ans.questionText)}</p>
                  )}
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
              {stripInactivePrefix(questions[currentQuestionIdx].questionText)}
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
