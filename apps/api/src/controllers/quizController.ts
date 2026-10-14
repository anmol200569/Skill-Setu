import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  extractTextFromBuffer,
  validateFileMetadata
} from '../services/fileExtractionService';
import {
  generateAndSaveQuiz,
  evaluateQuizAttempt
} from '../services/quizGenerator';
import { autoRecalculateLearningPath } from '../services/recommendationEngine';
import { generateQuizPdf } from '../services/quizExportService';
import {
  quizGenerateInputSchema,
  submitQuizAttemptSchema,
  stripInactivePrefix
} from '@skill-setu/shared';
import { analyzeLearnerSkillGaps } from '../services/gapAnalysisEngine';

export async function uploadStudyMaterial(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'BadRequest', message: 'No file uploaded' });
    return;
  }

  try {
    validateFileMetadata(file.originalname, file.mimetype, file.size);

    const extractedText = await extractTextFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    if (!extractedText || extractedText.trim().length < 10) {
      res.status(400).json({
        error: 'ExtractionError',
        message: 'No readable text found in document. If this is a scanned PDF or image, please provide a text-based document or paste the text directly.'
      });
      return;
    }

    const upload = await prisma.upload.create({
      data: {
        userId,
        originalFilename: file.originalname,
        storedFilename: `${Date.now()}-${file.originalname}`,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        extractedText: '' // Metadata-only: extracted text is never persisted to database
      }
    });

    res.json({
      uploadId: upload.id,
      filename: file.originalname,
      sizeBytes: file.size,
      textLength: extractedText.length,
      preview: extractedText.slice(0, 500) + '...',
      extractedText
    });
  } catch (err: any) {
    // Log the real internal error server-side only
    console.error('[uploadStudyMaterial] Internal file extraction error:', err);

    let clientMessage = err.message || 'File processing failed';
    if (clientMessage.includes('Please save it as .pptx and upload again.')) {
      clientMessage = 'Please save it as .pptx and upload again.';
    } else if (clientMessage.includes('exceeds maximum allowed limit') || clientMessage.includes('limit of 4 MB')) {
      clientMessage = 'File size exceeds the 4 MB upload limit. Please upload a smaller document.';
    } else if (clientMessage.includes('Unsupported file')) {
      clientMessage = 'Unsupported file format. Please upload a PDF, DOCX, PPTX, or TXT file.';
    } else if (
      clientMessage.includes('No readable text') ||
      clientMessage.includes('scanned') ||
      clientMessage.includes('Could not parse')
    ) {
      clientMessage = 'No readable text found in document. If this is a scanned PDF or image, please provide a text-based document or paste the text directly.';
    }

    res.status(400).json({
      error: 'UploadError',
      message: clientMessage
    });
  }
}

function extractRetryAfterSeconds(err: any): number | undefined {
  if (!err) return undefined;
  if (typeof err.retryAfter === 'number') return err.retryAfter;
  if (typeof err.retryDelay === 'number') return Math.ceil(err.retryDelay);

  // Check Google RPC RetryInfo
  if (Array.isArray(err.details)) {
    const retryInfo = err.details.find((d: any) => d?.['@type']?.includes('RetryInfo'));
    if (retryInfo?.retryDelay) {
      const match = String(retryInfo.retryDelay).match(/^(\d+)(?:\.\d+)?s?$/);
      if (match) return parseInt(match[1], 10);
    }
  }

  // Check string match in message
  const msg = typeof err.message === 'string' ? err.message : '';
  const delayMatch = msg.match(/"retryDelay"\s*:\s*"(\d+)s?"/i) || msg.match(/retry in (\d+)\s*s/i);
  if (delayMatch) {
    return parseInt(delayMatch[1], 10);
  }

  return undefined;
}

function isQuotaOrTimeoutError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.statusCode || err.code;
  if (status === 429 || status === 503) return true;

  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('resource_exhausted') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('unavailable') ||
    msg.includes('high demand')
  );
}

