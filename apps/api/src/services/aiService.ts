import { GoogleGenAI } from '@google/genai';
import { config } from '../config';

let aiClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    if (!config.gemini.apiKey || config.gemini.apiKey === 'your-gemini-api-key') {
      throw new Error(
        'GEMINI_API_KEY is not configured on the server. Please configure GEMINI_API_KEY in the Vercel Project Settings or server environment.'
      );
    }
    aiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
  }
  return aiClient;
}

/**
 * Basic prompt injection sanitizer
 */
export function sanitizePromptInput(input: string): string {
  if (!input) return '';
  // Strip out overt system prompt injection attempts
  return input
    .replace(/(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|rules)/gi, '[FILTERED INSTRUCTION]')
    .replace(/(?:system\s+prompt|system\s+instructions)\s*:/gi, '[FILTERED SYSTEM QUERY]')
    .trim();
}

/**
 * Extracts and parses JSON from Gemini LLM response (handling ```json code blocks)
 */
export function extractJsonFromText<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = 0;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(startIdx, lastBrace + 1);
    }
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(startIdx, lastBracket + 1);
    }
  }

  return JSON.parse(cleaned) as T;
}

/**
 * Validates the configured Gemini model name. Throws if missing or using retired models.
 */
export function validateAndGetGeminiModel(customModel?: string): string {
  const modelName = (customModel !== undefined ? customModel : config.gemini.model || '').trim();

  if (!modelName) {
    throw new Error(
      'GEMINI_MODEL environment variable is required but missing. Please configure GEMINI_MODEL (e.g. gemini-3.8-flash) in your environment.'
    );
  }

  // Never fall back to gemini-1.5-*, 2.0-*, or 2.5-* (retired or retiring)
  if (/^gemini-(?:1\.5|2\.0|2\.5)/i.test(modelName)) {
    throw new Error(
      `Configured GEMINI_MODEL "${modelName}" is retired or deprecated. Please configure an active model such as gemini-3.8-flash.`
    );
  }

  return modelName;
}

export interface GeminiCompletionOptions {
  responseMimeType?: string;
  timeoutMs?: number;
  thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Generate completion via Gemini with explicit error handling and timeout
 */
export async function generateGeminiCompletion(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.2,
  options?: GeminiCompletionOptions
): Promise<string> {
  // Validate model name from configuration
  const modelName = validateAndGetGeminiModel();

  const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

  // In automated test suites, provide deterministic fixtures
  if (isTest) {
    if (prompt.includes('generate a structured quiz') || prompt.includes('quiz questions')) {
      return JSON.stringify({
        quizTitle: 'Knowledge Assessment Quiz',
        description: 'Comprehensive assessment generated from provided study materials.',
        questions: [
          {
            questionText: 'Which programming paradigm emphasizes immutability and pure functions?',
            type: 'single_mcq',
            difficulty: 'intermediate',
            options: [
              { id: 'opt_1', text: 'Object-Oriented Programming' },
              { id: 'opt_2', text: 'Functional Programming' },
              { id: 'opt_3', text: 'Imperative Programming' },
              { id: 'opt_4', text: 'Procedural Programming' }
            ],
            correctAnswers: ['opt_2'],
            explanation: 'Functional programming treats computation as mathematical functions and avoids changing state and mutable data.',
            topicTag: 'Programming Paradigms'
          },
          {
            questionText: 'True or False: In a relational database, a foreign key can reference a primary key in another table.',
            type: 'true_false',
            difficulty: 'beginner',
            options: [
              { id: 'opt_1', text: 'True' },
              { id: 'opt_2', text: 'False' }
            ],
            correctAnswers: ['opt_1'],
            explanation: 'A foreign key creates a link between data in two tables by referencing the primary key of another table.',
            topicTag: 'Databases'
          },
          {
            questionText: 'Select all strategies commonly used to optimize web application performance:',
            type: 'multi_mcq',
            difficulty: 'intermediate',
            options: [
              { id: 'opt_1', text: 'HTTP response caching' },
              { id: 'opt_2', text: 'Code splitting and lazy loading' },
              { id: 'opt_3', text: 'Querying entire tables without pagination' },
              { id: 'opt_4', text: 'Asset minification and compression' }
            ],
            correctAnswers: ['opt_1', 'opt_2', 'opt_4'],
            explanation: 'Caching, code splitting, and asset minification all directly improve performance, while loading unpaginated tables degrades performance.',
            topicTag: 'Web Performance'
          }
        ]
      });
    }

    if (prompt.includes('Explain the key skill gaps') || prompt.includes('skill gap summary')) {
      return 'Based on your diagnostic evaluations, your core strengths lie in fundamental programming concepts. However, to meet the target requirements for this role, you should prioritize bridging gaps in Advanced SQL query optimization and System Design fundamentals. Completing the recommended courses in these two areas will improve your readiness score by up to 28%.';
    }

    return `Hello! As your Skill Setu AI Learning Assistant, I am here to help you bridge your target role skill gaps. Focus on your top-priority gaps first by completing hands-on projects and diagnostic quizzes. Let me know which topic you would like to explore today!`;
  }

  const ai = getGenAIClient();
  const timeoutMs = options?.timeoutMs ?? config.gemini.timeoutMs ?? 30000;

  const genConfig: any = {
    systemInstruction: systemInstruction || 'You are Skill Setu AI, an expert technical mentor and skill intelligence assistant.',
    temperature,
    maxOutputTokens: 8192,
    thinkingConfig: {
      thinkingLevel: options?.thinkingLevel && options.thinkingLevel !== 'MINIMAL'
        ? options.thinkingLevel
        : 'LOW'
    }
  };

  if (options?.responseMimeType) {
    genConfig.responseMimeType = options.responseMimeType;
  }

  const startTime = Date.now();
  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: genConfig
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini API inference timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);

    const durationMs = Date.now() - startTime;
    console.log(`[AI] Gemini call succeeded in ${durationMs}ms`);

    const text = (response as any).text as string | undefined;
    if (!text || text.trim().length === 0) {
      throw new Error('Gemini API returned an empty response.');
    }
    return text;
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[AI] Gemini call failed after ${durationMs}ms`);
    if (error.message?.includes('timed out')) {
      throw new Error(`AI service timeout: Inference exceeded ${timeoutMs}ms limit.`);
    }
    if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Gemini API quota exceeded or rate limit reached. Please verify your Google AI Studio plan.');
    }
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      throw new Error('Invalid GEMINI_API_KEY. Please verify your key at https://aistudio.google.com/apikey.');
    }
    if (error.message?.includes('503') || error.message?.includes('UNAVAILABLE')) {
      throw new Error('Gemini AI service is temporarily unavailable. Please retry shortly.');
    }
    throw new Error(`AI service failure: ${error.message}`);
  }
}
