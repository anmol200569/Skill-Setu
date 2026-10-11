import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { analyzeLearnerSkillGaps } from '../services/gapAnalysisEngine';
import { generateLearningPath } from '../services/recommendationEngine';

export async function getLearnerLearningPath(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  let path = await prisma.learningPath.findFirst({
    where: { userId },
    include: {
      targetRole: true,
      items: {
        include: { course: true },
        orderBy: { stepOrder: 'asc' }
      }
    }
  });

  if (!path) {
    // Generate one automatically based on profile
    const gapResult = await analyzeLearnerSkillGaps(userId);
    const generated = await generateLearningPath(userId, gapResult.targetRoleId, gapResult.gaps);
    res.json(generated);
    return;
  }

  // Also fetch user enrollments to sync progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId }
  });
  const enrollMap = new Map(enrollments.map((e) => [e.courseId, e]));

  res.json({
    id: path.id,
    userId: path.userId,
    targetRoleTitle: path.targetRole.title,
    totalEstimatedHours: path.totalEstimatedHours,
    courses: path.items.map((item) => {
      const enr = enrollMap.get(item.courseId);
      return {
        step: item.stepOrder,
        courseId: item.courseId,
        course: item.course,
        status: enr?.status || item.status,
        progressPercent: enr?.progressPercent || (item.status === 'completed' ? 100 : 0),
        reason: item.reason
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
    const newPath = await generateLearningPath(userId, gapResult.targetRoleId, gapResult.gaps);
    res.json(newPath);
  } catch (err: any) {
    res.status(500).json({ error: 'LearningPathError', message: err.message });
  }
}

export async function updateCourseProgress(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { courseId, status, progressPercent } = req.body;

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

  // Update item in learning path if exists
  await prisma.learningPathItem.updateMany({
    where: {
      learningPath: { userId },
      courseId
    },
    data: {
      status: validStatus as any
    }
  });

  res.json({ message: 'Progress updated', enrollment });
}
