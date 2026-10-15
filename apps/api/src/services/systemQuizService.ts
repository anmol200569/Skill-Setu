import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';

export function getSystemQuizzesFilePath(): string | null {
  const possiblePaths = [
    path.resolve(__dirname, '../../prisma/seed-quizzes/systemQuizzes.json'),
    path.resolve(process.cwd(), 'prisma/seed-quizzes/systemQuizzes.json'),
    path.resolve(process.cwd(), 'apps/api/prisma/seed-quizzes/systemQuizzes.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

export function loadSystemQuizzesData(): any[] {
  const filePath = getSystemQuizzesFilePath();
  if (!filePath) {
    console.warn('[SystemQuizService] systemQuizzes.json not found in candidate paths.');
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err: any) {
    console.error('[SystemQuizService] Failed to read systemQuizzes.json:', err?.message);
    return [];
  }
}

export async function ensureSystemQuizzesSeeded(): Promise<number> {
  const existingCount = await prisma.quiz.count({
    where: { creatorId: null }
  });

  if (existingCount > 0) {
    return existingCount;
  }

  const quizzesData = loadSystemQuizzesData();
  if (!quizzesData || quizzesData.length === 0) {
    return 0;
  }

  const skills = await prisma.skill.findMany({
    select: { id: true, code: true, name: true }
  });
  const skillCodeToIdMap = new Map<string, string>();
  for (const s of skills) {
    skillCodeToIdMap.set(s.code, s.id);
  }

  let createdCount = 0;

  for (const qData of quizzesData) {
    const skillId = skillCodeToIdMap.get(qData.skillCode);
    if (!skillId) continue;

    const existing = await prisma.quiz.findFirst({
      where: {
        creatorId: null,
        skillId,
        difficulty: qData.difficulty as any,
        title: qData.title
      }
    });

    if (existing) continue;

    await prisma.quiz.create({
      data: {
        creatorId: null,
        skillId,
        title: qData.title,
        description: qData.description,
        sourceType: qData.sourceType || 'topic_prompt',
        isPublished: true,
        questionCount: qData.questionCount || (qData.questions ? qData.questions.length : 5),
        difficulty: qData.difficulty as any,
        language: 'en',
        questions: {
          create: (qData.questions || []).map((q: any, idx: number) => ({
            questionText: q.questionText,
            type: q.type as any,
            difficulty: q.difficulty as any,
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation,
            topicTag: q.topicTag || qData.skillCode,
            orderIndex: idx + 1
          }))
        }
      }
    });
    createdCount++;
  }

  return createdCount;
}
