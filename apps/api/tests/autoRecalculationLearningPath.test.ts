import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { generateLearningPath, autoRecalculateLearningPath } from '../src/services/recommendationEngine';
import { SkillGapItem } from '@skill-setu/shared';

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

describe('Auto Recalculation of Learning Path (Task C4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleRole = {
    id: 'role-devops',
    title: 'DevOps Engineer',
    skillsRequired: []
  };

  const sampleCourses = [
    {
      id: 'c-docker',
      title: 'Docker Deep Dive',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/docker',
      skillsCovered: ['Containers & Docker'],
      difficulty: 'Beginner',
      estimatedHours: 10,
      language: 'English',
      isFree: true,
      rating: 4.8,
      courseSkills: [{ skillId: 's-docker', skill: { id: 's-docker', name: 'Containers & Docker', code: 'docker' } }]
    },
    {
      id: 'c-k8s',
      title: 'Kubernetes in Action',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/k8s',
      skillsCovered: ['Kubernetes'],
      difficulty: 'Intermediate',
      estimatedHours: 15,
      language: 'English',
      isFree: true,
      rating: 4.9,
      courseSkills: [{ skillId: 's-k8s', skill: { id: 's-k8s', name: 'Kubernetes', code: 'k8s' } }]
    },
    {
      id: 'c-ci-cd',
      title: 'CI/CD Pipelines with GitHub Actions',
      provider: 'freeCodeCamp',
      destinationUrl: 'https://example.com/cicd',
      skillsCovered: ['CI/CD'],
      difficulty: 'Intermediate',
      estimatedHours: 8,
      language: 'English',
      isFree: true,
      rating: 4.7,
      courseSkills: [{ skillId: 's-cicd', skill: { id: 's-cicd', name: 'CI/CD', code: 'cicd' } }]
    }
  ];

  it('completed and in-progress items survive regeneration without deletion or status reset', async () => {
    const userId = 'user-c4-1';
    const targetRoleId = 'role-devops';

    (prisma.role.findUnique as any).mockResolvedValue(sampleRole);
    (prisma.profile.findUnique as any).mockResolvedValue({ userId, targetRoleId });
    (prisma.course.findMany as any).mockResolvedValue(sampleCourses);

    // Existing learning path has c-docker (completed) and c-k8s (in_progress)
    const existingItems = [
      {
        id: 'item-docker',
        learningPathId: 'path-1',
        courseId: 'c-docker',
        stepOrder: 1,
        status: 'completed',
        reason: 'Docker requirement',
        course: sampleCourses[0]
      },
      {
        id: 'item-k8s',
        learningPathId: 'path-1',
        courseId: 'c-k8s',
        stepOrder: 2,
        status: 'in_progress',
        reason: 'K8s requirement',
        course: sampleCourses[1]
      }
    ];

    (prisma.learningPath.findFirst as any).mockResolvedValue({
      id: 'path-1',
      userId,
      targetRoleId,
      totalEstimatedHours: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: existingItems
    });

    (prisma.enrollment.findMany as any).mockResolvedValue([
      { userId, courseId: 'c-docker', status: 'completed', progressPercent: 100 },
      { userId, courseId: 'c-k8s', status: 'in_progress', progressPercent: 50 }
    ]);

    const gaps: SkillGapItem[] = [
      {
        skillId: 's-k8s',
        skillName: 'Kubernetes',
        domainName: 'DevOps',
        requiredLevel: 4,
        currentLevel: 2,
        gap: 2,
        priority: 'high',
        priorityScore: 3.0,
        weight: 1.0,
        isAssessed: true
      }
    ];

    const result = await generateLearningPath(userId, targetRoleId, gaps);

    // Assert: completed and in-progress items were NOT deleted
    expect(prisma.learningPathItem.delete).not.toHaveBeenCalled();

    // The courses in result must preserve status & progress
    const dockerItem = result.courses.find((c) => c.courseId === 'c-docker');
    const k8sItem = result.courses.find((c) => c.courseId === 'c-k8s');

    expect(dockerItem).toBeDefined();
    expect(dockerItem?.status).toBe('completed');
    expect(dockerItem?.progressPercent).toBe(100);

    expect(k8sItem).toBeDefined();
    expect(k8sItem?.status).toBe('in_progress');
    expect(k8sItem?.progressPercent).toBe(50);
  });

  it('new gaps add new steps to the learning path while renumbering stepOrder 1..N', async () => {
    const userId = 'user-c4-2';
    const targetRoleId = 'role-devops';

    (prisma.role.findUnique as any).mockResolvedValue(sampleRole);
    (prisma.profile.findUnique as any).mockResolvedValue({ userId, targetRoleId });
    (prisma.course.findMany as any).mockResolvedValue(sampleCourses);

    // Existing learning path has c-docker (completed)
    const existingItems = [
      {
        id: 'item-docker',
        learningPathId: 'path-2',
        courseId: 'c-docker',
        stepOrder: 1,
        status: 'completed',
        reason: 'Docker foundation',
        course: sampleCourses[0]
      }
    ];

    (prisma.learningPath.findFirst as any).mockResolvedValue({
      id: 'path-2',
      userId,
      targetRoleId,
      totalEstimatedHours: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: existingItems
    });

    (prisma.enrollment.findMany as any).mockResolvedValue([
      { userId, courseId: 'c-docker', status: 'completed', progressPercent: 100 }
    ]);

    (prisma.learningPathItem.create as any).mockImplementation(({ data }: any) => {
      const course = sampleCourses.find((c) => c.id === data.courseId);
      return Promise.resolve({
        id: `item-new-${data.courseId}`,
        ...data,
        course
      });
    });

    // Now a new gap in CI/CD is added
    const gaps: SkillGapItem[] = [
      {
        skillId: 's-cicd',
        skillName: 'CI/CD',
        domainName: 'DevOps',
        requiredLevel: 4,
        currentLevel: 1,
        gap: 3,
        priority: 'critical',
        priorityScore: 4.5,
        weight: 1.0,
        isAssessed: true
      }
    ];

    const result = await generateLearningPath(userId, targetRoleId, gaps);

    // New step was added for CI/CD
    expect(prisma.learningPathItem.create).toHaveBeenCalled();
    const createdCall = (prisma.learningPathItem.create as any).mock.calls.find(
      (c: any) => c[0].data.courseId === 'c-ci-cd'
    );
    expect(createdCall).toBeDefined();

    // Steps must be numbered consecutively 1..N
    const steps = result.courses.map((c) => c.step);
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i]).toBe(i + 1);
    }
  });

  it('regeneration is idempotent when called repeatedly with the same gaps and progress', async () => {
    const userId = 'user-c4-3';
    const targetRoleId = 'role-devops';

    (prisma.role.findUnique as any).mockResolvedValue(sampleRole);
    (prisma.profile.findUnique as any).mockResolvedValue({ userId, targetRoleId });
    (prisma.course.findMany as any).mockResolvedValue(sampleCourses);

    const existingItems = [
      {
        id: 'item-docker',
        learningPathId: 'path-3',
        courseId: 'c-docker',
        stepOrder: 1,
        status: 'completed',
        reason: 'Docker foundation',
        course: sampleCourses[0]
      },
      {
        id: 'item-k8s',
        learningPathId: 'path-3',
        courseId: 'c-k8s',
        stepOrder: 2,
        status: 'not_started',
        reason: 'K8s requirement',
        course: sampleCourses[1]
      }
    ];

    (prisma.learningPath.findFirst as any).mockResolvedValue({
      id: 'path-3',
      userId,
      targetRoleId,
      totalEstimatedHours: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: existingItems
    });

    (prisma.enrollment.findMany as any).mockResolvedValue([
      { userId, courseId: 'c-docker', status: 'completed', progressPercent: 100 }
    ]);

    const gaps: SkillGapItem[] = [
      {
        skillId: 's-k8s',
        skillName: 'Kubernetes',
        domainName: 'DevOps',
        requiredLevel: 4,
        currentLevel: 2,
        gap: 2,
        priority: 'high',
        priorityScore: 3.0,
        weight: 1.0,
        isAssessed: true
      }
    ];

    const run1 = await generateLearningPath(userId, targetRoleId, gaps);
    const run2 = await generateLearningPath(userId, targetRoleId, gaps);

    expect(run1.courses.length).toBe(run2.courses.length);
    expect(run1.courses.map((c) => c.courseId)).toEqual(run2.courses.map((c) => c.courseId));
    expect(run1.courses.map((c) => c.step)).toEqual(run2.courses.map((c) => c.step));
    expect(run1.totalEstimatedHours).toBe(run2.totalEstimatedHours);
  });
});
