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
      : `Foundational course recommended to build ${primaryMatchedGap.skillName} (Target: Level ${primaryMatchedGap.requiredLevel}/5).`
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

  // Augment gaps with unassessed required skills from user's target career role
  const effectiveGaps: SkillGapItem[] = [...gaps];
  const targetRoleId = profile?.targetRoleId;

  if (targetRoleId) {
    const role = await prisma.role.findUnique({
      where: { id: targetRoleId },
      include: {
        skillsRequired: {
          include: { skill: true }
        }
      }
    });

    if (role) {
      const assessedSkillIds = new Set(gaps.map((g) => g.skillId.toLowerCase()));
      const assessedSkillNames = new Set(gaps.map((g) => g.skillName.toLowerCase()));

      for (const req of role.skillsRequired) {
        const isAssessed =
          assessedSkillIds.has(req.skillId.toLowerCase()) ||
          assessedSkillNames.has(req.skill.name.toLowerCase());

        if (!isAssessed) {
          const priorityScore =
            req.requiredProficiency *
            req.weight *
            (req.priority === 'critical' ? 1.5 : req.priority === 'high' ? 1.25 : 1.0);

          effectiveGaps.push({
            skillId: req.skillId,
            skillName: req.skill.name,
            domainName: '',
            requiredLevel: req.requiredProficiency,
            currentLevel: null,
            gap: req.requiredProficiency,
            priority: req.priority as any,
            weight: req.weight,
            priorityScore,
            isAssessed: false
          });
        }
      }
    }
  }

  // Sort effective gaps by priorityScore descending
  effectiveGaps.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  const allCourses = await prisma.course.findMany({
    include: {
      courseSkills: {
        include: {
          skill: true
        }
      }
    }
  });

  const formattedCourses: Course[] = allCourses.map((c) => {
    // Collect skills covered from both JSON skillsCovered and relational CourseSkill mappings
    const coveredSet = new Set<string>();
    if (Array.isArray(c.skillsCovered)) {
      c.skillsCovered.forEach((s) => typeof s === 'string' && coveredSet.add(s));
    }
    if (c.courseSkills) {
      c.courseSkills.forEach((cs) => {
        coveredSet.add(cs.skillId);
        if (cs.skill) {
          coveredSet.add(cs.skill.code);
          coveredSet.add(cs.skill.name);
        }
      });
    }

    return {
      id: c.id,
      title: c.title,
      provider: c.provider,
      destinationUrl: c.destinationUrl,
      skillsCovered: Array.from(coveredSet),
      difficulty: c.difficulty as any,
      estimatedHours: c.estimatedHours,
      language: c.language as any,
      isFree: c.isFree,
      rating: c.rating,
      ratingSource: c.ratingSource,
      description: c.description,
      thumbnailUrl: c.thumbnailUrl ?? undefined
    };
  });

  // Check if any role required skill has no mapped course in the catalog, and log safely
  for (const gap of effectiveGaps) {
    const hasCourse = formattedCourses.some((c) => {
      const cSkills = (c.skillsCovered || []).map((s) => s.toLowerCase());
      const name = gap.skillName.toLowerCase();
      const id = gap.skillId.toLowerCase();
      return cSkills.some((s) => s === id || s === name || name.includes(s) || s.includes(name));
    });
    if (!hasCourse) {
      console.warn(`[Recommendations] Required skill "${gap.skillName}" (${gap.skillId}) has no mapped courses in catalog. Skipping.`);
    }
  }

  const recommendations: CourseRecommendation[] = [];

  for (const course of formattedCourses) {
    const { score, matchedGap, reason } = calculateCourseMatchScore(
      course,
      effectiveGaps,
      {
        preferredLanguage: (profile?.preferredLanguage as any) || 'en',
        weeklyStudyHours: profile?.weeklyStudyHours || 10
      }
    );

    // Accept courses that cover a user gap with sufficient coverage
    if (score >= 15 || (matchedGap !== null && score > 0)) {
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

  // Sort by match score descending, promoting beginner courses for foundational gaps
  recommendations.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    const aBeginner = a.course.difficulty.toLowerCase() === 'beginner' ? 1 : 0;
    const bBeginner = b.course.difficulty.toLowerCase() === 'beginner' ? 1 : 0;
    if (bBeginner !== aBeginner) {
      return bBeginner - aBeginner;
    }
    return (b.course.rating || 0) - (a.course.rating || 0);
  });

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

  const allRecs = await getPersonalizedRecommendations(userId, gaps, 10);

  // Pick recommendations covering diverse skill gaps where possible
  const seenGaps = new Set<string>();
  const diverseRecs: CourseRecommendation[] = [];
  const remainingRecs: CourseRecommendation[] = [];

  for (const r of allRecs) {
    if (r.gapAddressed && !seenGaps.has(r.gapAddressed)) {
      seenGaps.add(r.gapAddressed);
      diverseRecs.push(r);
    } else {
      remainingRecs.push(r);
    }
  }
  const recommendations = [...diverseRecs, ...remainingRecs].slice(0, 5);

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
