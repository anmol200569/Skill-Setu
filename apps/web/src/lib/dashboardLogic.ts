import {
  calculateReadiness,
  calculateEstimatedReadinessGain,
  hasSufficientAssessmentData,
  RoleRequirementInput,
  UserSkillAssessmentInput,
  ReadinessCalculationResult
} from '@skill-setu/shared';
import { CareerRoleItem, GapItem, RecommendedCourseItem } from '../pages/learner/DashboardPage';

export { calculateReadiness, calculateEstimatedReadinessGain, hasSufficientAssessmentData };
export type { RoleRequirementInput, UserSkillAssessmentInput, ReadinessCalculationResult };

/**
 * Priority multiplier matching @skill-setu/shared readiness engine.
 */
function getPriorityMultiplier(priority?: string): number {
  switch (priority) {
    case 'critical':
      return 1.5;
    case 'high':
      return 1.25;
    case 'medium':
      return 1.0;
    case 'low':
      return 0.75;
    default:
      return 1.0;
  }
}

/**
 * Computes priority score for a gap item if not already set.
 */
export function getGapPriorityScore(gap: GapItem): number {
  if (typeof gap.priorityScore === 'number' && !Number.isNaN(gap.priorityScore)) {
    return gap.priorityScore;
  }
  const absGap = Math.abs(gap.gap || 0);
  const weight = gap.weight || 1.0;
  const mult = getPriorityMultiplier(gap.priority);
  return absGap * weight * mult;
}

/**
 * Sorts skill gaps by impact descending, using the exact same priority score ranking
 * function as backend gap analysis and AI synthesis.
 */
export function sortGapsByImpact(gaps: GapItem[] = []): GapItem[] {
  return [...gaps].sort((a, b) => {
    const scoreA = getGapPriorityScore(a);
    const scoreB = getGapPriorityScore(b);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return Math.abs(b.gap) - Math.abs(a.gap);
  });
}

/**
 * Determines whether the learner dashboard is in a "not_started" empty state.
 * Returns true if the user has not selected a target career role or stats status is 'not_started'.
 */
export function isDashboardNotStarted(
  stats?: { status?: string; targetRoleId?: string | null; assessedSkillsCount?: number; overallReadiness?: number | null } | null,
  profile?: { targetRoleId?: string | null } | null
): boolean {
  if (!stats && !profile) return true;
  if (stats?.status === 'not_started') return true;
  const targetRoleId = stats?.targetRoleId ?? profile?.targetRoleId;
  if (!targetRoleId) return true;
  // If stats explicitly reports 0 assessed skills or null readiness
  if (stats && stats.assessedSkillsCount === 0 && stats.overallReadiness === null) {
    return true;
  }
  return false;
}

/**
 * Returns the readiness score or null when the user is in "not_started" state
 * or when fewer than 3 skills (or under 60% of role requirements) are assessed.
 * Matches backend contract: no headline numbers displayed when data is insufficient.
 */
export function getDashboardReadiness(
  stats?: { status?: string; targetRoleId?: string | null; overallReadiness?: number | null; assessedSkillsCount?: number; totalSkillsCount?: number } | null,
  profile?: { targetRoleId?: string | null } | null
): number | null {
  if (isDashboardNotStarted(stats, profile)) {
    return null;
  }
  const total = stats?.totalSkillsCount ?? 0;
  const assessed = stats?.assessedSkillsCount ?? 0;
  if (total > 0 && !hasSufficientAssessmentData(total, assessed)) {
    return null;
  }
  return typeof stats?.overallReadiness === 'number' ? stats.overallReadiness : null;
}

/**
 * Computes the real estimated readiness gain when closing the highest-impact gap,
 * scaled to the total role requirements according to the shared readiness formula.
 */
export function computeEstimatedReadinessGain(
  topGap: { gap: number; weight?: number; requiredLevel?: number; isAssessed?: boolean } | null | undefined,
  allSkills: Array<{ required?: number; requiredLevel?: number; requiredProficiency?: number; weight?: number }>
): number {
  return calculateEstimatedReadinessGain(topGap, allSkills);
}

export interface NextBestActionResult {
  topGap: GapItem | null;
  topCourse: RecommendedCourseItem | null;
  estimatedGain: number;
  unassessedPrompt?: { skillId: string; skillName: string } | null;
}

/**
 * Next Best Action resolution:
 * Determines the single highest-impact action card for the learner.
 * Uses only ASSESSED skills for top gaps, course coverage, and estimated gain.
 * If the highest-requirement skill for the role is unassessed, prompts user to take that diagnostic
 * with no deficit or gain numbers.
 */
