import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { evaluateQuizAttempt } from '../src/services/quizGenerator';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    quiz: {
      findUnique: vi.fn()
    },
    quizAttempt: {
      create: vi.fn()
    },
    userSkill: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    }
  }
}));

describe('Practice Quiz to Skill Profile (Task C3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockQuestions = [
    { id: 'q1', correctAnswers: ['opt-1'], topicTag: 'Databases', questionText: 'Q1', explanation: 'Exp1' },
    { id: 'q2', correctAnswers: ['opt-2'], topicTag: 'Databases', questionText: 'Q2', explanation: 'Exp2' },
    { id: 'q3', correctAnswers: ['opt-3'], topicTag: 'Networking', questionText: 'Q3', explanation: 'Exp3' },
    { id: 'q4', correctAnswers: ['opt-4'], topicTag: 'Networking', questionText: 'Q4', explanation: 'Exp4' },
    { id: 'q5', correctAnswers: ['opt-5'], topicTag: 'Networking', questionText: 'Q5', explanation: 'Exp5' }
  ];

  it('adds +0.5 for score >= 80% and respects cap of (verifiedScore + 1) without touching verifiedScore', async () => {
    const userId = 'user-c3-1';
    const skillId = 'skill-db';
    const quizId = 'quiz-db-1';

    (prisma.quiz.findUnique as any).mockResolvedValue({
      id: quizId,
      title: 'PostgreSQL Practice',
      skillId,
      questions: mockQuestions
    });

    (prisma.quizAttempt.create as any).mockResolvedValue({
      id: 'attempt-1',
      submittedAt: new Date()
    });

    // Existing user skill: verifiedScore = 2, selfAssessedLevel = 2.
    // Cap is verifiedScore + 1 = 3.
    (prisma.userSkill.findUnique as any).mockResolvedValue({
      id: 'us-1',
      userId,
      skillId,
      selfAssessedLevel: 2,
      verifiedScore: 2,
      effectiveScore: 2.0
    });

    // Learner gets 4 of 5 correct = 80%
    const result = await evaluateQuizAttempt({
      quizId,
      userId,
      timeSpentSeconds: 120,
      submittedAnswers: [
        { questionId: 'q1', selectedOptions: ['opt-1'] },
        { questionId: 'q2', selectedOptions: ['opt-2'] },
        { questionId: 'q3', selectedOptions: ['opt-3'] },
        { questionId: 'q4', selectedOptions: ['opt-4'] },
        { questionId: 'q5', selectedOptions: ['wrong'] }
      ]
    });

    expect(result.scorePercentage).toBe(80);
    expect(result.skillBoostApplied).toBe(true);
    expect(result.boostAmount).toBe(0.5);
    expect(result.newSelfAssessedLevel).toBe(2.5);

    // Verify UserSkill update
    expect(prisma.userSkill.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_skillId: { userId, skillId } },
        update: {
          selfAssessedLevel: 2.5,
          effectiveScore: 2.2 // 0.4 * 2.5 + 0.6 * 2 = 1.0 + 1.2 = 2.2
        }
      })
    );
    // verifiedScore was NOT modified in the update
    const updateCall = (prisma.userSkill.upsert as any).mock.calls[0][0];
    expect(updateCall.update.verifiedScore).toBeUndefined();
  });

  it('adds +0.25 for score between 60% and 79% and caps unassessed skills at 3', async () => {
    const userId = 'user-c3-2';
    const skillId = 'skill-unassessed';
    const quizId = 'quiz-unassessed-1';

    (prisma.quiz.findUnique as any).mockResolvedValue({
      id: quizId,
      title: 'General Node.js Quiz',
      skillId,
      questions: mockQuestions
    });

    (prisma.quizAttempt.create as any).mockResolvedValue({
      id: 'attempt-2',
      submittedAt: new Date()
    });

    // Unassessed user skill: verifiedScore = null, selfAssessedLevel = 2.85.
    // Cap is 3 for unassessed. 2.85 + 0.25 = 3.10 -> capped at 3.0.
    (prisma.userSkill.findUnique as any).mockResolvedValue({
      id: 'us-2',
      userId,
      skillId,
      selfAssessedLevel: 2.85,
      verifiedScore: null,
      effectiveScore: 2.85
    });

    // Learner gets 3 of 5 correct = 60%
    const result = await evaluateQuizAttempt({
      quizId,
      userId,
      timeSpentSeconds: 90,
      submittedAnswers: [
        { questionId: 'q1', selectedOptions: ['opt-1'] },
        { questionId: 'q2', selectedOptions: ['opt-2'] },
        { questionId: 'q3', selectedOptions: ['opt-3'] },
        { questionId: 'q4', selectedOptions: ['wrong'] },
        { questionId: 'q5', selectedOptions: ['wrong'] }
      ]
    });

    expect(result.scorePercentage).toBe(60);
    expect(result.skillBoostApplied).toBe(true);
    expect(result.boostAmount).toBe(0.25);
    // Capped at 3 because verifiedScore is null
    expect(result.newSelfAssessedLevel).toBe(3);

    expect(prisma.userSkill.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_skillId: { userId, skillId } },
        update: {
          selfAssessedLevel: 3,
          effectiveScore: 3
        }
      })
    );
  });

  it('does not apply boost when quiz has no skill linked (general quiz)', async () => {
    const userId = 'user-c3-3';
    const quizId = 'quiz-general-1';

    (prisma.quiz.findUnique as any).mockResolvedValue({
      id: quizId,
      title: 'General Trivia Quiz',
      skillId: null, // No skill
      questions: mockQuestions
    });

    (prisma.quizAttempt.create as any).mockResolvedValue({
      id: 'attempt-3',
      submittedAt: new Date()
    });

    const result = await evaluateQuizAttempt({
      quizId,
      userId,
      timeSpentSeconds: 60,
      submittedAnswers: [
        { questionId: 'q1', selectedOptions: ['opt-1'] },
        { questionId: 'q2', selectedOptions: ['opt-2'] },
        { questionId: 'q3', selectedOptions: ['opt-3'] },
        { questionId: 'q4', selectedOptions: ['opt-4'] },
        { questionId: 'q5', selectedOptions: ['opt-5'] }
      ]
    });

    expect(result.scorePercentage).toBe(100);
    expect(result.skillBoostApplied).toBe(false);
    expect(result.boostAmount).toBe(0);
    expect(prisma.userSkill.upsert).not.toHaveBeenCalled();
  });
});
