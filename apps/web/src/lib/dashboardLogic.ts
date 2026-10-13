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
 * Sorts skill gaps by impact descending (largest gap deficit first).
 */
export function sortGapsByImpact(gaps: GapItem[] = []): GapItem[] {
  return [...gaps].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
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