export function determineNextBestAction(
  sortedGaps: GapItem[],
  recommendations: RecommendedCourseItem[],
  allSkillsForGain: Array<{ required?: number; requiredLevel?: number; requiredProficiency?: number; weight?: number; skillId?: string; skillName?: string }> = [],
  unassessedSkills: Array<{ skillId: string; skillName: string; requiredLevel?: number; requiredProficiency?: number; weight?: number }> = []
): NextBestActionResult {
  // 1. Next Best Action and gain use only ASSESSED skills
  const assessedGaps = sortedGaps.filter(
    (g) => g.isAssessed !== false && g.currentLevel !== null && g.currentLevel !== undefined && g.gap > 0
  );

  // 2. Identify the highest-requirement skill across the role
  const allReqs: Array<{ skillId: string; skillName: string; requiredLevel: number; weight: number; isAssessed: boolean }> = [];

  for (const g of sortedGaps) {
    allReqs.push({
      skillId: g.skillId,
      skillName: g.skillName,
      requiredLevel: g.requiredLevel ?? 0,
      weight: g.weight ?? 1.0,
      isAssessed: g.isAssessed !== false && g.currentLevel !== null && g.currentLevel !== undefined
    });
  }

  for (const u of unassessedSkills) {
    if (!allReqs.some((r) => r.skillId === u.skillId)) {
      allReqs.push({
        skillId: u.skillId,
        skillName: u.skillName,
        requiredLevel: u.requiredLevel ?? u.requiredProficiency ?? 0,
        weight: u.weight ?? 1.0,
        isAssessed: false
      });
    }
  }

  for (const s of allSkillsForGain) {
    if (s.skillId && !allReqs.some((r) => r.skillId === s.skillId)) {
      allReqs.push({
        skillId: s.skillId,
        skillName: s.skillName || s.skillId,
        requiredLevel: s.requiredProficiency ?? s.requiredLevel ?? s.required ?? 0,
        weight: s.weight ?? 1.0,
        isAssessed: false
      });
    }
  }

  let highestReqSkill: { skillId: string; skillName: string; requiredLevel: number; weight: number; isAssessed: boolean } | null = null;
  if (allReqs.length > 0) {
    allReqs.sort((a, b) => (b.requiredLevel - a.requiredLevel) || (b.weight - a.weight));
    highestReqSkill = allReqs[0];
  }

  // If the highest-requirement skill is unassessed, show diagnostic prompt with no deficit or gain numbers
  if (highestReqSkill && !highestReqSkill.isAssessed) {
    return {
      topGap: null,
      topCourse: null,
      estimatedGain: 0,
      unassessedPrompt: {
        skillId: highestReqSkill.skillId,
        skillName: highestReqSkill.skillName
      }
    };
  }

  // Otherwise, use the top assessed gap
  const topGap = assessedGaps.length > 0 ? assessedGaps[0] : null;

  let topCourse: RecommendedCourseItem | null = null;
  if (topGap) {
    const gapIdLower = (topGap.skillId || '').toLowerCase();
    const gapNameLower = (topGap.skillName || '').toLowerCase();

    topCourse =
      recommendations.find((rec) => {
        const skillsCovered = (rec.course?.skillsCovered || []).map((s: string) => s.toLowerCase());
        const matchSkill = (rec.matchingSkill || '').toLowerCase();
        return (
          matchSkill === gapIdLower ||
          matchSkill === gapNameLower ||
          skillsCovered.some(
            (cs: string) =>
              cs === gapIdLower ||
              cs === gapNameLower ||
              gapNameLower.includes(cs) ||
              cs.includes(gapNameLower)
          )
        );
      }) || null;
  }

  const estimatedGain = topGap
    ? calculateEstimatedReadinessGain(
        topGap,
        allSkillsForGain.length > 0 ? allSkillsForGain : assessedGaps
      )
    : 0;

  return {
    topGap,
    topCourse,
    estimatedGain,
    unassessedPrompt: null
  };
}

/**
 * Computes overall readiness score from role requirements and user skills
 * using the shared calculateReadiness formula.
 */
/**
 * Builds weekly plan milestone items from recommended courses and weekly hours.
 * Returns an empty array if no recommendations are available.
 */
