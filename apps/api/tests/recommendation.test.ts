import { describe, it, expect } from 'vitest';
import { calculateCourseMatchScore } from '../src/services/recommendationEngine';
import { Course, SkillGapItem } from '@skill-setu/shared';

describe('Course Recommendation Scoring Engine', () => {
  const sampleGaps: SkillGapItem[] = [
    {
      skillId: 'ts-js',
      skillName: 'TypeScript & JavaScript',
      domainName: 'Programming & Software Development',
      requiredLevel: 4,
      currentLevel: 2,
      gap: 2,
      priority: 'critical',
      priorityScore: 9,
      weight: 1.5
    },
    {
      skillId: 'sys-design',
      skillName: 'System Design & Scalability',
      domainName: 'Architecture',
      requiredLevel: 3,
      currentLevel: 1.5,
      gap: 1.5,
      priority: 'high',
      priorityScore: 4.5,
      weight: 1.0
    }
  ];

  const sampleCourse: Course = {
    id: 'ts-handbook',
    title: 'TypeScript in 50 Lessons',
    provider: 'freeCodeCamp',
    destinationUrl: 'https://freecodecamp.org/learn',
    skillsCovered: ['ts-js'],
    difficulty: 'Intermediate',
    estimatedHours: 12,
    language: 'English',
    isFree: true,
    rating: 4.8,
    ratingSource: 'freeCodeCamp',
    description: 'Comprehensive guide to TypeScript'
  };

  it('allocates high match score when course bridges critical priority gap', () => {
    const { score, matchedGap, reason } = calculateCourseMatchScore(sampleCourse, sampleGaps, {
      preferredLanguage: 'en',
      weeklyStudyHours: 10
    });

    // Real coverage: ts-js weighted gap (2 * 1.5 = 3) / total weighted gap (3 + 1.5 = 4.5) = 67%
    expect(score).toBe(67);
    expect(matchedGap?.skillId).toBe('ts-js');
    expect(reason).toContain('TypeScript & JavaScript');
  });

  it('computes 0 match score when course does not cover any user gaps', () => {
    const unrelatedCourse: Course = {
      ...sampleCourse,
      id: 'rust-intro',
      title: 'Intro to Rust',
      skillsCovered: ['rust-lang']
    };
    const result = calculateCourseMatchScore(unrelatedCourse, sampleGaps);

    expect(result.score).toBe(0);
    expect(result.matchedGap).toBeNull();
  });
});
