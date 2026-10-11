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

    expect(score).toBeGreaterThanOrEqual(70);
    expect(matchedGap?.skillId).toBe('ts-js');
    expect(reason).toContain('TypeScript & JavaScript');
  });

  it('applies preference boosts for free status and high ratings', () => {
    const freeRated = calculateCourseMatchScore(sampleCourse, sampleGaps);
    const paidCourse: Course = { ...sampleCourse, isFree: false, rating: 4.0 };
    const paidResult = calculateCourseMatchScore(paidCourse, sampleGaps);

    expect(freeRated.score).toBeGreaterThan(paidResult.score);
  });
});