export function buildWeeklyPlanItems(
  recommendations: RecommendedCourseItem[] = [],
  weeklyHours: number = 10
): Array<{ idx: number; isRoutine: boolean; text: string }> {
  if (!recommendations || recommendations.length === 0) {
    return [];
  }

  const items: Array<{ idx: number; isRoutine: boolean; text: string }> = [];
  const r1 = recommendations[0];
  const h1 = (weeklyHours * 0.4).toFixed(1);
  items.push({
    idx: 1,
    isRoutine: false,
    text: `Core Module: ${r1.gapAddressed || 'Target Skill'} via ${r1.course.title} (${h1} hrs)`
  });

  if (recommendations.length > 1) {
    const r2 = recommendations[1];
    const h2 = (weeklyHours * 0.3).toFixed(1);
    items.push({
      idx: 2,
      isRoutine: false,
      text: `Secondary Focus: ${r2.gapAddressed || 'Applied Skill'} via ${r2.course.title} (${h2} hrs)`
    });
  } else {
    items.push({
      idx: 2,
      isRoutine: true,
      text: `Hands-on Lab Practice & Problem Sets (${(weeklyHours * 0.3).toFixed(1)} hrs)`
    });
  }

  if (recommendations.length > 2) {
    const r3 = recommendations[2];
    const h3 = (weeklyHours * 0.15).toFixed(1);
    items.push({
      idx: 3,
      isRoutine: false,
      text: `Supplemental Track: ${r3.gapAddressed || 'Mastery Skill'} via ${r3.course.title} (${h3} hrs)`
    });
  } else {
    items.push({
      idx: 3,
      isRoutine: true,
      text: `Diagnostic & Knowledge Check Quizzes (${(weeklyHours * 0.15).toFixed(1)} hrs)`
    });
  }

  items.push({
    idx: 4,
    isRoutine: true,
    text: `Concept Revision & Code Reflection (${(weeklyHours * 0.15).toFixed(1)} hrs)`
  });

  return items;
}

/**
 * Merges assessed gaps with unassessed required skills to ensure all role skills
 * are displayed without empty layout areas.
 */
export function buildDisplayGaps(
  sortedGaps: GapItem[] = [],
  unassessedSkills: Array<{
    skillId: string;
    skillName: string;
    requiredLevel: number;
    priority?: any;
    domainName?: string;
    weight?: number;
  }> = []
): GapItem[] {
  const list: GapItem[] = [...sortedGaps];
  const seenIds = new Set(list.map((g) => g.skillId.toLowerCase()));
  const seenNames = new Set(list.map((g) => g.skillName.toLowerCase()));

  for (const u of unassessedSkills) {
    if (!seenIds.has(u.skillId.toLowerCase()) && !seenNames.has(u.skillName.toLowerCase())) {
      list.push({
        skillId: u.skillId,
        skillName: u.skillName,
        domainName: u.domainName || '',
        requiredLevel: u.requiredLevel,
        currentLevel: null,
        gap: 0,
        priority: u.priority || 'medium',
        weight: u.weight || 1.0,
        priorityScore: 0,
        isAssessed: false
      });
    }
  }

  return list;
}

export function computeReadinessScore(
  roleRequirements: Array<{ skillId?: string; requiredProficiency: number; weight: number }>,
  userSkills: Array<{ skillId?: string; selfAssessedLevel?: number; verifiedScore?: number | null }>
): number | null {
  const formattedReqs = roleRequirements.map((r, i) => ({
    skillId: r.skillId || `skill-${i}`,
    skillName: `Skill ${i}`,
    requiredProficiency: r.requiredProficiency,
    weight: r.weight
  }));
  const formattedUser = userSkills.map((u, i) => ({
    skillId: u.skillId || roleRequirements[i]?.skillId || `skill-${i}`,
    selfAssessedLevel: u.selfAssessedLevel,
    verifiedScore: u.verifiedScore
  }));

  const result = calculateReadiness(formattedReqs, formattedUser);
  return result.overallReadinessScore;
}

export function calculateChecklistProgress(
  hasSavedTargetRole: boolean,
  stats?: {
    diagnosticAttemptsCount?: number;
    activeGapsCount?: number;
    completedCoursesCount?: number;
  } | null
): {
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
  step4Completed: boolean;
  completedCount: number;
  totalCount: number;
} {
  const step1Completed = Boolean(hasSavedTargetRole);
  const step2Completed = Boolean(stats?.diagnosticAttemptsCount && stats.diagnosticAttemptsCount > 0);
  const step3Completed = Boolean(stats?.activeGapsCount && stats.activeGapsCount > 0);
  const step4Completed = Boolean(stats?.completedCoursesCount && stats.completedCoursesCount > 0);

  const completedCount =
    (step1Completed ? 1 : 0) +
    (step2Completed ? 1 : 0) +
    (step3Completed ? 1 : 0) +
    (step4Completed ? 1 : 0);

  return {
    step1Completed,
    step2Completed,
    step3Completed,
    step4Completed,
    completedCount,
    totalCount: 4
  };
}
