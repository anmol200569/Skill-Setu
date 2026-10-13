import { CareerRoleItem, GapItem, RecommendedCourseItem } from '../pages/learner/DashboardPage';

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
  stats?: { status?: string; targetRoleId?: string | null } | null,
  profile?: { targetRoleId?: string | null } | null
): boolean {
  if (!stats && !profile) return true;
  if (stats?.status === 'not_started') return true;
  const targetRoleId = stats?.targetRoleId ?? profile?.targetRoleId;
  return !targetRoleId;
}

/**
 * Returns the readiness score or null when the user is in "not_started" state.
 * Matches backend contract: no numbers/percentages displayed when no target role exists.
 */
export function getDashboardReadiness(
  stats?: { status?: string; targetRoleId?: string | null; overallReadiness?: number | null } | null,
  profile?: { targetRoleId?: string | null } | null
): number | null {
  if (isDashboardNotStarted(stats, profile)) {
    return null;
  }
  return typeof stats?.overallReadiness === 'number' ? stats.overallReadiness : null;
}

/**
 * Computes the real estimated readiness gain when closing the highest-impact gap,
 * scaled to the total role requirements according to the platform's readiness formula.
 *
 * Formula:
 * totalWeightedRequired = sum(required * weight)
 * gain = round((closedGap * weight / totalWeightedRequired) * 100)
 */
export function computeEstimatedReadinessGain(
  topGap: { gap: number; weight?: number; requiredLevel?: number } | null | undefined,
  allSkills: Array<{ required?: number; requiredLevel?: number; weight?: number }>
): number {
  if (!topGap || !topGap.gap || topGap.gap <= 0) return 0;

  const gapWeight = topGap.weight ?? 1.0;
  const totalWeightedRequired = allSkills.reduce((acc, item) => {
    const req = item.required ?? item.requiredLevel ?? 0;
    const w = item.weight ?? 1.0;
    return acc + req * w;
  }, 0);

  if (totalWeightedRequired <= 0) return 0;

  const potentialGain = ((topGap.gap * gapWeight) / totalWeightedRequired) * 100;
  return Math.max(1, Math.min(100, Math.round(potentialGain)));
}

/**
 * Next Best Action resolution:
 * Determines the single highest-impact action card for the learner.
 */
export function determineNextBestAction(
  sortedGaps: GapItem[],
  recommendations: RecommendedCourseItem[],
  allSkillsForGain: Array<{ required?: number; requiredLevel?: number; weight?: number }> = []
): {
  topGap: GapItem | null;
  topCourse: RecommendedCourseItem | null;
  estimatedGain: number;
} {
  const topGap = sortedGaps.length > 0 ? sortedGaps[0] : null;
  const topCourse = recommendations.length > 0 ? recommendations[0] : null;
  const estimatedGain = topGap
    ? computeEstimatedReadinessGain(
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
 * Computes overall readiness score from role requirements and user skills.
 * Mathematically identical to backend gapAnalysisEngine:
 *   effectiveLevel = verifiedScore !== null ? (0.4 * self + 0.6 * verified) : self
 *   gap = max(0, required - effectiveLevel)
 *   readiness = round((1 - sum(gap * weight) / sum(required * weight)) * 100)
 */
export function computeReadinessScore(
  roleRequirements: Array<{ requiredProficiency: number; weight: number }>,
  userSkills: Array<{ selfAssessedLevel: number; verifiedScore?: number | null }>
): number {
  let totalWeightedRequired = 0;
  let totalWeightedGap = 0;

  for (let i = 0; i < roleRequirements.length; i++) {
    const req = roleRequirements[i];
    const us = userSkills[i];
    const self = us?.selfAssessedLevel ?? 1;
    const verified = us?.verifiedScore ?? null;
    const effective =
      verified !== null
        ? Number((0.4 * self + 0.6 * verified).toFixed(2))
        : Number(self.toFixed(2));

    const gap = Math.max(0, Number((req.requiredProficiency - effective).toFixed(2)));
    totalWeightedRequired += req.requiredProficiency * req.weight;
    totalWeightedGap += gap * req.weight;
  }

  const raw =
    totalWeightedRequired > 0
      ? (1 - totalWeightedGap / totalWeightedRequired) * 100
      : 100;

  return Math.max(0, Math.min(100, Math.round(raw)));
}
