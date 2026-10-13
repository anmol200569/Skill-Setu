import {
  calculateReadiness,
  calculateEstimatedReadinessGain,
  RoleRequirementInput,
  UserSkillAssessmentInput,
  ReadinessCalculationResult
} from '@skill-setu/shared';
import { CareerRoleItem, GapItem, RecommendedCourseItem } from '../pages/learner/DashboardPage';

export { calculateReadiness, calculateEstimatedReadinessGain };
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
 * Returns the readiness score or null when the user is in "not_started" state.
 * Matches backend contract: no numbers/percentages displayed when 0 assessed or no target role exists.
 */
export function getDashboardReadiness(
  stats?: { status?: string; targetRoleId?: string | null; overallReadiness?: number | null; assessedSkillsCount?: number } | null,
  profile?: { targetRoleId?: string | null } | null
): number | null {
  if (isDashboardNotStarted(stats, profile)) {
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

/**
 * Next Best Action resolution:
 * Determines the single highest-impact action card for the learner.
 * Uses real course-skill mapping to find a course that actually covers the top gap.
 */
export function determineNextBestAction(
  sortedGaps: GapItem[],
  recommendations: RecommendedCourseItem[],
  allSkillsForGain: Array<{ required?: number; requiredLevel?: number; requiredProficiency?: number; weight?: number }> = []
): {
  topGap: GapItem | null;
  topCourse: RecommendedCourseItem | null;
  estimatedGain: number;
} {
  const topGap = sortedGaps.length > 0 ? sortedGaps[0] : null;

  // Find a course that actually covers the top gap (use real course-skill mapping)
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

  // Show no gain if it cannot be computed with that formula
  const estimatedGain = topGap
    ? calculateEstimatedReadinessGain(
        topGap,
        allSkillsForGain.length > 0 ? allSkillsForGain : sortedGaps
      )
    : 0;

  return {
    topGap,
    topCourse,
    estimatedGain
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