export async function generateQuiz(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const userRole = req.user!.role;

  // Default empty title to first line of text or 'Untitled quiz'
  let rawTitle = (req.body.title || '').trim();
  if (!rawTitle) {
    const rawText = (req.body.topicOrText || '').trim();
    const firstLine = rawText.split('\n').map((s: string) => s.trim()).find((s: string) => s.length > 0) || '';
    rawTitle = firstLine.slice(0, 100) || 'Untitled quiz';
  }
  req.body.title = rawTitle;

  let validated;
  try {
    validated = quizGenerateInputSchema.parse(req.body);
  } catch (err: any) {
    res.status(400).json({
      error: 'ValidationError',
      message: err.errors ? err.errors.map((e: any) => `${e.path.join('.') || 'input'}: ${e.message}`).join(', ') : (err.message || 'Invalid quiz parameters')
    });
    return;
  }

  try {
    const quiz = await generateAndSaveQuiz({
      creatorId: userId,
      creatorRole: userRole,
      title: validated.title,
      topicOrText: validated.topicOrText,
      questionCount: validated.questionCount,
      difficulty: validated.difficulty,
      language: validated.language,
      allowedTypes: validated.allowedTypes,
      sourceType: validated.sourceType,
      sourceFilename: validated.sourceFilename,
      skillId: validated.skillId || null
    });

    res.status(201).json(quiz);
  } catch (err: any) {
    // Log real provider error server-side only
    console.error('[QuizGeneration] Gemini provider error:', err);

    if (isQuotaOrTimeoutError(err)) {
      const retryAfter = extractRetryAfterSeconds(err);
      if (retryAfter) {
        res.setHeader('Retry-After', retryAfter.toString());
      }
      res.status(503).json({
        error: 'ServiceUnavailable',
        message: 'The AI quiz service is busy right now. Please try again in a few minutes.',
        ...(retryAfter !== undefined ? { retryAfter } : {})
      });
      return;
    }

    res.status(500).json({
      error: 'QuizGenerationError',
      message: 'Failed to generate quiz. Please try again.'
    });
  }
}

export async function listQuizzes(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  // Ownership isolation: Users see their own quizzes (or system quizzes if includeSystem=true).
  // Other users' uploads are NEVER returned (C2 isolation maintained).
  const includeSystem = req.query.includeSystem === 'true';
  const where = includeSystem
    ? {
        OR: [
          { creatorId: user.id },
          { creatorId: null }
        ]
      }
    : { creatorId: user.id };

  const quizzes = await prisma.quiz.findMany({
    where,
    include: {
      skill: { select: { id: true, name: true, code: true } },
      _count: {
        select: { questions: true, attempts: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Payloads must NEVER return stored study text, creatorId, owner, or creatorEmail
  res.json(
    quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      sourceType: q.sourceType,
      isPublished: q.isPublished,
      questionCount: q._count.questions,
      attemptCount: q._count.attempts,
      difficulty: q.difficulty,
      language: q.language,
      skillId: q.skillId,
      skillName: q.skill?.name || null,
      isSystem: q.creatorId === null,
      createdAt: q.createdAt
    }))
  );
}

export async function getQuizById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  // Ownership isolation: Quiz must be owned by user OR be a system quiz (creatorId: null).
  // Non-owned quiz from another user must always return 404 for all users.
  const quiz = await prisma.quiz.findFirst({
    where: {
      id,
      OR: [
        { creatorId: user.id },
        { creatorId: null }
      ]
    },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' }
      }
    }
  });

  if (!quiz) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  // If learner is fetching, hide correctAnswers before submission
  const isTrainerOrAdmin = user.role === 'admin' || user.role === 'trainer';

  // Exclude creatorId and any study text from ALL responses, including for admin
  res.json({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    sourceType: quiz.sourceType,
    sourceFilename: quiz.sourceFilename,
    isPublished: quiz.isPublished,
    questionCount: quiz.questionCount,
    difficulty: quiz.difficulty,
    language: quiz.language,
    skillId: quiz.skillId,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      questionText: stripInactivePrefix(q.questionText),
      type: q.type,
      difficulty: q.difficulty,
      options: q.options,
      explanation: isTrainerOrAdmin ? q.explanation : undefined,
      correctAnswers: isTrainerOrAdmin ? q.correctAnswers : undefined,
      topicTag: q.topicTag,
      orderIndex: q.orderIndex
    }))
  });
}

