import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { updateCourseProgress, getLearnerLearningPath } from '../src/controllers/learningPathController';
import { generateLearningPath } from '../src/services/recommendationEngine';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    enrollment: {
      upsert: vi.fn(),
      findMany: vi.fn().mockResolvedValue([])
    },
    learningPath: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    },
    learningPathItem: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn()
    },
    course: {
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([])
    },
    profile: {
      findFirst: vi.fn(),
      findUnique: vi.fn()
    },
    role: {
      findUnique: vi.fn()
    },
    skill: {
      findMany: vi.fn().mockResolvedValue([])
    },
    roleSkillRequirement: {
      findMany: vi.fn().mockResolvedValue([])
    },
    userSkill: {
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn()
    }
  }
}));

describe('BUG 4: Manual Course Addition, Retention, and Gap Flagging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves user-added course as LearningPathItem with source = "manual"', async () => {
    const userId = 'user-manual-test';
    const courseId = 'course-kubernetes-deepdive';

    (prisma.enrollment.upsert as any).mockResolvedValue({
      id: 'enr-1',
      userId,
      courseId,
      status: 'in_progress',
      progressPercent: 10
    });

    // Mock existing learning path without this course
    const mockExistingPath = {
      id: 'lp-existing-1',
      userId,
      targetRoleId: 'role-devops',
      items: [
        { id: 'lpi-1', courseId: 'course-docker-intro', stepOrder: 1, status: 'completed', source: 'system' }
      ]
    };
    (prisma.learningPath.findFirst as any).mockResolvedValue(mockExistingPath);

    (prisma.learningPathItem.create as any).mockImplementation(({ data }: any) => {
      return Promise.resolve({
        id: 'lpi-new-manual',
        ...data
      });
    });

    const req: any = {
      user: { id: userId },
      body: {
        courseId,
        status: 'in_progress',
        progressPercent: 10,
        source: 'manual',
        reason: 'Added manually from course catalogue'
      }
    };

    let responseData: any = null;
    const res: any = {
      json: vi.fn().mockImplementation((d) => {
        responseData = d;
      })
    };

    await updateCourseProgress(req, res);

    expect(prisma.enrollment.upsert).toHaveBeenCalled();
    expect(prisma.learningPathItem.create).toHaveBeenCalled();

    const createCall = (prisma.learningPathItem.create as any).mock.calls[0][0];
    expect(createCall.data.courseId).toBe(courseId);
    expect(createCall.data.source).toBe('manual');
    expect(createCall.data.stepOrder).toBe(2);
    expect(createCall.data.reason).toBe('Added manually from course catalogue');
  });

  it('never deletes manual items during recalculation even when not-started', async () => {
    const userId = 'user-recalc-test';
    const targetRoleId = 'role-da';

    (prisma.role.findUnique as any).mockResolvedValue({
      id: targetRoleId,
      title: 'Data Analyst',
      skillsRequired: [
        { skillId: 'skill-sql', requiredProficiency: 4, weight: 1.5, skill: { id: 'skill-sql', name: 'SQL' } }
      ]
    });

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId,
      targetRoleId
    });

    (prisma.course.findMany as any).mockResolvedValue([
      {
        id: 'course-sql-101',
        title: 'Mastering SQL',
        difficulty: 'Beginner',
        estimatedHours: 10,
        provider: 'freeCodeCamp',
        destinationUrl: 'https://example.com/sql',
        skillsCovered: ['SQL'],
        courseSkills: [{ skillId: 'skill-sql', skill: { id: 'skill-sql', name: 'SQL' } }]
      }
    ]);

    // User path has:
    // 1. A manual course with status 'not_started' and source 'manual'
    // 2. An obsolete system course with status 'not_started' and source 'system'
    const mockManualItem = {
      id: 'lpi-manual-1',
      courseId: 'course-manual-git',
      stepOrder: 2,
      status: 'not_started',
      source: 'manual',
      reason: 'Added manually from course catalogue',
      course: {
        id: 'course-manual-git',
        title: 'Git Version Control',
        difficulty: 'Beginner',
        estimatedHours: 5,
        provider: 'GitHub',
        destinationUrl: 'https://example.com/git',
        skillsCovered: ['Git'],
        courseSkills: []
      }
    };

    const mockObsoleteSystemItem = {
      id: 'lpi-obsolete-system',
      courseId: 'course-obsolete',
      stepOrder: 3,
      status: 'not_started',
      source: 'system',
      reason: 'Old system step',
      course: {
        id: 'course-obsolete',
        title: 'Obsolete Course',
        difficulty: 'Advanced',
        estimatedHours: 20,
        provider: 'OldProvider',
        destinationUrl: 'https://example.com/old',
        skillsCovered: ['Old'],
        courseSkills: []
      }
    };

    const existingPath = {
      id: 'lp-recalc-1',
      userId,
      targetRoleId,
      items: [mockManualItem, mockObsoleteSystemItem]
    };
    (prisma.learningPath.findFirst as any).mockResolvedValue(existingPath);
    (prisma.learningPath.update as any).mockResolvedValue(existingPath);
    (prisma.learningPathItem.delete as any).mockResolvedValue({ id: 'deleted' });
    (prisma.learningPathItem.create as any).mockImplementation(({ data }: any) => Promise.resolve({ id: 'created', ...data, course: data }));
    (prisma.learningPathItem.update as any).mockImplementation(({ data }: any) => Promise.resolve({ id: 'updated', ...data }));

    const gaps = [
      {
        skillId: 'skill-sql',
        skillName: 'SQL',
        domainName: 'Data',
        requiredLevel: 4,
        currentLevel: 1,
        gap: 3,
        priority: 'high' as const,
        weight: 1.5,
        isAssessed: true
      }
    ];

    const result = await generateLearningPath(userId, targetRoleId, gaps);

    // Verify deletion calls: obsolete system item MUST be deleted, but manual item MUST NOT be deleted
    expect(prisma.learningPathItem.delete).toHaveBeenCalledWith({
      where: { id: 'lpi-obsolete-system' }
    });
    expect(prisma.learningPathItem.delete).not.toHaveBeenCalledWith({
      where: { id: 'lpi-manual-1' }
    });

    // Check that the returned courses contain the manual course
    const manualFound = result.courses.find((c) => c.courseId === 'course-manual-git');
    expect(manualFound).toBeDefined();
    expect(manualFound?.source).toBe('manual');
  });

  it('flags isOutsideRoleGaps: true when a course covers skills outside target role requirements', async () => {
    const userId = 'user-outside-test';
    const targetRoleId = 'role-analyst';

    (prisma.profile.findUnique as any).mockResolvedValue({
      userId,
      targetRoleId,
      isOnboarded: true
    });

    // Target role only requires SQL and Data Visualization
    const mockPath = {
      id: 'lp-outside-1',
      userId,
      targetRole: {
        id: targetRoleId,
        title: 'Data Analyst',
        skillsRequired: [
          { skillId: 'skill-sql', skill: { id: 'skill-sql', name: 'SQL & Database Modeling' } },
          { skillId: 'skill-vis', skill: { id: 'skill-vis', name: 'Data Visualization' } }
        ]
      },
      items: [
        {
          id: 'lpi-1',
          courseId: 'course-sql-101',
          stepOrder: 1,
          status: 'completed',
          source: 'system',
          reason: 'Matches role',
          course: {
            id: 'course-sql-101',
            title: 'SQL Fundamentals',
            courseSkills: [{ skillId: 'skill-sql', skill: { id: 'skill-sql', name: 'SQL & Database Modeling' } }],
            skillsCovered: ['SQL']
          }
        },
        {
          id: 'lpi-2',
          courseId: 'course-rust-adv',
          stepOrder: 2,
          status: 'in_progress',
          source: 'manual',
          reason: 'Added manually from course catalogue',
          course: {
            id: 'course-rust-adv',
            title: 'Advanced Rust Systems Programming',
            courseSkills: [{ skillId: 'skill-rust', skill: { id: 'skill-rust', name: 'Rust' } }],
            skillsCovered: ['Rust Systems']
          }
        }
      ]
    };

    (prisma.learningPath.findFirst as any).mockResolvedValue(mockPath);

    const req: any = { user: { id: userId } };
    let responseData: any = null;
    const res: any = {
      json: vi.fn().mockImplementation((d) => {
        responseData = d;
      })
    };

    await getLearnerLearningPath(req, res);

    expect(responseData.courses).toHaveLength(2);

    const sqlCourse = responseData.courses.find((c: any) => c.courseId === 'course-sql-101');
    expect(sqlCourse.isOutsideRoleGaps).toBe(false);
    expect(sqlCourse.source).toBe('system');

    const rustCourse = responseData.courses.find((c: any) => c.courseId === 'course-rust-adv');
    expect(rustCourse.isOutsideRoleGaps).toBe(true);
    expect(rustCourse.source).toBe('manual');
  });
});
