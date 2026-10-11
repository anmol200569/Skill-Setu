import { describe, it, expect } from 'vitest';
import { aiGeneratedQuizOutputSchema } from '@skill-setu/shared';

describe('AI Quiz Generation Schema Validation', () => {
  it('successfully validates well-formed quiz JSON from AI model', () => {
    const validJson = {
      quizTitle: 'Advanced SQL Window Functions',
      description: 'Practice quiz covering analytical ranking and window clauses.',
      questions: [
        {
          questionText: 'What is the main distinction between RANK() and DENSE_RANK() in SQL?',
          type: 'single_mcq',
          difficulty: 'intermediate',
          options: [
            { id: 'opt1', text: 'RANK() skips numbers on ties; DENSE_RANK() does not.' },
            { id: 'opt2', text: 'DENSE_RANK() is only supported in SQLite.' }
          ],
          correctAnswers: ['opt1'],
          explanation: 'RANK leaves numerical gaps when duplicates occur; DENSE_RANK maintains contiguous numbering.',
          topicTag: 'Window Functions'
        }
      ]
    };

    const parsed = aiGeneratedQuizOutputSchema.safeParse(validJson);
    expect(parsed.success).toBe(true);
  });

  it('rejects malformed quiz JSON with missing options or invalid question types', () => {
    const invalidJson = {
      quizTitle: 'Invalid Quiz',
      description: 'Incomplete question set',
      questions: [
        {
          questionText: 'Short',
          type: 'invalid_type', // Must be single_mcq, multi_mcq, or true_false
          difficulty: 'intermediate',
          options: [{ id: 'opt1', text: 'Only one option' }], // Needs at least 2 options
          correctAnswers: [],
          explanation: 'None',
          topicTag: 'SQL'
        }
      ]
    };

    const parsed = aiGeneratedQuizOutputSchema.safeParse(invalidJson);
    expect(parsed.success).toBe(false);
  });
});