export async function submitQuiz(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const validated = submitQuizAttemptSchema.parse(req.body);

  // Enforce quiz ownership rule: Non-owned quiz must always return 404
  // Exception: System quizzes (creatorId: null) can be submitted by any learner.
  const quiz = await prisma.quiz.findUnique({
    where: { id: validated.quizId },
    select: { id: true, creatorId: true, skillId: true }
  });

  if (!quiz || (quiz.creatorId !== userId && quiz.creatorId !== null)) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  try {
    const evaluation = await evaluateQuizAttempt({
      quizId: validated.quizId,
      userId,
      timeSpentSeconds: validated.timeSpentSeconds,
      submittedAnswers: validated.answers
    });

    // C4: Auto recalculation of learning path after a practice quiz is submitted
    await autoRecalculateLearningPath(userId);

    res.json(evaluation);
  } catch (err: any) {
    res.status(400).json({ error: 'QuizSubmissionError', message: err.message });
  }
}

export async function exportQuizPdfEndpoint(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  // Non-owned quiz must always return 404 (system quizzes with creatorId = null are allowed)
  const quiz = await prisma.quiz.findFirst({
    where: {
      id,
      OR: [
        { creatorId: userId },
        { creatorId: null }
      ]
    },
    include: {
      questions: { orderBy: { orderIndex: 'asc' } }
    }
  });

  if (!quiz) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  const pdfBuffer = generateQuizPdf({
    title: quiz.title,
    description: quiz.description,
    difficulty: quiz.difficulty,
    language: quiz.language,
    questions: quiz.questions.map((q) => ({
      questionText: q.questionText,
      type: q.type,
      options: q.options as any,
      correctAnswers: q.correctAnswers as any,
      explanation: q.explanation,
      topicTag: q.topicTag
    }))
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${quiz.title.replace(/[^a-zA-Z0-9]/g, '_')}_quiz.pdf"`
  );
  res.send(pdfBuffer);
}

/**
 * Returns "Recommended for you" quizzes ranked by the learner's biggest skill gaps
 * and filtered/mapped to the learner's competency level.
 */
export async function getRecommendedQuizzes(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { targetRoleId: true }
    });

    // Fetch learner's skill gap analysis
    const gapAnalysis = await analyzeLearnerSkillGaps(userId, profile?.targetRoleId || undefined);
    const gaps = gapAnalysis?.gaps || [];

    // Rank gaps: largest gap deficit first, then high priority
    const priorityRank = (p: string) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
    const sortedGaps = [...gaps].sort((a, b) => {
      const defDiff = (b.gap || 0) - (a.gap || 0);
      if (Math.abs(defDiff) > 0.05) return defDiff;
      return priorityRank(b.priority) - priorityRank(a.priority);
    });

    const getTargetDifficulty = (currentLevel: number | null | undefined): 'beginner' | 'intermediate' | 'advanced' => {
      if (currentLevel === null || currentLevel === undefined || currentLevel <= 1.5) {
        return 'beginner';
      }
      if (currentLevel < 4) {
        return 'intermediate';
      }
      return 'advanced';
    };

    const recommendedResults: any[] = [];
    const usedSkillIds = new Set<string>();

    for (const gap of sortedGaps) {
      if (usedSkillIds.has(gap.skillId)) continue;

      const targetDifficulty = getTargetDifficulty(gap.currentLevel);

      let systemQuiz = await prisma.quiz.findFirst({
        where: {
          creatorId: null,
          skillId: gap.skillId,
          difficulty: targetDifficulty as any
        },
        include: {
          skill: { select: { id: true, name: true, code: true } },
          _count: { select: { questions: true, attempts: true } }
        }
      });

      if (!systemQuiz) {
        systemQuiz = await prisma.quiz.findFirst({
          where: {
            creatorId: null,
            skillId: gap.skillId
          },
          include: {
            skill: { select: { id: true, name: true, code: true } },
            _count: { select: { questions: true, attempts: true } }
          }
        });
      }

      if (systemQuiz) {
        usedSkillIds.add(gap.skillId);
        recommendedResults.push({
          id: systemQuiz.id,
          title: systemQuiz.title,
          description: systemQuiz.description,
          difficulty: systemQuiz.difficulty,
          questionCount: systemQuiz._count.questions || systemQuiz.questionCount,
          attemptCount: systemQuiz._count.attempts,
          skillId: systemQuiz.skillId,
          skillName: systemQuiz.skill?.name || gap.skillName,
          gapDeficit: gap.gap,
          currentLevel: gap.currentLevel,
          requiredLevel: gap.requiredLevel,
          priority: gap.priority,
          recommendationReason: `Bridges your top ${gap.priority} gap in ${gap.skillName} (Current: ${gap.currentLevel ?? 1}/5, Target: ${gap.requiredLevel}/5)`
        });
      }

      if (recommendedResults.length >= 6) break;
    }

    // Fallback: If learner has no assessed gaps or no matched system quizzes, return any foundational system quizzes
    if (recommendedResults.length === 0) {
      const fallbackQuizzes = await prisma.quiz.findMany({
        where: { creatorId: null },
        take: 4,
        include: {
          skill: { select: { id: true, name: true, code: true } },
          _count: { select: { questions: true, attempts: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      for (const fq of fallbackQuizzes) {
        recommendedResults.push({
          id: fq.id,
          title: fq.title,
          description: fq.description,
          difficulty: fq.difficulty,
          questionCount: fq._count.questions || fq.questionCount,
          attemptCount: fq._count.attempts,
          skillId: fq.skillId,
          skillName: fq.skill?.name || null,
          gapDeficit: null,
          currentLevel: 1,
          requiredLevel: 3,
          priority: 'medium',
          recommendationReason: 'Foundational benchmark quiz recommended for your track'
        });
      }
    }

    res.json(recommendedResults);
  } catch (err: any) {
    console.error('[getRecommendedQuizzes] Error:', err);
    res.status(500).json({ error: 'RecommendationError', message: err.message });
  }
}

// ---------------- Quiz Management (Owner only) ----------------

export async function updateQuiz(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  const existing = await prisma.quiz.findUnique({
    where: { id },
    select: { id: true, creatorId: true }
  });

  if (!existing || existing.creatorId !== userId) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  const { title, description, isPublished, difficulty } = req.body;

  const quiz = await prisma.quiz.update({
    where: { id },
    data: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(isPublished !== undefined ? { isPublished } : {}),
      ...(difficulty ? { difficulty } : {})
    }
  });

  const { creatorId: _c, ...safeQuiz } = quiz;
  res.json({ message: 'Quiz updated successfully', quiz: safeQuiz });
}

export async function publishQuiz(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  const existing = await prisma.quiz.findUnique({
    where: { id },
    select: { id: true, creatorId: true, isPublished: true }
  });

  if (!existing || existing.creatorId !== userId) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  const { isPublished } = req.body;
  const updated = await prisma.quiz.update({
    where: { id },
    data: { isPublished: isPublished !== undefined ? Boolean(isPublished) : true }
  });

  const { creatorId: _c, ...safeQuiz } = updated;
  res.json({ message: 'Quiz publish status updated', quiz: safeQuiz });
}

export async function deleteQuiz(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  const existing = await prisma.quiz.findUnique({
    where: { id },
    select: { id: true, creatorId: true }
  });

  if (!existing || existing.creatorId !== userId) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  await prisma.quiz.delete({ where: { id } });
  res.json({ message: 'Quiz deleted successfully' });
}

export async function getQuizHistory(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    select: { id: true, creatorId: true }
  });

  if (!quiz || quiz.creatorId !== userId) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: id, userId },
    orderBy: { submittedAt: 'desc' }
  });

  res.json(attempts);
}

export async function getQuizResultById(req: Request, res: Response): Promise<void> {
  const { id, attemptId } = req.params;
  const userId = req.user!.id;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    select: { id: true, creatorId: true }
  });

  if (!quiz || quiz.creatorId !== userId) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz not found' });
    return;
  }

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: attemptId, quizId: id, userId },
    include: {
      answers: true
    }
  });

  if (!attempt) {
    res.status(404).json({ error: 'NotFound', message: 'Quiz attempt not found' });
    return;
  }

  res.json(attempt);
}
