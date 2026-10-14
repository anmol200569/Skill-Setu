import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';
import { updateCourseProgress } from '../src/controllers/learningPathController';

vi.mock('../src/lib/prisma', () => ({
  prisma: {
    enrollment: {
      upsert: vi.fn()
    },
    learningPathItem: {
      updateMany: vi.fn()
    },
    course: {
      findUnique: vi.fn()
    },
    skill: {
      findMany: vi.fn()
    },
    profile: {
      findFirst: vi.fn()
    },
    roleSkillRequirement: {
      findMany: vi.fn()
    },
    userSkill: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    }
  }
}));

describe('Course Completion Skill Progress (Task C2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('raises selfAssessedLevel by +1, respects role required level cap, never touches verifiedScore, and flags confirmation', async () => {
    const userId = 'user-c2-test';
    const courseId = 'course-react-adv';

    // Mock enrollment upsert & path item update
    (prisma.enrollment.upsert as any).mockResolvedValue({
      id: 'enr-1',
      userId,
      courseId,
      status: 'completed',
      progressPercent: 100
    });
    (prisma.learningPathItem.updateMany as any).mockResolvedValue({ count: 1 });

    // Course covers s1 (React) and s2 (Redux)
    (prisma.course.findUnique as any).mockResolvedValue({
      id: courseId,
      title: 'Advanced React & State',
      skillsCovered: ['s1'],
      courseSkills: [
        { courseId, skillId: 's1', skill: { id: 's1', name: 'React' } },
        { courseId, skillId: 's2', skill: { id: 's2', name: 'Redux' } }
      ]
    });
    (prisma.skill.findMany as any).mockResolvedValue([]);

    // Learner target role requires s1 at level 4, and s2 at level 2
    (prisma.profile.findFirst as any).mockResolvedValue({
      userId,
      targetRoleId: 'role-frontend'
    });
    (prisma.roleSkillRequirement.findMany as any).mockResolvedValue([
      { roleId: 'role-frontend', skillId: 's1', requiredProficiency: 4 },
      { roleId: 'role-frontend', skillId: 's2', requiredProficiency: 2 }
    ]);

    // Current user skills:
    // s1: self 2, verified 3 -> can bump to 3 (< cap 4)
    // s2: self 2, verified null -> already at role requirement cap 2 -> stays 2
    (prisma.userSkill.findUnique as any).mockImplementation(({ where }: any) => {
      if (where.userId_skillId.skillId === 's1') {
        return Promise.resolve({
          id: 'us-1',
          userId,
          skillId: 's1',
          selfAssessedLevel: 2,
          verifiedScore: 3,
          effectiveScore: 2.6
        });
      }
      if (where.userId_skillId.skillId === 's2') {
        return Promise.resolve({
          id: 'us-2',
          userId,
          skillId: 's2',
          selfAssessedLevel: 2,
          verifiedScore: null,
          effectiveScore: 2.0
        });
      }
      return Promise.resolve(null);
    });

    (prisma.userSkill.upsert as any).mockImplementation(({ where, update, create }: any) => {
      return Promise.resolve({
        id: 'us-upserted',
        userId,
        skillId: where.userId_skillId.skillId,
        selfAssessedLevel: update?.selfAssessedLevel ?? create?.selfAssessedLevel,
        verifiedScore: where.userId_skillId.skillId === 's1' ? 3 : null
      });
    });

    const req: any = {
      user: { id: userId },
      body: { courseId, status: 'completed' }
    };

    let responseData: any = null;
    const res: any = {
      json: vi.fn().mockImplementation((data) => {
        responseData = data;
      })
    };

    await updateCourseProgress(req, res);

    expect(res.json).toHaveBeenCalled();
    expect(responseData.message).toBe('Progress updated');
    expect(responseData.confirmationNotice).toBe('Retake the diagnostic to confirm');

    // s1 was self 2 -> bumped to 3 (<= cap 4)
    const s1Update = (prisma.userSkill.upsert as any).mock.calls.find(
      (c: any) => c[0].where.userId_skillId.skillId === 's1'
    );
    expect(s1Update).toBeDefined();
    expect(s1Update[0].update.selfAssessedLevel).toBe(3);
    // verifiedScore was NOT modified in the update payload
    expect(s1Update[0].update.verifiedScore).toBeUndefined();

    // s2 was self 2 -> capped at role requirement (2), does not exceed 2
    const s2Update = (prisma.userSkill.upsert as any).mock.calls.find(
      (c: any) => c[0].where.userId_skillId.skillId === 's2'
    );
    expect(s2Update).toBeDefined();
    expect(s2Update[0].update.selfAssessedLevel).toBe(2);

    // Each updated skill has message "Retake the diagnostic to confirm"
    for (const item of responseData.updatedSkills) {
      expect(item.needsConfirmation).toBe(true);
      expect(item.message).toBe('Retake the diagnostic to confirm');
    }
  });
});
