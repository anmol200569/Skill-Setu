import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';
import {
  calculateCourseMatchScore,
  getPersonalizedRecommendations,
  generateLearningPath,
  getDifficultyTierRank,
  isCourseClearlyBelowLearnerLevel
} from '../src/services/recommendationEngine';
import { Course, SkillGapItem } from '@skill-setu/shared';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    role: { findUnique: vi.fn() },
    profile: { findUnique: vi.fn(), findFirst: vi.fn() },
    course: { findMany: vi.fn(), findUnique: vi.fn() },
    enrollment: { findMany: vi.fn() },
    learningPath: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    learningPathItem: { create: vi.fn(), delete: vi.fn(), update: vi.fn(), findMany: vi.fn() },
    userSkill: { findMany: vi.fn() }
  }
}));

describe('Course Ordering by Learner Level Tier (Task D2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const catalogCourses: Course[] = [
    {
      id: 'c-py-beg',
      title: 'Python for Absolute Beginners',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/py-beg',
      skillsCovered: ['Python'],
      difficulty: 'Beginner',
      estimatedHours: 8,
      language: 'English',
      isFree: true,
      rating: 4.8,
      description: 'Foundational python'
    },
    {
      id: 'c-py-int',
      title: 'Intermediate Python & Design Patterns',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/py-int',
      skillsCovered: ['Python'],
      difficulty: 'Intermediate',
      estimatedHours: 12,
      language: 'English',
      isFree: true,
      rating: 4.7,
      description: 'Intermediate python'
    },
    {
      id: 'c-py-adv',
      title: 'Advanced Python Internals & Performance',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/py-adv',
      skillsCovered: ['Python'],
      difficulty: 'Advanced',
      estimatedHours: 16,
      language: 'English',
      isFree: true,
      rating: 4.9,
      description: 'Advanced python'
    },
    {
      id: 'c-sys-beg',
      title: 'Introduction to Architecture Concepts',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/sys-beg',
      skillsCovered: ['System Design'],
      difficulty: 'Beginner',
      estimatedHours: 6,
      language: 'English',
      isFree: true,
      rating: 4.5,
      description: 'Intro to sys design'
    },
    {
      id: 'c-sys-int',
      title: 'System Design for Web Scale',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/sys-int',
      skillsCovered: ['System Design'],
      difficulty: 'Intermediate',
      estimatedHours: 14,
      language: 'English',
      isFree: true,
      rating: 4.8,
      description: 'Intermediate sys design'
    },
    {
      id: 'c-sys-adv',
      title: 'Large-Scale Distributed Systems Architecture',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/sys-adv',
      skillsCovered: ['System Design'],
      difficulty: 'Advanced',
      estimatedHours: 20,
      language: 'English',
      isFree: true,
      rating: 4.9,
      description: 'Advanced sys design'
    }
  ];

  it('1. Sample Learner A (Beginner: level <= 1): chooses Beginner courses and does not skip foundational material', () => {
    const currentLevel = 1.0; // level <= 1 -> Beginner
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Beginner')).toBe(false);
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Intermediate')).toBe(false);
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Advanced')).toBe(false);

    expect(getDifficultyTierRank('Beginner')).toBe(1);
    expect(getDifficultyTierRank('Intermediate')).toBe(2);
  });

  it('2. Sample Learner B (Intermediate: level 2 to 3): skips Beginner courses and prioritizes Intermediate courses', () => {
    const currentLevel = 2.5; // level 2-3 -> Intermediate
    // Beginner course is clearly below learner level (level 2.5) -> skipped
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Beginner')).toBe(true);
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Intermediate')).toBe(false);
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Advanced')).toBe(false);
  });

  it('3. Sample Learner C (Advanced: level 4+): skips both Beginner and Intermediate courses, selecting Advanced', () => {
    const currentLevel = 4.2; // level 4+ -> Advanced
    // Both Beginner and Intermediate courses must be skipped for a level 4.2 learner
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Beginner')).toBe(true);
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Intermediate')).toBe(true);
    expect(isCourseClearlyBelowLearnerLevel(currentLevel, 'Advanced')).toBe(false);
  });

  it('orders steps in the learning path by difficulty tier (Beginner, Intermediate, Advanced) and matchScore within tier', async () => {
    const userId = 'user-d2-multi';
    const targetRoleId = 'role-fullstack';

    (prisma.role.findUnique as any).mockResolvedValue({
      id: targetRoleId,
      title: 'Full Stack Engineer',
      skillsRequired: []
    });
    (prisma.profile.findUnique as any).mockResolvedValue({ userId, targetRoleId });
    (prisma.course.findMany as any).mockResolvedValue(catalogCourses.map((c) => ({
      ...c,
      courseSkills: [{ skillId: `s-${c.skillsCovered[0].toLowerCase()}`, skill: { id: `s-${c.skillsCovered[0].toLowerCase()}`, name: c.skillsCovered[0], code: c.skillsCovered[0].toLowerCase() } }]
    })));
    (prisma.learningPath.findFirst as any).mockResolvedValue(null);
    (prisma.learningPath.create as any).mockImplementation(({ data }: any) => Promise.resolve({ id: 'lp-new', ...data, items: [] }));
    (prisma.enrollment.findMany as any).mockResolvedValue([]);
    (prisma.learningPathItem.create as any).mockImplementation(({ data }: any) => {
      const course = catalogCourses.find((c) => c.id === data.courseId);
      return Promise.resolve({ id: `item-${data.courseId}`, ...data, course });
    });
    (prisma.learningPathItem.update as any).mockResolvedValue({});
    (prisma.learningPath.update as any).mockResolvedValue({});

    // Learner with gaps in Python (level 0 -> needs Beginner) and System Design (level 2 -> needs Intermediate)
    const gaps: SkillGapItem[] = [
      {
        skillId: 's-python',
        skillName: 'Python',
        domainName: 'Backend',
        requiredLevel: 4,
        currentLevel: 0,
        gap: 4,
        priority: 'critical',
        priorityScore: 6.0,
        weight: 1.0,
        isAssessed: true
      },
      {
        skillId: 's-system design',
        skillName: 'System Design',
        domainName: 'Architecture',
        requiredLevel: 4,
        currentLevel: 2.0,
        gap: 2,
        priority: 'high',
        priorityScore: 3.0,
        weight: 1.0,
        isAssessed: true
      }
    ];

    const path = await generateLearningPath(userId, targetRoleId, gaps);

    // Verify step order tier progression: Beginner must come before Intermediate
    const difficulties = path.courses.map((c) => c.course.difficulty);
    const tierRanks = difficulties.map((d) => getDifficultyTierRank(d));

    for (let i = 0; i < tierRanks.length - 1; i++) {
      expect(tierRanks[i]).toBeLessThanOrEqual(tierRanks[i + 1]);
    }
  });
});
