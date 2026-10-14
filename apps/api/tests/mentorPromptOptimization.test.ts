import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMentorSystemInstruction } from '../src/controllers/assistantController';

describe('BUG 3: AI Mentor System Prompt & Constraints', () => {
  const mockGaps = [
    { skillName: 'React & Modern Frontend', currentLevel: 2, requiredProficiency: 4 },
    { skillName: 'TypeScript & JavaScript', currentLevel: 1, requiredProficiency: 4 },
    { skillName: 'SQL & Database Modeling', currentLevel: 2, requiredProficiency: 3 },
    { skillName: 'Docker & Containers', currentLevel: 1, requiredProficiency: 2 } // 4th gap, should be excluded from top 3
  ];

  it('builds a system prompt that includes the top 3 gaps and current levels from profile', () => {
    const instruction = buildMentorSystemInstruction({
      roleTitle: 'Full-Stack Developer',
      readinessScore: 45,
      topGaps: mockGaps,
      preferredLanguage: 'en'
    });

    expect(instruction).toContain('Full-Stack Developer');
    expect(instruction).toContain('45%');
    expect(instruction).toContain('React & Modern Frontend (Current: 2/5, Required: 4/5)');
    expect(instruction).toContain('TypeScript & JavaScript (Current: 1/5, Required: 4/5)');
    expect(instruction).toContain('SQL & Database Modeling (Current: 2/5, Required: 3/5)');
    // 4th gap must not be in top 3
    expect(instruction).not.toContain('Docker & Containers');
  });

  it('strictly enforces max 150 words constraint in prompt rules', () => {
    const instruction = buildMentorSystemInstruction({
      roleTitle: 'Data Analyst',
      readinessScore: 60,
      topGaps: mockGaps,
      preferredLanguage: 'en'
    });

    expect(instruction).toContain('150 words or fewer');
  });

  it('instructs the mentor to provide exactly 1 concrete next step', () => {
    const instruction = buildMentorSystemInstruction({
      roleTitle: 'Data Analyst',
      readinessScore: null,
      topGaps: [],
      preferredLanguage: 'en'
    });

    expect(instruction).toContain('Provide exactly ONE concrete, actionable next step');
  });

  it('instructs the mentor to ask AT MOST ONE follow-up question', () => {
    const instruction = buildMentorSystemInstruction({
      roleTitle: 'Data Analyst',
      readinessScore: null,
      topGaps: [],
      preferredLanguage: 'en'
    });

    expect(instruction).toContain('Ask AT MOST ONE relevant follow-up question');
  });

  it('instructs the mentor to NEVER provide full roadmaps unless explicitly asked', () => {
    const instruction = buildMentorSystemInstruction({
      roleTitle: 'Cloud Engineer',
      readinessScore: 70,
      topGaps: mockGaps,
      preferredLanguage: 'en'
    });

    expect(instruction).toContain('NEVER provide a full learning roadmap');
    expect(instruction).toContain('unless the learner explicitly asks for a roadmap');
  });

  it('handles empty gaps gracefully with diagnostic prompt', () => {
    const instruction = buildMentorSystemInstruction({
      roleTitle: 'AI Engineer',
      readinessScore: null,
      topGaps: [],
      preferredLanguage: 'hi'
    });

    expect(instruction).toContain('No assessed gaps yet, take the diagnostic');
    expect(instruction).toContain('Hindi or Hinglish');
  });
});
