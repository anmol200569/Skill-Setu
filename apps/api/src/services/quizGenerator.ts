import { prisma } from '../lib/prisma';
import {
  aiGeneratedQuizOutputSchema,
  UserRole
} from '@skill-setu/shared';
import { generateGeminiCompletion, extractJsonFromText, sanitizePromptInput } from './aiService';
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
}

export async function generateAndSaveQuiz(params: GenerateQuizParams) {
  // Sanitize prompt inputs to defend against prompt injection
  const sanitizedTitle = sanitizePromptInput(params.title);
  const sanitizedTopicOrText = sanitizePromptInput(params.topicOrText);

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

  let parsedQuizOutput: any = null;
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const responseText = await generateGeminiCompletion(
        prompt,
        systemInstruction,
        attempts === 1 ? 0.2 : 0.4,
        { responseMimeType: 'application/json' }
      );

      const parsed = extractJsonFromText<any>(responseText);
      const validated = aiGeneratedQuizOutputSchema.parse(parsed);
      parsedQuizOutput = validated;
      break;
    } catch (err: any) {
      // Do not retry on timeout
      if (err.message?.includes('timeout') || err.message?.includes('timed out')) {
        throw err;
      }
      console.warn(`Quiz generation attempt ${attempts} failed validation:`, err.message);
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate valid quiz JSON: ${err.message}`);
      }
    }
  }

  // Persist Quiz and Questions to Database
  const createdQuiz = await prisma.quiz.create({
    data: {
      creatorId: params.creatorId,
      title: parsedQuizOutput.quizTitle || sanitizedTitle || params.title,
      description: parsedQuizOutput.description || 'AI-generated technical assessment',
      sourceType: params.sourceType,
      sourceFilename: params.sourceFilename,
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
      questionText: q.questionText,
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
    answers: answersDetail
  };
}
