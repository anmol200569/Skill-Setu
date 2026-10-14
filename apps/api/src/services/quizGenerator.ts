import { prisma } from '../lib/prisma';
import {
  aiGeneratedQuizOutputSchema,
  UserRole,
  stripInactivePrefix
} from '@skill-setu/shared';
import { config } from '../config';
import * as aiService from './aiService';
import { chunkText } from './fileExtractionService';

export interface GenerateQuizParams {
  creatorId: string;
  creatorRole: UserRole;
  title: string;
  topicOrText: string;
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'en' | 'hi';
  allowedTypes: ('single_mcq' | 'multi_mcq' | 'true_false')[];
  sourceType: 'uploaded_document' | 'pasted_text' | 'topic_prompt';
  sourceFilename?: string;
  skillId?: string | null;
}

export const TOTAL_QUIZ_BUDGET_MS = 55000;
export const DEFAULT_PRIMARY_QUIZ_TIMEOUT_MS = 30000;

export async function generateAndSaveQuiz(params: GenerateQuizParams) {
  // Sanitize prompt inputs to defend against prompt injection
  const sanitizedTitle = aiService.sanitizePromptInput(params.title);
  const sanitizedTopicOrText = aiService.sanitizePromptInput(params.topicOrText);

  // Chunk input if it's long study material and use up to a sensible cap (3 chunks ~15,000 chars)
  const chunks = chunkText(sanitizedTopicOrText, 5000);
  const primaryMaterial = chunks.slice(0, 3).join('\n\n---\n\n');

  const languagePrompt = params.language === 'hi'
    ? 'Output the quiz content entirely in Hindi (Devanagari script).'
    : 'Output the quiz content in English.';

  const allowedTypesStr = params.allowedTypes.join(', ');

  const systemInstruction = `You are an expert educational assessment creator for the Skill Setu technical platform.
Your task is to generate high-quality diagnostic and mastery assessment quizzes.
You must output valid JSON ONLY, without any extraneous commentary.`;

  const prompt = `Analyze the following learning material and generate a structured quiz.

Parameters:
- Title: "${sanitizedTitle}"
- Question Count: ${params.questionCount}
- Difficulty Level: ${params.difficulty}
- Language: ${languagePrompt}
- Allowed Question Types: ${allowedTypesStr} (use single_mcq, multi_mcq, or true_false)

Learning Material Context:
${primaryMaterial}

JSON Output Format Specification:
{
  "quizTitle": "${sanitizedTitle}",
  "description": "Comprehensive diagnostic quiz assessing key topics from the material.",
  "questions": [
    {
      "questionText": "Clear, precise question stem",
      "type": "single_mcq", // or "multi_mcq" or "true_false"
      "difficulty": "${params.difficulty}",
      "options": [
        { "id": "opt_1", "text": "Option text 1" },
        { "id": "opt_2", "text": "Option text 2" },
        { "id": "opt_3", "text": "Option text 3" },
        { "id": "opt_4", "text": "Option text 4" }
      ],
      "correctAnswers": ["opt_1"], // array of option IDs
      "explanation": "Detailed technical explanation of why this is correct and why other options are wrong.",
      "topicTag": "Specific Subtopic Name"
    }
  ]
}`;

  const startTime = Date.now();
  const getRemainingBudget = (elapsedMs?: number) => {
    const elapsed = elapsedMs !== undefined ? elapsedMs : (Date.now() - startTime);
    return Math.max(0, TOTAL_QUIZ_BUDGET_MS - elapsed);
  };

  const primaryModel = config.gemini.model || 'gemini-3.5-flash-lite';
  const fallbackModel = config.gemini.fallbackModel || 'gemini-3.1-flash-lite';

  // Primary timeout respects GEMINI_TIMEOUT_MS as primary cap, but never exceeds remaining budget or 35s
  const primaryCap = config.gemini.timeoutMs ? Math.min(config.gemini.timeoutMs, 35000) : DEFAULT_PRIMARY_QUIZ_TIMEOUT_MS;
  const primaryTimeout = Math.min(primaryCap, getRemainingBudget());

  const callAndValidateQuiz = async (model: string, temp: number, timeoutMs: number) => {
    const responseText = await aiService.generateGeminiCompletion(
      prompt,
      systemInstruction,
      temp,
      { model, responseMimeType: 'application/json', timeoutMs, thinkingLevel: 'LOW' }
    );
    const parsed = aiService.extractJsonFromText<any>(responseText);
    return aiGeneratedQuizOutputSchema.parse(parsed);
  };

  let parsedQuizOutput: any = null;
  let hasRetriedInvalid = false;

  try {
    // 1. Attempt generation with primary model
    try {
      parsedQuizOutput = await callAndValidateQuiz(primaryModel, 0.2, primaryTimeout);
    } catch (primaryOutputErr: any) {
      if (aiService.isFallbackEligibleError(primaryOutputErr)) {
        throw primaryOutputErr;
      }
      // Invalid output on primary: retry ONCE if budget permits
      if (!hasRetriedInvalid) {
        hasRetriedInvalid = true;
        const retryBudget = Math.min(primaryTimeout, getRemainingBudget());
        if (retryBudget < 2000) {
          throw primaryOutputErr;
        }
        console.warn(`[QuizGeneration] Primary model invalid output, retrying once:`, primaryOutputErr.message);
        parsedQuizOutput = await callAndValidateQuiz(primaryModel, 0.4, retryBudget);
      } else {
        throw primaryOutputErr;
      }
    }
  } catch (primaryErr: any) {
    if (aiService.isFallbackEligibleError(primaryErr)) {
      console.warn(`[QuizGeneration] Primary model (${primaryModel}) failed (${primaryErr.message}). Attempting fallback model (${fallbackModel})...`);
      if (fallbackModel && fallbackModel !== primaryModel) {
        // Calculate remaining budget for fallback
        const isTimeout =
          primaryErr?.message?.includes('timed out') ||
          primaryErr?.message?.includes('timeout') ||
          primaryErr?.status === 504;
        const realElapsed = Date.now() - startTime;
        const effectiveElapsed = isTimeout ? Math.max(realElapsed, primaryTimeout) : realElapsed;
        const remainingBudget = getRemainingBudget(effectiveElapsed);

        if (remainingBudget < 2000) {
          console.warn(`[QuizGeneration] Insufficient budget remaining for fallback (${remainingBudget}ms). Failing fast.`);
          const busyErr = new Error('The AI quiz service is busy right now. Please try again in a few minutes.');
          (busyErr as any).status = 503;
          (busyErr as any).statusCode = 503;
          throw busyErr;
        }

        try {
          // Attempt fallback model ONCE with remaining budget
          try {
            parsedQuizOutput = await callAndValidateQuiz(fallbackModel, 0.2, remainingBudget);
          } catch (fallbackOutputErr: any) {
            if (aiService.isFallbackEligibleError(fallbackOutputErr)) {
              throw fallbackOutputErr;
            }
            if (!hasRetriedInvalid) {
              hasRetriedInvalid = true;
              const fbRemaining = getRemainingBudget();
              if (fbRemaining < 2000) {
                throw fallbackOutputErr;
              }
              console.warn(`[QuizGeneration] Fallback model invalid output, retrying once:`, fallbackOutputErr.message);
              parsedQuizOutput = await callAndValidateQuiz(fallbackModel, 0.4, fbRemaining);
            } else {
              throw fallbackOutputErr;
            }
          }
        } catch (fallbackErr: any) {
          console.error(`[QuizGeneration] Fallback model (${fallbackModel}) also failed:`, fallbackErr.message);
          const busyErr = new Error('The AI quiz service is busy right now. Please try again in a few minutes.');
          (busyErr as any).status = 503;
          (busyErr as any).statusCode = 503;
          throw busyErr;
        }
      } else {
        const busyErr = new Error('The AI quiz service is busy right now. Please try again in a few minutes.');
        (busyErr as any).status = 503;
        (busyErr as any).statusCode = 503;
        throw busyErr;
      }
    } else {
      throw primaryErr;
    }
  }

  if (!parsedQuizOutput) {
    throw new Error('Failed to generate quiz output after all attempts.');
  }

  // Persist Quiz and Questions to Database
  const createdQuiz = await prisma.quiz.create({
    data: {
      creatorId: params.creatorId,
      title: parsedQuizOutput.quizTitle || sanitizedTitle || params.title,
      description: parsedQuizOutput.description || 'AI-generated technical assessment',
      sourceType: params.sourceType,
      sourceFilename: params.sourceFilename,
      skillId: params.skillId || null,
      isPublished: true,
      questionCount: parsedQuizOutput.questions.length,
      difficulty: params.difficulty as any,
      language: params.language,
      questions: {
        create: parsedQuizOutput.questions.map((q: any, idx: number) => ({
          questionText: q.questionText,
          type: q.type,
          difficulty: q.difficulty,
          options: q.options,
          correctAnswers: q.correctAnswers,
          explanation: q.explanation,
          topicTag: q.topicTag,
          orderIndex: idx + 1
        }))
      }
    },
    include: {
      questions: true
    }
  });

  return createdQuiz;
}

