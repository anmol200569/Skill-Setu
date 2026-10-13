import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateCourseMatchScore,
  getPersonalizedRecommendations
} from '../src/services/recommendationEngine';
import { prisma } from '../src/lib/prisma';
import { Course, SkillGapItem } from '@skill-setu/shared';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn()
    },
    role: {
      findUnique: vi.fn()
    },
    course: {
      findMany: vi.fn()
    }
  }
}));

describe('Course Recommendation Scoring Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('recommends foundational courses for unassessed required skills', () => {
    const unassessedGap: SkillGapItem = {
      skillId: 'adv-sql',
      skillName: 'Advanced SQL & Query Optimization',
      domainName: 'Databases',
      requiredLevel: 3,
      currentLevel: null,
      gap: 3,
      priority: 'high',
      priorityScore: 4.5,
      weight: 1.5,
      isAssessed: false
    };

    const sqlCourse: Course = {
      ...sampleCourse,
      id: 'cs50-sql',
      title: "CS50's Introduction to Databases with SQL",
      skillsCovered: ['adv-sql']
    };

    const { score, matchedGap, reason } = calculateCourseMatchScore(sqlCourse, [unassessedGap]);
    expect(score).toBe(100);
    expect(matchedGap?.skillId).toBe('adv-sql');
    expect(reason).toContain('Foundational course recommended to build Advanced SQL & Query Optimization');
  });

  describe('Path generation for new, partially assessed, and fully assessed users', () => {
    const mockRole = {
      id: 'role-ba',
      title: 'Business Analyst',
      skillsRequired: [
        {
          skillId: 'skill-sql',
          requiredProficiency: 3,
          priority: 'high',
          weight: 1.4,
          skill: { id: 'skill-sql', code: 'adv-sql', name: 'Advanced SQL' }
        },
        {
          skillId: 'skill-comm',
          requiredProficiency: 4,
          priority: 'critical',
          weight: 1.5,
          skill: { id: 'skill-comm', code: 'stakeholder-mgt', name: 'Stakeholder Communication' }
        }
      ]
    };

    const mockCatalogCourses = [
      {
        id: 'course-sql-1',
        title: 'Mastering SQL for Analysis',
        provider: 'freeCodeCamp',
        destinationUrl: 'https://example.com/sql',
        skillsCovered: ['skill-sql'],
        difficulty: 'Beginner',
        estimatedHours: 15,
        language: 'English',
        isFree: true,
        rating: 4.9,
        ratingSource: 'freeCodeCamp',
        description: 'SQL track',
        courseSkills: [
          { skillId: 'skill-sql', skill: { id: 'skill-sql', code: 'adv-sql', name: 'Advanced SQL' } }
        ]
      },
      {
        id: 'course-comm-1',
        title: 'Executive Stakeholder Communication',
        provider: 'Google Cloud',
        destinationUrl: 'https://example.com/comm',
        skillsCovered: ['skill-comm'],
        difficulty: 'Intermediate',
        estimatedHours: 10,
        language: 'English',
        isFree: true,
        rating: 4.7,
        ratingSource: 'Google Cloud',
        description: 'Communication track',
        courseSkills: [
          { skillId: 'skill-comm', skill: { id: 'skill-comm', code: 'stakeholder-mgt', name: 'Stakeholder Communication' } }
        ]
      }
    ];

    it('generates foundational course recommendations for a brand-new user with 0 assessments', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({
        userId: 'user-new',
        targetRoleId: 'role-ba',
        preferredLanguage: 'en',
        weeklyStudyHours: 10
      });
      (prisma.role.findUnique as any).mockResolvedValue(mockRole);
      (prisma.course.findMany as any).mockResolvedValue(mockCatalogCourses);

      // New user: 0 assessed gaps
      const recs = await getPersonalizedRecommendations('user-new', []);

      expect(recs.length).toBeGreaterThanOrEqual(1);
      // Both unassessed role skills should be recommended
      const recommendedTitles = recs.map((r) => r.course.title);
      expect(recommendedTitles).toContain('Executive Stakeholder Communication');
      expect(recommendedTitles).toContain('Mastering SQL for Analysis');
      // Reasons should state foundational recommendation
      expect(recs[0].recommendationReason).toContain('Foundational course recommended');
    });

    it('generates recommendations for a partially assessed user combining assessed gaps and unassessed skills', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({
        userId: 'user-partial',
        targetRoleId: 'role-ba',
        preferredLanguage: 'en',
        weeklyStudyHours: 10
      });
      (prisma.role.findUnique as any).mockResolvedValue(mockRole);
      (prisma.course.findMany as any).mockResolvedValue(mockCatalogCourses);

      // 1 assessed gap (Advanced SQL: current 1.5, req 3.0, deficit 1.5)
      const assessedGaps: SkillGapItem[] = [
        {
          skillId: 'skill-sql',
          skillName: 'Advanced SQL',
          domainName: 'Databases',
          requiredLevel: 3,
          currentLevel: 1.5,
          gap: 1.5,
          priority: 'high',
          priorityScore: 3.15,
          weight: 1.4,
          isAssessed: true
        }
      ];

      const recs = await getPersonalizedRecommendations('user-partial', assessedGaps);

      expect(recs.length).toBe(2);
      // Contains both the assessed SQL gap course and unassessed communication course
      const gapsAddressed = recs.map((r) => r.gapAddressed);
      expect(gapsAddressed).toContain('Advanced SQL');
      expect(gapsAddressed).toContain('Stakeholder Communication');
    });

    it('generates prioritized recommendations for a fully assessed user', async () => {
      (prisma.profile.findUnique as any).mockResolvedValue({
        userId: 'user-full',
        targetRoleId: 'role-ba',
        preferredLanguage: 'en',
        weeklyStudyHours: 10
      });
      (prisma.role.findUnique as any).mockResolvedValue(mockRole);
      (prisma.course.findMany as any).mockResolvedValue(mockCatalogCourses);

      // Both skills assessed
      const assessedGaps: SkillGapItem[] = [
        {
          skillId: 'skill-comm',
          skillName: 'Stakeholder Communication',
          domainName: 'Soft Skills',
          requiredLevel: 4,
          currentLevel: 1.0,
          gap: 3.0,
          priority: 'critical',
          priorityScore: 6.75,
          weight: 1.5,
          isAssessed: true
        },
        {
          skillId: 'skill-sql',
          skillName: 'Advanced SQL',
          domainName: 'Databases',
          requiredLevel: 3,
          currentLevel: 2.5,
          gap: 0.5,
          priority: 'high',
          priorityScore: 0.875,
          weight: 1.4,
          isAssessed: true
        }
      ];

      const recs = await getPersonalizedRecommendations('user-full', assessedGaps);

      expect(recs.length).toBe(2);
      // Higher deficit / priority course is ranked first
      expect(recs[0].course.title).toBe('Executive Stakeholder Communication');
    });
  });
});
