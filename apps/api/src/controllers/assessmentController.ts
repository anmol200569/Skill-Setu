import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { submitAssessmentSchema } from '@skill-setu/shared';

export async function getSkillAssessmentQuestions(req: Request, res: Response): Promise<void> {
  const { skillId } = req.params;

  const questions = await prisma.assessmentQuestion.findMany({
    where: { skillId },
    select: {
      id: true,
      skillId: true,
      questionText: true,
      type: true,
      difficulty: true,
      options: true,
      explanation: true
      // Notice: correctAnswers are omitted during test taking
    }
  });

  res.json(questions);
}

export async function submitAssessment(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const validated = submitAssessmentSchema.parse(req.body);

  const skill = await prisma.skill.findUnique({
    where: { id: validated.skillId }
  });

  if (!skill) {
    res.status(404).json({ error: 'NotFound', message: 'Skill not found' });
    return;
  }

  const questions = await prisma.assessmentQuestion.findMany({
    where: {
      id: { in: validated.answers.map((a) => a.questionId) }
    }
  });

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  let correctCount = 0;
  const total = questions.length;

  const evaluatedAnswers = [];

  for (const answerInput of validated.answers) {
    const q = questionMap.get(answerInput.questionId);
    if (!q) continue;

    const correctAnswers = (q.correctAnswers as string[]) || [];
    const selected = answerInput.selectedOptions || [];

    const isCorrect =
      correctAnswers.length === selected.length &&
      correctAnswers.every((id) => selected.includes(id));

    if (isCorrect) correctCount++;

    evaluatedAnswers.push({
      questionId: q.id,
      selectedOptions: selected,
      isCorrect,
      timeSpentSeconds: answerInput.timeSpentSeconds || 0,
      explanation: q.explanation,
      correctAnswers
    });
  }

  const scorePercentage = total > 0 ? (correctCount / total) * 100 : 0;
  // Scaled 1 to 5: 0% -> 1.0, 100% -> 5.0
  const assessedLevel = Number((1.0 + (scorePercentage / 100) * 4.0).toFixed(1));

  // Store Attempt
  const attempt = await prisma.assessmentAttempt.create({
    data: {
      userId,
      skillId: validated.skillId,
      targetRoleId: validated.targetRoleId,
      score: scorePercentage,
      assessedLevel: Math.round(assessedLevel),
      totalQuestions: total,
      correctQuestions: correctCount,
      completedAt: new Date(),
      answers: {
        create: evaluatedAnswers.map((a) => ({
          questionId: a.questionId,
          selectedOptions: a.selectedOptions,
          isCorrect: a.isCorrect,
          timeSpentSeconds: a.timeSpentSeconds
        }))
      }
    }
  });

  // Update or create UserSkill
  const existingUserSkill = await prisma.userSkill.findUnique({
    where: {
      userId_skillId: {
        userId,
        skillId: validated.skillId
      }
    }
  });

  const selfLevel = existingUserSkill?.selfAssessedLevel ?? 1;
  const newEffectiveScore = Number((0.4 * selfLevel + 0.6 * assessedLevel).toFixed(2));
  const newConfidence = Math.min(95, 50 + total * 8);

  await prisma.userSkill.upsert({
    where: {
      userId_skillId: {
        userId,
        skillId: validated.skillId
      }
    },
    update: {
      verifiedScore: assessedLevel,
      effectiveScore: newEffectiveScore,
      confidenceLevel: newConfidence,
      lastAssessedAt: new Date()
    },
    create: {
      userId,
      skillId: validated.skillId,
      selfAssessedLevel: selfLevel,
      verifiedScore: assessedLevel,
      effectiveScore: newEffectiveScore,
      confidenceLevel: newConfidence,
      lastAssessedAt: new Date()
    }
  });

  res.json({
    attemptId: attempt.id,
    skillId: skill.id,
    skillName: skill.name,
    scorePercentage: Math.round(scorePercentage),
    assessedLevel,
    effectiveScore: newEffectiveScore,
    totalQuestions: total,
    correctQuestions: correctCount,
    evaluatedAnswers: evaluatedAnswers.map((a) => ({
      questionId: a.questionId,
      selectedOptions: a.selectedOptions,
      correctAnswers: a.correctAnswers,
      isCorrect: a.isCorrect,
      explanation: a.explanation
    }))
  });
}

export async function getAssessmentHistory(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  const attempts = await prisma.assessmentAttempt.findMany({
    where: { userId },
    include: { skill: true },
    orderBy: { startedAt: 'desc' },
    take: 20
  });

  res.json(
    attempts.map((a) => ({
      id: a.id,
      skillId: a.skillId,
      skillName: a.skill.name,
      score: a.score,
      assessedLevel: a.assessedLevel,
      totalQuestions: a.totalQuestions,
      correctQuestions: a.correctQuestions,
      completedAt: a.completedAt
    }))
  );
}
