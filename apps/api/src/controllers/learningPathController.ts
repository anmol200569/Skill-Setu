import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { analyzeLearnerSkillGaps } from '../services/gapAnalysisEngine';
import { generateLearningPath, autoRecalculateLearningPath } from '../services/recommendationEngine';

export async function getLearnerLearningPath(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile?.targetRoleId) {
    res.json({
      status: 'not_started',
      userId,
      targetRoleTitle: null,
      totalEstimatedHours: null,
      courses: [],
      createdAt: null,
      updatedAt: null
    });
    return;
  }

  let path = await prisma.learningPath.findFirst({
    where: { userId, targetRoleId: profile.targetRoleId },
    include: {
      targetRole: {
        include: {
          skillsRequired: {
            include: { skill: true }
          }
        }
      },
      items: {
        include: {
          course: {
            include: {
              courseSkills: {
                include: { skill: true }
              }
            }
          }
        },
        orderBy: { stepOrder: 'asc' }
      }
    }
  });

  if (!path) {
    // Generate one automatically based on profile target role
    const gapResult = await analyzeLearnerSkillGaps(userId, profile.targetRoleId);
    if (gapResult.status === 'not_started' || !gapResult.targetRoleId) {
      res.json({
        status: 'not_started',
        userId,
        targetRoleTitle: null,
        totalEstimatedHours: null,
        courses: [],
        createdAt: null,
        updatedAt: null
      });
      return;
    }
    const generated = await generateLearningPath(userId, gapResult.targetRoleId, gapResult.gaps);
    res.json({ ...generated, status: 'active' });
    return;
  }

  // Also fetch user enrollments to sync progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId }
  });
  const enrollMap = new Map(enrollments.map((e) => [e.courseId, e]));

  const requiredSkills = path.targetRole?.skillsRequired || [];
  const roleSkillIds = new Set(requiredSkills.map((r) => r.skillId.toLowerCase()));
  const roleSkillNames = new Set(requiredSkills.map((r) => (r.skill?.name || '').toLowerCase()));

  res.json({
    id: path.id,
    userId: path.userId,
    targetRoleTitle: path.targetRole.title,
    status: 'active',
    totalEstimatedHours: path.totalEstimatedHours,
    courses: path.items.map((item) => {
      const enr = enrollMap.get(item.courseId);

      let matchesRole = false;
      const course = item.course;
      const csList = course?.courseSkills;
      if (csList && Array.isArray(csList) && csList.length > 0) {
        for (const cs of csList) {
          if (roleSkillIds.has(cs.skillId.toLowerCase()) || (cs.skill?.name && roleSkillNames.has(cs.skill.name.toLowerCase()))) {
            matchesRole = true;
            break;
          }
        }
      }
      if (!matchesRole && course?.skillsCovered && Array.isArray(course.skillsCovered)) {
        for (const sc of course.skillsCovered) {
          const str = String(sc).toLowerCase();
          if (roleSkillIds.has(str) || roleSkillNames.has(str)) {
            matchesRole = true;
            break;
          }
        }
      }
      const isOutsideRoleGaps = requiredSkills.length > 0 ? !matchesRole : false;

      return {
        step: item.stepOrder,
        courseId: item.courseId,
        course: item.course,
        status: enr?.status || item.status,
        progressPercent: enr?.progressPercent || (item.status === 'completed' ? 100 : 0),
        reason: item.reason,
        source: item.source || 'system',
        isOutsideRoleGaps
      };
    }),
    createdAt: path.createdAt,
    updatedAt: path.updatedAt
  });
}

export async function regenerateLearningPath(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const targetRoleId = (req.body.targetRoleId as string) || undefined;

  try {
    const gapResult = await analyzeLearnerSkillGaps(userId, targetRoleId);
    if (gapResult.status === 'not_started' || !gapResult.targetRoleId) {
      res.json({
        status: 'not_started',
        userId,
        targetRoleTitle: null,
        totalEstimatedHours: null,
        courses: [],
        createdAt: null,
        updatedAt: null
      });
      return;
    }
    const newPath = await generateLearningPath(userId, gapResult.targetRoleId, gapResult.gaps);
    res.json({ ...newPath, status: 'active' });
  } catch (err: any) {
    res.status(500).json({ error: 'LearningPathError', message: err.message });
  }
}

