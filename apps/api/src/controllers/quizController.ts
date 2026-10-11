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
import { generateQuizPdf } from '../services/quizExportService';
import { quizGenerateInputSchema, submitQuizAttemptSchema } from '@skill-setu/shared';

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

    if (!extractedText || extractedText.length < 10) {
      res.status(400).json({
        error: 'ExtractionError',
        message: 'Could not extract readable text content from the uploaded document.'
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
        extractedText
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
    res.status(400).json({
      error: 'UploadError',
      message: err.message || 'File processing failed'
    });
  }
}

export async function generateQuiz(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const validated = quizGenerateInputSchema.parse(req.body);

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
      sourceFilename: validated.sourceFilename
    });

    res.status(201).json(quiz);
  } catch (err: any) {
    res.status(500).json({
      error: 'QuizGenerationError',
      message: err.message || 'Failed to generate quiz with AI model'
    });
  }
}

export async function listQuizzes(req: Request, res: Response): Promise<void> {
  const { publishedOnly = 'true' } = req.query;

  const whereClause: any = {};
  if (publishedOnly === 'true' && req.user?.role === 'learner') {
    whereClause.isPublished = true;
  }

  const quizzes = await prisma.quiz.findMany({
    where: whereClause,
    include: {
      creator: {
        select: { id: true, email: true, role: true }
      },
      _count: {
        select: { questions: true, attempts: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(
    quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      creatorEmail: q.creator.email,
      sourceType: q.sourceType,
      isPublished: q.isPublished,
      questionCount: q._count.questions,
      attemptCount: q._count.attempts,
      difficulty: q.difficulty,
      language: q.language,
      createdAt: q.createdAt
    }))
  );
}

export async function getQuizById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userRole = req.user?.role;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
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
  const isTrainerOrAdmin = userRole === 'admin' || userRole === 'trainer';

  res.json({
    ...quiz,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
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

  try {
    const evaluation = await evaluateQuizAttempt({
      quizId: validated.quizId,
      userId,
      timeSpentSeconds: validated.timeSpentSeconds,
      submittedAnswers: validated.answers
    });

    res.json(evaluation);
  } catch (err: any) {
    res.status(400).json({ error: 'QuizSubmissionError', message: err.message });
  }
}

export async function exportQuizPdfEndpoint(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
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

// ---------------- Admin/Trainer Management ----------------

export async function updateQuiz(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
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

  res.json({ message: 'Quiz updated successfully', quiz });
}

export async function deleteQuiz(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await prisma.quiz.delete({ where: { id } });
  res.json({ message: 'Quiz deleted successfully' });
}