export interface QuizAttemptEvaluation {
  quizId: string;
  userId: string;
  timeSpentSeconds: number;
  submittedAnswers: { questionId: string; selectedOptions: string[] }[];
}

export async function evaluateQuizAttempt(params: QuizAttemptEvaluation) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.quizId },
    include: { questions: true }
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
  let correctCount = 0;
  const total = quiz.questions.length;

  const topicMistakes = new Map<string, number>();
  const answersDetail = [];

  for (const sub of params.submittedAnswers) {
    const q = questionMap.get(sub.questionId);
    if (!q) continue;

    const correct = (q.correctAnswers as string[]) || [];
    const selected = sub.selectedOptions || [];

    // Array set equality
    const isCorrect =
      correct.length === selected.length &&
      correct.every((id) => selected.includes(id));

    if (isCorrect) {
      correctCount++;
    } else {
      const current = topicMistakes.get(q.topicTag) || 0;
      topicMistakes.set(q.topicTag, current + 1);
    }

    answersDetail.push({
      questionId: q.id,
      questionText: stripInactivePrefix(q.questionText),
      selectedOptions: selected,
      correctOptions: correct,
      isCorrect,
      explanation: q.explanation
    });
  }

  const scorePercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Weak topics synthesis
  const weakTopics = Array.from(topicMistakes.entries()).map(([topic, count]) => ({
    topic,
    incorrectCount: count,
    reviewRecommendation: `Review fundamentals of "${topic}" in your course catalogue and study notes to reinforce core concepts.`
  }));

  // Store attempt in DB
  const attemptRecord = await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: params.userId,
      scorePercentage,
      totalQuestions: total,
      correctAnswersCount: correctCount,
      timeSpentSeconds: params.timeSpentSeconds,
      answers: {
        create: answersDetail.map((a) => ({
          questionId: a.questionId,
          selectedOptions: a.selectedOptions,
          isCorrect: a.isCorrect
        }))
      }
    }
  });

  let skillBoostApplied = false;
  let boostAmount = 0;
  let updatedSelfLevel: number | null = null;

  if (quiz.skillId) {
    if (scorePercentage >= 80) {
      boostAmount = 0.5;
    } else if (scorePercentage >= 60) {
      boostAmount = 0.25;
    }

    if (boostAmount > 0) {
      const existing = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId: params.userId,
            skillId: quiz.skillId
          }
        }
      });

      const currentSelf = existing?.selfAssessedLevel ?? 1;
      const verified = existing?.verifiedScore ?? null;
      const isAssessed = verified !== null && verified !== undefined;

      // Capped at (verifiedScore + 1) if assessed, otherwise at 3, never above 5
      const cap = Math.min(5, isAssessed ? (verified! + 1) : 3);
      const newSelf = Math.min(cap, Number((currentSelf + boostAmount).toFixed(2)));

      // verifiedScore is never changed by practice quizzes
      const effectiveScore = verified !== null
        ? Number((0.4 * newSelf + 0.6 * verified).toFixed(2))
        : newSelf;

      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: params.userId,
            skillId: quiz.skillId
          }
        },
        update: {
          selfAssessedLevel: newSelf,
          effectiveScore
        },
        create: {
          userId: params.userId,
          skillId: quiz.skillId,
          selfAssessedLevel: newSelf,
          verifiedScore: null,
          effectiveScore,
          confidenceLevel: 50.0
        }
      });

      skillBoostApplied = true;
      updatedSelfLevel = newSelf;
    }
  }

  return {
    id: attemptRecord.id,
    quizId: quiz.id,
    quizTitle: quiz.title,
    userId: params.userId,
    scorePercentage,
    totalQuestions: total,
    correctAnswersCount: correctCount,
    timeSpentSeconds: params.timeSpentSeconds,
    submittedAt: attemptRecord.submittedAt.toISOString(),
    weakTopics,
    answers: answersDetail,
    skillId: quiz.skillId || null,
    skillBoostApplied,
    boostAmount,
    newSelfAssessedLevel: updatedSelfLevel
  };
}
