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
  let score = 0;
  let primaryMatchedGap: SkillGapItem | null = null;
  const courseSkills = (course.skillsCovered || []).map((s) => s.toLowerCase());

  // Check overlap with gaps
  for (let i = 0; i < topGaps.length; i++) {
    const gap = topGaps[i];
    const skillNameLower = gap.skillName.toLowerCase();
    const skillIdLower = gap.skillId.toLowerCase();

    const isMatch = courseSkills.some(
      (cs) =>
        cs === skillIdLower ||
        cs === skillNameLower ||
        skillNameLower.includes(cs) ||
        cs.includes(skillNameLower)
    );

    if (isMatch) {
      if (!primaryMatchedGap) {
        primaryMatchedGap = gap;
        // Priority weight
        if (gap.priority === 'critical') score += 50;
        else if (gap.priority === 'high') score += 40;
        else score += 25;
      } else {
        score += 15; // Additional gap addressed
      }
    }
  }

  // Preference boosts
  if (preferences?.preferredLanguage) {
    const courseLang = (course.language || '').toLowerCase();
    const prefLang = preferences.preferredLanguage.toLowerCase();
    if (courseLang.includes(prefLang) || courseLang.includes('bilingual') || prefLang === 'en') {
      score += 15;
    }
  }

  if (course.isFree) {
    score += 10;
  }

  if (course.rating && course.rating >= 4.7) {
    score += 10;
  }

  const normalizedScore = Math.min(100, Math.max(10, score));

  const reason = primaryMatchedGap
    ? `Directly bridges your ${primaryMatchedGap.priority} skill gap in ${primaryMatchedGap.skillName} (Current: ${primaryMatchedGap.currentLevel}/5, Required: ${primaryMatchedGap.requiredLevel}/5).`
    : `Strengthens core competency foundation with hands-on practice from ${course.provider}.`;

  return {
    score: normalizedScore,
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
