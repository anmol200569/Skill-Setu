import { SkillGapItem } from './types/index.js';

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

export interface ReadinessCalculationResult {
  status: 'active' | 'not_started';
  overallReadinessScore: number | null;
  assessedSkillsCount: number;
  totalSkillsCount: number;
  assessedRatioText: string;
  gaps: SkillGapItem[];
  strengths: { skillId: string; skillName: string; level: number }[];
}

/**
 * Computes readiness score and skill gap breakdown from role requirements and user assessments.
 *
 * Requirements & Contract:
 * 1. A skill with no diagnostic answers (verifiedScore === null or undefined) is UNASSESSED (isAssessed: false, currentLevel: null).
 * 2. If 0 skills are assessed, status is "not_started", overallReadinessScore is null, and ratio text is "Based on 0 of M skills assessed".
 * 3. If 1 or more skills are assessed, overall readiness /100 is computed strictly from the assessed skills:
 *    readiness = round((1 - sum(gap * weight) / sum(required * weight)) * 100)
 * 4. Priority multipliers: must_have = 1.5, good_to_have = 1.0, optional = 0.5.
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

    let effectiveLevel: number | null = null;
    let gap = reqLevel;

    if (isAssessed) {
      assessedSkillsCount++;
      const verified = assessment!.verifiedScore!;
      const self = assessment?.selfAssessedLevel ?? 1;
      effectiveLevel = Number((0.4 * self + 0.6 * verified).toFixed(2));
      gap = Math.max(0, Number((reqLevel - effectiveLevel).toFixed(2)));

      totalWeightedAssessedRequired += reqLevel * weight;
      totalWeightedAssessedGap += gap * weight;
    }

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

    if (!isAssessed || gap > 0) {
      gaps.push({
        skillId: req.skillId,
        skillName: req.skillName,
        domainName: req.domainName || '',
        requiredLevel: reqLevel,
        currentLevel: effectiveLevel,
        isAssessed,
        gap,
        priority: priorityCategory,
        priorityScore,
        weight
      });
    } else if (effectiveLevel !== null) {
      strengths.push({
        skillId: req.skillId,
        skillName: req.skillName,
        level: effectiveLevel
      });
    }
  }

  // Sort gaps by priority score descending
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  const assessedRatioText = `Based on ${assessedSkillsCount} of ${totalSkillsCount} skills assessed`;

  if (assessedSkillsCount === 0 || totalWeightedAssessedRequired <= 0) {
    return {
      status: 'not_started',
      overallReadinessScore: null,
      assessedSkillsCount: 0,
      totalSkillsCount,
      assessedRatioText,
      gaps,
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
    gaps,
    strengths
  };
}

/**
 * Computes the estimated readiness gain when closing the highest-impact gap,
 * scaled to the total role requirements according to the platform's readiness formula.
 *
 * Shows 0 (no gain) if it cannot be computed (e.g. 0 assessed skills, no gaps, or total weighted requirements <= 0).
 */
export function calculateEstimatedReadinessGain(
  topGap: { gap: number; weight?: number; isAssessed?: boolean } | null | undefined,
  roleRequirements: Array<{ requiredProficiency?: number; required?: number; requiredLevel?: number; weight?: number }>
): number {
  if (!topGap || typeof topGap.gap !== 'number' || topGap.gap <= 0) {
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
