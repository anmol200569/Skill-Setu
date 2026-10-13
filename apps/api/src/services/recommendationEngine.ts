import { prisma } from '../lib/prisma';
import { Course, CourseRecommendation, LearningPath, SkillGapItem } from '@skill-setu/shared';

export interface RecommendationPreferences {
  preferredLanguage?: 'en' | 'hi';
  weeklyStudyHours?: number;
  freeOnly?: boolean;
}

export function calculateCourseMatchScore(
  course: Course,
  topGaps: SkillGapItem[],
  preferences?: RecommendationPreferences
): { score: number; matchedGap: SkillGapItem | null; reason: string } {
  const courseSkills = (course.skillsCovered || []).map((s) => s.toLowerCase());

  // Find all user gaps that this course actually covers
  const matchedGaps = topGaps.filter((gap) => {
    const skillNameLower = gap.skillName.toLowerCase();
    const skillIdLower = gap.skillId.toLowerCase();
    return courseSkills.some(
      (cs) =>
        cs === skillIdLower ||
        cs === skillNameLower ||
        skillNameLower.includes(cs) ||
        cs.includes(skillNameLower)
    );
  });

  const primaryMatchedGap = matchedGaps.length > 0 ? matchedGaps[0] : null;

  // Real gap coverage computation: percentage of total weighted gap deficit covered
  let realCoverageScore = 0;
  if (topGaps.length > 0) {
    const totalWeightedDeficit = topGaps.reduce((acc, g) => acc + (g.gap || 1) * (g.weight || 1), 0);
    const coveredWeightedDeficit = matchedGaps.reduce((acc, g) => acc + (g.gap || 1) * (g.weight || 1), 0);
    if (totalWeightedDeficit > 0 && coveredWeightedDeficit > 0) {
      realCoverageScore = Math.min(100, Math.round((coveredWeightedDeficit / totalWeightedDeficit) * 100));
    }
  }

  const reason = primaryMatchedGap
    ? primaryMatchedGap.currentLevel !== null && primaryMatchedGap.isAssessed
      ? `Directly bridges your ${primaryMatchedGap.priority} skill gap in ${primaryMatchedGap.skillName} (Current: ${primaryMatchedGap.currentLevel}/5, Required: ${primaryMatchedGap.requiredLevel}/5).`
      : `Directly bridges your target requirement in ${primaryMatchedGap.skillName} (Required: Level ${primaryMatchedGap.requiredLevel}/5).`
    : `Strengthens core foundation with hands-on practice from ${course.provider}.`;

  return {
    score: realCoverageScore,
    matchedGap: primaryMatchedGap,
    reason
  };
}

export async function getPersonalizedRecommendations(
  userId: string,
  gaps: SkillGapItem[],
  limit: number = 6
): Promise<CourseRecommendation[]> {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  const allCourses = await prisma.course.findMany();

  const formattedCourses: Course[] = allCourses.map((c) => ({
    id: c.id,
    title: c.title,
    provider: c.provider,
    destinationUrl: c.destinationUrl,
    skillsCovered: c.skillsCovered as string[],
    difficulty: c.difficulty as any,
    estimatedHours: c.estimatedHours,
    language: c.language as any,
    isFree: c.isFree,
    rating: c.rating,
    ratingSource: c.ratingSource,
    description: c.description,
    thumbnailUrl: c.thumbnailUrl ?? undefined
  }));

  const recommendations: CourseRecommendation[] = [];

  for (const course of formattedCourses) {
    const { score, matchedGap, reason } = calculateCourseMatchScore(
      course,
      gaps,
      {
        preferredLanguage: (profile?.preferredLanguage as any) || 'en',
        weeklyStudyHours: profile?.weeklyStudyHours || 10
      }
    );

    if (score >= 25) {
      recommendations.push({
        course,
        matchScore: score,
        matchedSkills: course.skillsCovered,
        gapAddressed: matchedGap ? matchedGap.skillName : 'General Competency',
        recommendationReason: reason,
        order: 0
      });
    }
  }

  // Sort by match score descending
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  const topRecs = recommendations.slice(0, limit);
  topRecs.forEach((r, idx) => {
    r.order = idx + 1;
  });

  return topRecs;
}

export async function generateLearningPath(
  userId: string,
  targetRoleId: string,
  gaps: SkillGapItem[]
): Promise<LearningPath> {
  const role = await prisma.role.findUnique({
    where: { id: targetRoleId }
  });

  const recommendations = await getPersonalizedRecommendations(userId, gaps, 5);

  let totalEstimatedHours = 0;
  for (const r of recommendations) {
    totalEstimatedHours += r.course.estimatedHours;
  }

  // Upsert Learning Path in DB
  let existingPath = await prisma.learningPath.findFirst({
    where: { userId, targetRoleId },
    include: { items: { include: { course: true } } }
  });

  if (existingPath) {
    await prisma.learningPathItem.deleteMany({
      where: { learningPathId: existingPath.id }
    });
  } else {
    existingPath = await prisma.learningPath.create({
      data: {
        userId,
        targetRoleId,
        totalEstimatedHours
      },
      include: { items: { include: { course: true } } }
    });
  }

  // Create learning path items
  const createdItems = [];
  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i];
    const item = await prisma.learningPathItem.create({
      data: {
        learningPathId: existingPath.id,
        courseId: rec.course.id,
        stepOrder: i + 1,
        reason: rec.recommendationReason,
        status: 'not_started'
      },
      include: { course: true }
    });
    createdItems.push(item);
  }

  return {
    id: existingPath.id,
    userId,
    targetRoleTitle: role?.title || 'Target Role',
    totalEstimatedHours,
    courses: createdItems.map((item) => ({
      step: item.stepOrder,
      courseId: item.courseId,
      course: {
        id: item.course.id,
        title: item.course.title,
        provider: item.course.provider,
        destinationUrl: item.course.destinationUrl,
        skillsCovered: item.course.skillsCovered as string[],
        difficulty: item.course.difficulty as any,
        estimatedHours: item.course.estimatedHours,
        language: item.course.language as any,
        isFree: item.course.isFree,
        rating: item.course.rating,
        ratingSource: item.course.ratingSource,
        description: item.course.description
      },
      status: item.status as any,
      progressPercent: 0,
      reason: item.reason
    })),
    createdAt: existingPath.createdAt.toISOString(),
    updatedAt: new Date().toISOString()
  };
}