export async function updateCourseProgress(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { courseId, status, progressPercent, source, reason } = req.body;

  const validStatus = ['not_started', 'in_progress', 'completed'].includes(status)
    ? status
    : 'in_progress';

  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    },
    update: {
      status: validStatus as any,
      progressPercent: progressPercent !== undefined ? progressPercent : (status === 'completed' ? 100 : 50),
      completedAt: status === 'completed' ? new Date() : null
    },
    create: {
      userId,
      courseId,
      status: validStatus as any,
      progressPercent: progressPercent !== undefined ? progressPercent : 0,
      completedAt: status === 'completed' ? new Date() : null
    }
  });

  // Find or create learning path for user
  let learningPath = await prisma.learningPath.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  if (!learningPath) {
    const profile = await prisma.profile.findFirst({
      where: { userId },
      select: { targetRoleId: true }
    });
    if (profile?.targetRoleId) {
      learningPath = await prisma.learningPath.create({
        data: {
          userId,
          targetRoleId: profile.targetRoleId,
          totalEstimatedHours: 0
        },
        include: { items: true }
      });
    }
  }

  // Ensure course is tracked in LearningPathItem with source = 'manual' if user-added
  if (learningPath) {
    const existingItem = (learningPath.items || []).find((it) => it.courseId === courseId);
    if (existingItem) {
      await prisma.learningPathItem.update({
        where: { id: existingItem.id },
        data: {
          status: validStatus as any,
          source: source || existingItem.source || 'manual'
        }
      });
    } else {
      const maxStep = (learningPath.items || []).reduce((max, it) => Math.max(max, it.stepOrder), 0);
      await prisma.learningPathItem.create({
        data: {
          learningPathId: learningPath.id,
          courseId,
          stepOrder: maxStep + 1,
          status: validStatus as any,
          source: source || 'manual',
          reason: reason || 'Added manually from course catalogue'
        }
      });
    }
  } else {
    // Fallback if no learning path could be created yet
    await prisma.learningPathItem.updateMany({
      where: {
        learningPath: { userId },
        courseId
      },
      data: {
        status: validStatus as any
      }
    });
  }

  const updatedSkills: Array<{
    skillId: string;
    skillName?: string;
    selfAssessedLevel: number;
    verifiedScore: number | null;
    needsConfirmation: boolean;
    message: string;
  }> = [];

  if (validStatus === 'completed') {
    // 1. Fetch course details and covered skills
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        courseSkills: {
          include: { skill: true }
        }
      }
    });

    const coveredSkillMap = new Map<string, string>();
    if (course?.courseSkills) {
      course.courseSkills.forEach((cs) => {
        coveredSkillMap.set(cs.skillId, cs.skill.name);
      });
    }

    if (course?.skillsCovered && Array.isArray(course.skillsCovered) && course.skillsCovered.length > 0) {
      const skillsFromNames = await prisma.skill.findMany({
        where: {
          OR: [
            { id: { in: course.skillsCovered as string[] } },
            { name: { in: course.skillsCovered as string[] } },
            { code: { in: course.skillsCovered as string[] } }
          ]
        },
        select: { id: true, name: true }
      });
      (skillsFromNames || []).forEach((s) => {
        if (!coveredSkillMap.has(s.id)) {
          coveredSkillMap.set(s.id, s.name);
        }
      });
    }

    // 2. Fetch target role requirements to enforce role required level cap
    const profile = await prisma.profile.findFirst({
      where: { userId },
      select: { targetRoleId: true }
    });
    const targetRoleId = profile?.targetRoleId;
    const roleRequirements = targetRoleId
      ? await prisma.roleSkillRequirement.findMany({
          where: { roleId: targetRoleId }
        })
      : [];
    const reqLevelMap = new Map(roleRequirements.map((r) => [r.skillId, r.requiredProficiency]));

    // 3. Raise selfAssessedLevel by +1 (cap 5, and never above role required level) for each skill
    for (const [skillId, skillName] of coveredSkillMap.entries()) {
      const existing = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: { userId, skillId }
        }
      });

      const currentSelf = existing?.selfAssessedLevel ?? 1;
      const roleReq = reqLevelMap.get(skillId);
      const maxAllowed = roleReq !== undefined ? Math.min(5, roleReq) : 5;
      const newSelf = Math.min(maxAllowed, currentSelf + 1);

      // Never touch verifiedScore
      const verified = existing?.verifiedScore ?? null;
      const effectiveScore = verified !== null
        ? Number((0.4 * newSelf + 0.6 * verified).toFixed(2))
        : newSelf;

      const saved = await prisma.userSkill.upsert({
        where: {
          userId_skillId: { userId, skillId }
        },
        update: {
          selfAssessedLevel: newSelf,
          effectiveScore
        },
        create: {
          userId,
          skillId,
          selfAssessedLevel: newSelf,
          verifiedScore: null,
          effectiveScore,
          confidenceLevel: 50.0
        }
      });

      updatedSkills.push({
        skillId,
        skillName,
        selfAssessedLevel: saved.selfAssessedLevel,
        verifiedScore: saved.verifiedScore,
        needsConfirmation: true,
        message: 'Retake the diagnostic to confirm'
      });
    }

    // C4: Auto recalculation of learning path after course is completed
    await autoRecalculateLearningPath(userId);
  }

  res.json({
    message: 'Progress updated',
    enrollment,
    updatedSkills,
    confirmationNotice: updatedSkills.length > 0 ? 'Retake the diagnostic to confirm' : null
  });
}
