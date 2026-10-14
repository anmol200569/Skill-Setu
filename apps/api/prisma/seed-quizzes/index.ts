import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

/**
 * Seed script for system-level quizzes with skillId and no owner (creatorId: null).
 * Reads the reviewable systemQuizzes.json and seeds Quiz and QuizQuestion records.
 *
 * NOTE: DO NOT RUN THIS ON THE LIVE DATABASE WITHOUT EXPLICIT USER AUTHORIZATION.
 */
export async function seedSystemQuizzes(prismaClient?: PrismaClient, options?: { dryRun?: boolean }) {
  const isDryRun = options?.dryRun ?? process.argv.includes('--dry-run');

  const jsonPath = path.join(__dirname, 'systemQuizzes.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`systemQuizzes.json not found at ${jsonPath}. Run the builder first.`);
  }

  const quizzesData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${quizzesData.length} quizzes from ${jsonPath}`);

  if (isDryRun) {
    console.log(`[DRY-RUN] Mode active. No database queries or writes will be executed.`);
    const skillCounts = new Map<string, number>();
    const difficultyCounts = { beginner: 0, intermediate: 0, advanced: 0 };
    let totalQuestions = 0;

    for (const q of quizzesData) {
      skillCounts.set(q.skillCode, (skillCounts.get(q.skillCode) || 0) + 1);
      const diff = q.difficulty as 'beginner' | 'intermediate' | 'advanced';
      if (diff in difficultyCounts) {
        difficultyCounts[diff]++;
      }
      totalQuestions += (q.questions ? q.questions.length : 0);
    }

    console.log(`[DRY-RUN] Total Quizzes in file: ${quizzesData.length}`);
    console.log(`[DRY-RUN] Distinct Skills covered: ${skillCounts.size}`);
    console.log(`[DRY-RUN] Difficulty Breakdown: Beginner=${difficultyCounts.beginner}, Intermediate=${difficultyCounts.intermediate}, Advanced=${difficultyCounts.advanced}`);
    console.log(`[DRY-RUN] Total Questions: ${totalQuestions}`);
    return {
      dryRun: true,
      totalQuizzes: quizzesData.length,
      distinctSkills: skillCounts.size,
      difficultyCounts,
      totalQuestions
    };
  }

  const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const prisma = prismaClient || new PrismaClient({
    datasources: connectionUrl ? { db: { url: connectionUrl } } : undefined
  });

  // Fetch all skills to map skillCode to skillId
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
    if (!skillId) {
      console.warn(`[seedQuizzes] Skill not found for code: ${qData.skillCode}. Skipping quiz: ${qData.title}`);
      continue;
    }

    // Upsert or create system quiz with creatorId = null
    const existing = await prisma.quiz.findFirst({
      where: {
        creatorId: null,
        skillId,
        difficulty: qData.difficulty as any,
        title: qData.title
      }
    });

    if (existing) {
      continue;
    }

    await prisma.quiz.create({
      data: {
        creatorId: null,
        skillId,
        title: qData.title,
        description: qData.description,
        sourceType: qData.sourceType || 'topic_prompt',
        isPublished: true,
        questionCount: qData.questionCount || 5,
        difficulty: qData.difficulty as any,
        language: 'en',
        questions: {
          create: qData.questions.map((q: any, idx: number) => ({
            questionText: q.questionText,
            type: q.type as any,
            difficulty: q.difficulty as any,
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation,
            topicTag: q.topicTag,
            orderIndex: idx + 1
          }))
        }
      }
    });

    createdCount++;
  }

  console.log(`Successfully seeded ${createdCount} system diagnostic quizzes with no owner (creatorId: null).`);
}

// Standalone execution wrapper (DO NOT run against live DB)
if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');
  seedSystemQuizzes(undefined, { dryRun })
    .then(() => {
      console.log('Quiz seed script completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Quiz seed script failed:', err);
      process.exit(1);
    });
}
