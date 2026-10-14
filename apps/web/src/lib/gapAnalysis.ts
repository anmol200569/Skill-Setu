/**
 * Pure logic functions for skill gap analysis, status labelling, priority ranking,
 * and chart data mapping.
 */

export type SkillStatus = 'strong' | 'needsImprovement' | 'notAssessed';

export interface GapItemInput {
  skillId?: string;
  skillName: string;
  domainName?: string;
  currentLevel?: number | null;
  requiredLevel: number;
  weight?: number;
  isAssessed?: boolean;
  priority?: string;
  priorityScore?: number;
}

/**
 * Evaluates the status of a skill relative to its target level.
 * - 'notAssessed': when currentLevel is null/undefined or isAssessed is explicitly false
 * - 'strong': when verified current level meets or exceeds target level
 * - 'needsImprovement': when verified current level is below target level
 */
export function determineSkillStatus(
  currentLevel: number | null | undefined,
  requiredLevel: number,
  isAssessed: boolean = true
): SkillStatus {
  if (!isAssessed || currentLevel === null || currentLevel === undefined) {
    return 'notAssessed';
  }
  if (currentLevel >= requiredLevel) {
    return 'strong';
  }
  return 'needsImprovement';
}

/**
 * Computes priority score as: role weight * gap size.
 * If skill is not assessed or has no deficit, gap size is 0.
 */
export function calculateGapPriorityScore(
  gapSize: number,
  weight: number = 1.0,
  priorityMultiplier: number = 1.0
): number {
  const effectiveGap = Math.max(0, gapSize);
  return Number((effectiveGap * Math.max(0.1, weight) * Math.max(0.1, priorityMultiplier)).toFixed(4));
}

export interface EnrichedGapItem extends GapItemInput {
  isAssessed: boolean;
  current: number;
  required: number;
  gapSize: number;
  priorityScore: number;
  status: SkillStatus;
}

/**
 * Enriches a raw gap item with computed status, gap size, and priority score.
 */
export function enrichGapItem(gap: GapItemInput): EnrichedGapItem {
  const isAssessed = gap.isAssessed !== false && gap.currentLevel !== null && gap.currentLevel !== undefined;
  const current = isAssessed ? Number(gap.currentLevel) : 0;
  const required = Number(gap.requiredLevel);
  const weight = typeof gap.weight === 'number' ? gap.weight : 1.0;
  const gapSize = isAssessed ? Math.max(0, required - current) : 0;
  const priorityScore = calculateGapPriorityScore(gapSize, weight);
  const status = determineSkillStatus(gap.currentLevel, required, isAssessed);

  return {
    ...gap,
    isAssessed,
    current,
    required,
    weight,
    gapSize: Number(gapSize.toFixed(2)),
    priorityScore,
    status,
  };
}

/**
 * Sorts skill gaps by priority score descending.
 * Tie-breaker: larger gap size, then alphabetical skill name.
 */
export function sortGapsByPriority(gaps: GapItemInput[]): EnrichedGapItem[] {
  const enriched = gaps.map(enrichGapItem);
  return enriched.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    if (b.gapSize !== a.gapSize) {
      return b.gapSize - a.gapSize;
    }
    return a.skillName.localeCompare(b.skillName);
  });
}

/**
 * Selects the top N priority gaps that require improvement.
 */
export function getTopPriorityGaps(gaps: GapItemInput[], limit: number = 3): EnrichedGapItem[] {
  const sorted = sortGapsByPriority(gaps);
  return sorted.filter((g) => g.status === 'needsImprovement').slice(0, limit);
}

/**
 * Formats skills for Radar chart display.
 * Excludes unassessed skills so radar polygon does not collapse to 0 inappropriately.
 */
export interface RadarChartPoint {
  skill: string;
  fullSkill: string;
  achieved: number;
  target: number;
}

export function mapSkillsToRadarData(
  skills: Array<{ skill: string; fullSkill?: string; current: number | null | undefined; required: number }>
): RadarChartPoint[] {
  return skills
    .filter((s) => s.current !== null && s.current !== undefined)
    .map((s) => ({
      skill: s.skill,
      fullSkill: s.fullSkill || s.skill,
      achieved: Number((s.current ?? 0).toFixed(1)),
      target: Number(s.required.toFixed(1)),
    }));
}

/**
 * Calculates assessment coverage statistics.
 */
export function calculateAssessmentCoverage(
  assessedCount: number,
  totalCount: number,
  sufficientThresholdPercent: number = 60
): {
  coveragePercent: number;
  isSufficient: boolean;
  threshold: number;
} {
  if (totalCount <= 0) {
    return { coveragePercent: 0, isSufficient: false, threshold: sufficientThresholdPercent };
  }
  const coveragePercent = Math.min(100, Math.max(0, Math.round((assessedCount / totalCount) * 100)));
  const isSufficient = coveragePercent >= sufficientThresholdPercent && assessedCount >= 3;
  return {
    coveragePercent,
    isSufficient,
    threshold: sufficientThresholdPercent,
  };
}
