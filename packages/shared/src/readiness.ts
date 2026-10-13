import { SkillGapItem, UnassessedSkillItem } from './types/index.js';

export interface RoleRequirementInput {
  skillId: string;
  skillName: string;
  domainName?: string;
  requiredProficiency: number;
  priority?: 'must_have' | 'good_to_have' | 'optional';
  weight?: number;
}

export interface UserSkillAssessmentInput {
  skillId: string;
  selfAssessedLevel?: number | null;
  verifiedScore?: number | null;
}

export type { UnassessedSkillItem };

export interface ReadinessCalculationResult {
  status: 'active' | 'not_started';
  overallReadinessScore: number | null;
  assessedSkillsCount: number;
  totalSkillsCount: number;
  assessedRatioText: string;
  isPreliminary: boolean;
  gaps: SkillGapItem[];
  unassessedSkills: UnassessedSkillItem[];
  strengths: { skillId: string; skillName: string; level: number }[];
}

/**
 * Computes readiness score and skill gap breakdown from role requirements and user assessments.
 *
 * Requirements & Contract:
 * 1. If the user has no self-assessed level for a skill, effective level = verified score only (do NOT assume self = 1).
 * 2. Unassessed skills must never get a numeric deficit, priority score or "gain".
 *    Keep them in a separate "not assessed" list; top gaps / next best action / AI synthesis use only assessed skills.
 * 3. If fewer than half of the role's skills are assessed, show readiness with a "Preliminary" label
 *    next to "Based on N of M skills assessed" (isPreliminary = true).
 * 4. Overall readiness /100 is computed strictly from the assessed skills:
 *    readiness = round((1 - sum(gap * weight) / sum(required * weight)) * 100)
 */
export function calculateReadiness(
  requirements: RoleRequirementInput[],
  userAssessments: UserSkillAssessmentInput[]
): ReadinessCalculationResult {
  const assessmentMap = new Map<string, UserSkillAssessmentInput>();
  for (const a of userAssessments) {
    assessmentMap.set(a.skillId, a);
  }

  const totalSkillsCount = requirements.length;
  let assessedSkillsCount = 0;

  let totalWeightedAssessedRequired = 0;
  let totalWeightedAssessedGap = 0;

  const gaps: SkillGapItem[] = [];
  const unassessedSkills: UnassessedSkillItem[] = [];
  const strengths: { skillId: string; skillName: string; level: number }[] = [];

  for (const req of requirements) {
    const assessment = assessmentMap.get(req.skillId);
    const weight = req.weight ?? 1.0;
    const reqLevel = req.requiredProficiency;
    const priority = req.priority ?? 'good_to_have';

    // A skill is assessed ONLY if it has a non-null, non-undefined verifiedScore from a diagnostic
    const isAssessed =
      assessment?.verifiedScore !== null &&
      assessment?.verifiedScore !== undefined;

    if (!isAssessed) {
      // Unassessed skills must never get a numeric deficit, priority score or gain
      unassessedSkills.push({
        skillId: req.skillId,
        skillName: req.skillName,
        domainName: req.domainName || '',
        requiredLevel: reqLevel,
        weight
      });
      continue;
    }

    assessedSkillsCount++;
    const verified = assessment!.verifiedScore!;
    const hasSelf =
      assessment?.selfAssessedLevel !== null &&
      assessment?.selfAssessedLevel !== undefined;

    // Rule 1: If no self-assessed level, effective level = verified score only (do NOT assume self = 1)
    const effectiveLevel = hasSelf
      ? Number((0.4 * assessment!.selfAssessedLevel! + 0.6 * verified).toFixed(2))
      : Number(verified.toFixed(2));

    const gap = Math.max(0, Number((reqLevel - effectiveLevel).toFixed(2)));

    totalWeightedAssessedRequired += reqLevel * weight;
    totalWeightedAssessedGap += gap * weight;

    const priorityMultiplier =
      priority === 'must_have' ? 1.5 : (priority === 'good_to_have' ? 1.0 : 0.5);
    const priorityScore = Number((gap * weight * priorityMultiplier).toFixed(2));

    let priorityCategory: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (gap >= 2.0 || (gap >= 1.0 && priority === 'must_have')) {
      priorityCategory = 'critical';
    } else if (gap >= 1.0) {
      priorityCategory = 'high';
    } else if (gap > 0.3) {
      priorityCategory = 'medium';
    }

    if (gap > 0) {
      gaps.push({
        skillId: req.skillId,
        skillName: req.skillName,
        domainName: req.domainName || '',
        requiredLevel: reqLevel,
        currentLevel: effectiveLevel,
        isAssessed: true,
        gap,
        priority: priorityCategory,
        priorityScore,
        weight
      });
    } else {
      strengths.push({
        skillId: req.skillId,
        skillName: req.skillName,
        level: effectiveLevel
      });
    }
  }

  // Sort assessed gaps by priority score descending
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  const assessedRatioText = `Based on ${assessedSkillsCount} of ${totalSkillsCount} skills assessed`;
  // Rule 3: If fewer than half of the role's skills are assessed, mark preliminary
  const isPreliminary = totalSkillsCount > 0 && assessedSkillsCount < totalSkillsCount / 2;

  if (assessedSkillsCount === 0 || totalWeightedAssessedRequired <= 0) {
    return {
      status: 'not_started',
      overallReadinessScore: null,
      assessedSkillsCount: 0,
      totalSkillsCount,
      assessedRatioText,
      isPreliminary: false,
      gaps,
      unassessedSkills,
      strengths
    };
  }

  const rawReadiness =
    (1 - totalWeightedAssessedGap / totalWeightedAssessedRequired) * 100;
  const overallReadinessScore = Math.max(
    0,
    Math.min(100, Math.round(rawReadiness))
  );

  return {
    status: 'active',
    overallReadinessScore,
    assessedSkillsCount,
    totalSkillsCount,
    assessedRatioText,
    isPreliminary,
    gaps,
    unassessedSkills,
    strengths
  };
}

/**
 * Computes the estimated readiness gain when closing the highest-impact gap,
 * scaled to the total role requirements according to the platform's readiness formula.
 *
 * Shows 0 (no gain) if it cannot be computed (e.g. 0 assessed skills, unassessed top gap, no gaps, or total weighted requirements <= 0).
 */
export function calculateEstimatedReadinessGain(
  topGap: { gap: number; weight?: number; isAssessed?: boolean } | null | undefined,
  roleRequirements: Array<{ requiredProficiency?: number; required?: number; requiredLevel?: number; weight?: number }>
): number {
  if (!topGap || topGap.isAssessed === false || typeof topGap.gap !== 'number' || topGap.gap <= 0) {
    return 0;
  }

  const gapWeight = topGap.weight ?? 1.0;
  const totalWeightedRequired = roleRequirements.reduce((acc, item) => {
    const req = item.requiredProficiency ?? item.required ?? item.requiredLevel ?? 0;
    const w = item.weight ?? 1.0;
    return acc + req * w;
  }, 0);

  if (totalWeightedRequired <= 0) {
    return 0;
  }

  const potentialGain = ((topGap.gap * gapWeight) / totalWeightedRequired) * 100;
  return Math.max(1, Math.min(100, Math.round(potentialGain)));
}
