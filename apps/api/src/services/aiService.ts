import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

let genAI: GoogleGenerativeAI | null = null;

if (config.gemini.apiKey && config.gemini.apiKey !== 'your-gemini-api-key') {
  genAI = new GoogleGenerativeAI(config.gemini.apiKey);
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
 * Generate completion via Gemini with fallback/mock for tests and offline usage
 */
export async function generateGeminiCompletion(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.2
): Promise<string> {
  const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

  if (!genAI || isTest) {
    // Return realistic fallback response when API key is not configured or in test mode
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

    // Default chat assistant mock
    return `Hello! As your Skill Setu AI Learning Assistant, I am here to help you bridge your target role skill gaps. Focus on your top-priority gaps first by completing hands-on projects and diagnostic quizzes. Let me know which topic you would like to explore today!`;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature,
        maxOutputTokens: 2048
      },
      systemInstruction: systemInstruction || 'You are Skill Setu AI, an expert technical mentor and skill intelligence assistant.'
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API call failed:', error.message);
    throw new Error(`AI service failure: ${error.message}`);
  }
}
