import { prisma } from '../lib/prisma';
import { Course, CourseRecommendation, LearningPath, SkillGapItem } from '@skill-setu/shared';
import { analyzeLearnerSkillGaps, clearSummaryCache } from './gapAnalysisEngine';

export interface RecommendationPreferences {
  preferredLanguage?: 'en' | 'hi';
  weeklyStudyHours?: number;
  freeOnly?: boolean;
}

export function getDifficultyTierRank(difficulty: string): number {
  const d = (difficulty || '').toLowerCase();
  if (d.includes('beginner')) return 1;
  if (d.includes('intermediate')) return 2;
  if (d.includes('advanced')) return 3;
  return 1;
}

export function isCourseClearlyBelowLearnerLevel(currentLevel: number, courseDifficulty: string): boolean {
  const d = (courseDifficulty || '').toLowerCase();
  if (d === 'all levels' || d === 'all_levels') return false;
  if (currentLevel >= 4) {
    // For level 4+, Beginner and Intermediate are clearly below
    return d.includes('beginner') || d.includes('intermediate');
  }
  if (currentLevel >= 2) {
    // For level 2-3, Beginner is clearly below
    return d.includes('beginner');
  }
  return false;
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
          const priorityMultiplier =
            (req.priority as string) === 'must_have' || (req.priority as string) === 'critical'
              ? 1.5
              : (req.priority as string) === 'good_to_have' || (req.priority as string) === 'high'
              ? 1.0
              : 0.5;
          const priorityScore = Number((req.requiredProficiency * req.weight * priorityMultiplier).toFixed(2));
          const priorityCategory: 'critical' | 'high' | 'medium' | 'low' =
            (req.priority as string) === 'must_have' || (req.priority as string) === 'critical'
              ? 'critical'
              : (req.priority as string) === 'good_to_have' || (req.priority as string) === 'high'
              ? 'high'
              : 'medium';

          effectiveGaps.push({
            skillId: req.skillId,
            skillName: req.skill.name,
            domainName: '',
            requiredLevel: req.requiredProficiency,
            currentLevel: null,
            gap: req.requiredProficiency,
            priority: priorityCategory,
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
        if (cs.skillId) coveredSet.add(cs.skillId);
        if (cs.skill) {
          if (cs.skill.code) coveredSet.add(cs.skill.code);
          if (cs.skill.name) coveredSet.add(cs.skill.name);
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
      const cSkills = (c.skillsCovered || [])
        .filter((s): s is string => typeof s === 'string')
        .map((s) => s.toLowerCase());
      const name = (gap.skillName || '').toLowerCase();
      const id = (gap.skillId || '').toLowerCase();
      return cSkills.some((s) => s === id || s === name || (s && name.includes(s)) || (name && s.includes(name)));
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

    // Accept only courses that cover a user gap with positive coverage
    if (matchedGap !== null && score > 0) {
      recommendations.push({
        course,
        matchScore: score,
        matchedSkills: course.skillsCovered,
        gapAddressed: matchedGap.skillName,
        recommendationReason: reason,
        order: 0
      });
    }
  }

  // Sort recommendations by matchScore descending, then by rating
  recommendations.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
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
    where: { id: targetRoleId },
    include: {
      skillsRequired: {
        include: { skill: true }
      }
    }
  });

  const roleReqs = role?.skillsRequired || [];
  const roleSkillIds = new Set(roleReqs.map((r) => r.skillId.toLowerCase()));
  const roleSkillNames = new Set(roleReqs.map((r) => (r.skill?.name || '').toLowerCase()));

  // Only consider real gaps: must belong to the role (when role has requirements), must be assessed, and gap > 0
  const realGaps = (gaps || []).filter((g) => {
    if ((g.gap ?? 0) <= 0) return false;
    if (g.isAssessed === false) return false;
    if (roleReqs.length > 0) {
      return (
        roleSkillIds.has((g.skillId || '').toLowerCase()) ||
        roleSkillNames.has((g.skillName || '').toLowerCase())
      );
    }
    return true;
  });

  // Calculate priorityScore = weight * gap and sort real gaps descending
  for (const rg of realGaps) {
    const req = roleReqs.find(
      (r) =>
        r.skillId.toLowerCase() === rg.skillId.toLowerCase() ||
        (r.skill?.name && r.skill.name.toLowerCase() === rg.skillName.toLowerCase())
    );
    const weight = req?.weight ?? rg.weight ?? 1.0;
    rg.weight = weight;
    rg.priorityScore = Number(((rg.gap || 0) * weight).toFixed(2));
  }
  realGaps.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  let topRecommendations: CourseRecommendation[] = [];
  const unmappedSkills: { skillId: string; skillName: string; gap: number; requiredLevel?: number }[] = [];

  if (realGaps.length > 0) {
    const allRecs = await getPersonalizedRecommendations(userId, realGaps, 10);

    // D2: Choose each skill's course difficulty by the learner's current level:
    // level <= 1 Beginner, 2-3 Intermediate, 4+ Advanced; skip courses clearly below learner level.
    const gapLevelMap = new Map<string, number>();
    for (const g of realGaps) {
      if (g.currentLevel !== null && g.currentLevel !== undefined) {
        gapLevelMap.set(g.skillId.toLowerCase(), g.currentLevel);
        gapLevelMap.set(g.skillName.toLowerCase(), g.currentLevel);
      }
    }

    // Filter out courses that are clearly below the learner's level for the gap they address
    const filteredRecs = allRecs.filter((r) => {
      if (!r.gapAddressed) return false;
      const currentLevel = gapLevelMap.get(r.gapAddressed.toLowerCase()) ?? 0;
      return !isCourseClearlyBelowLearnerLevel(currentLevel, r.course.difficulty);
    });

    // Pick recommendations covering diverse skill gaps where possible in priority order
    const gapPriorityRankMap = new Map<string, number>();
    realGaps.forEach((g, idx) => {
      gapPriorityRankMap.set(g.skillName.toLowerCase(), idx);
      gapPriorityRankMap.set(g.skillId.toLowerCase(), idx);
    });

    const seenGaps = new Set<string>();
    const diverseRecs: CourseRecommendation[] = [];
    const remainingRecs: CourseRecommendation[] = [];

    for (const r of filteredRecs) {
      if (r.gapAddressed && !seenGaps.has(r.gapAddressed.toLowerCase())) {
        seenGaps.add(r.gapAddressed.toLowerCase());
        diverseRecs.push(r);
      } else {
        remainingRecs.push(r);
      }
    }

    // Order: gap priority (weight * gap), then difficulty tier, then matchScore
    const sortedCandidates = [...diverseRecs, ...remainingRecs];
    sortedCandidates.sort((a, b) => {
      const gapRankA = gapPriorityRankMap.get((a.gapAddressed || '').toLowerCase()) ?? 999;
      const gapRankB = gapPriorityRankMap.get((b.gapAddressed || '').toLowerCase()) ?? 999;
      if (gapRankA !== gapRankB) {
        return gapRankA - gapRankB;
      }
      const tierA = getDifficultyTierRank(a.course.difficulty);
      const tierB = getDifficultyTierRank(b.course.difficulty);
      if (tierA !== tierB) {
        return tierA - tierB;
      }
      return b.matchScore - a.matchScore;
    });

    topRecommendations = sortedCandidates.slice(0, 5);

    // Identify real gaps that have no mapped course in the catalog
    for (const rg of realGaps) {
      const hasCourse = filteredRecs.some(
        (r) =>
          r.gapAddressed.toLowerCase() === rg.skillName.toLowerCase() ||
          (r.matchedSkills && r.matchedSkills.some((s) => s.toLowerCase() === rg.skillId.toLowerCase() || s.toLowerCase() === rg.skillName.toLowerCase()))
      );
      if (!hasCourse) {
        unmappedSkills.push({
          skillId: rg.skillId,
          skillName: rg.skillName,
          gap: rg.gap,
          requiredLevel: rg.requiredLevel
        });
      }
    }
  }

  const neededCourseIds = new Set(topRecommendations.map((r) => r.course.id));

  // 1. Fetch or create Learning Path in DB
  let existingPath = await prisma.learningPath.findFirst({
    where: { userId, targetRoleId },
    include: {
      items: {
        include: {
          course: {
            include: {
              courseSkills: {
                include: { skill: true }
              }
            }
          }
        }
      }
    }
  });

  if (!existingPath) {
    existingPath = await prisma.learningPath.create({
      data: {
        userId,
        targetRoleId,
        totalEstimatedHours: 0
      },
      include: {
        items: {
          include: {
            course: {
              include: {
                courseSkills: {
                  include: { skill: true }
                }
              }
            }
          }
        }
      }
    });
  }

  // 2. Fetch user enrollments to ensure accurate status retention
  const userEnrollments = await prisma.enrollment.findMany({
    where: { userId }
  });
  const enrollmentMap = new Map(userEnrollments.map((e) => [e.courseId, e]));

  // 3. C4: KEEP completed, in-progress, AND manual items (manual items are never deleted by recalculation)
  const existingItems = existingPath.items || [];
  const keptItems: typeof existingItems = [];
  const notStartedItems: typeof existingItems = [];

  for (const item of existingItems) {
    const enr = enrollmentMap.get(item.courseId);
    const effectiveStatus = enr?.status || item.status;
    if (effectiveStatus === 'completed' || effectiveStatus === 'in_progress' || item.source === 'manual') {
      keptItems.push(item);
    } else {
      notStartedItems.push(item);
    }
  }

  // 4. C4: Drop ONLY system not-started items that are no longer needed
  const itemsToDelete = notStartedItems.filter((it) => !neededCourseIds.has(it.courseId));
  for (const item of itemsToDelete) {
    await prisma.learningPathItem.delete({
      where: { id: item.id }
    });
  }

  const survivingNotStarted = notStartedItems.filter((it) => neededCourseIds.has(it.courseId));
  const survivingCourseIds = new Set([
    ...keptItems.map((it) => it.courseId),
    ...survivingNotStarted.map((it) => it.courseId)
  ]);

  // 5. C4: Add new ones from recommendations not currently in the path
  const newRecommendationsToAdd = topRecommendations.filter((r) => !survivingCourseIds.has(r.course.id));
  for (const rec of newRecommendationsToAdd) {
    const createdItem = await prisma.learningPathItem.create({
      data: {
        learningPathId: existingPath.id,
        courseId: rec.course.id,
        stepOrder: 999, // temporary, renumbered below
        reason: rec.recommendationReason,
        status: 'not_started',
        source: 'system'
      },
      include: {
        course: {
          include: {
            courseSkills: {
              include: { skill: true }
            }
          }
        }
      }
    });
    survivingNotStarted.push(createdItem as any);
  }

  // 6. C4 & D2: Renumber stepOrder idempotently
  // Completed first, in-progress second, not-started ordered by difficulty tier then matchScore
  const statusRank = (status: string) => {
    if (status === 'completed') return 1;
    if (status === 'in_progress') return 2;
    return 3;
  };

  const allItems = [...keptItems, ...survivingNotStarted];
  allItems.sort((a, b) => {
    const rankA = statusRank(a.status);
    const rankB = statusRank(b.status);
    if (rankA !== rankB) return rankA - rankB;

    if (rankA === 1 || rankA === 2) {
      return a.stepOrder - b.stepOrder;
    }

    // For not-started items: difficulty tier first (Beginner < Intermediate < Advanced)
    const tierA = getDifficultyTierRank(a.course.difficulty);
    const tierB = getDifficultyTierRank(b.course.difficulty);
    if (tierA !== tierB) return tierA - tierB;

    return a.stepOrder - b.stepOrder;
  });

  let totalEstimatedHours = 0;
  for (let i = 0; i < allItems.length; i++) {
    const stepOrder = i + 1;
    totalEstimatedHours += allItems[i].course.estimatedHours;
    if (allItems[i].stepOrder !== stepOrder) {
      await prisma.learningPathItem.update({
        where: { id: allItems[i].id },
        data: { stepOrder }
      });
      allItems[i].stepOrder = stepOrder;
    }
  }

  await prisma.learningPath.update({
    where: { id: existingPath.id },
    data: { totalEstimatedHours }
  });

  return {
    id: existingPath.id,
    userId,
    targetRoleTitle: role?.title || 'Target Role',
    totalEstimatedHours,
    courses: allItems.map((item) => {
      const enr = enrollmentMap.get(item.courseId);

      const requiredSkills = role?.skillsRequired || [];
      const roleSkillIds = new Set(requiredSkills.map((r) => r.skillId.toLowerCase()));
      const roleSkillNames = new Set(requiredSkills.map((r) => (r.skill?.name || '').toLowerCase()));

      let matchesRole = false;
      const course = item.course;
      const csList = (course as any)?.courseSkills;
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
        status: (enr?.status || item.status) as any,
        progressPercent: enr?.progressPercent || (item.status === 'completed' ? 100 : item.status === 'in_progress' ? 50 : 0),
        reason: item.reason,
        source: item.source || 'system',
        isOutsideRoleGaps
      };
    }),
    unmappedSkills,
    status: allItems.length > 0 ? 'active' : 'not_started',
    createdAt: existingPath.createdAt ? new Date(existingPath.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Automatically recalculates learning path for a user if target role is configured.
 * Triggered after: course completed, diagnostic submitted, or practice quiz submitted (Task C4).
 */
export async function autoRecalculateLearningPath(userId: string): Promise<void> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
      select: { targetRoleId: true }
    });
    const targetRoleId = profile?.targetRoleId;
    if (!targetRoleId) return;

    // Clear AI summary cache so gaps and summaries recalculate fresh
    clearSummaryCache();

    const gapResult = await analyzeLearnerSkillGaps(userId, targetRoleId);
    if (gapResult.targetRoleId && gapResult.status !== 'not_started') {
      await generateLearningPath(userId, gapResult.targetRoleId, gapResult.gaps);
    }
  } catch (err: any) {
    console.warn(`[AutoRecalculate] Path recalculation for user ${userId} failed:`, err?.message);
  }
}

