import { prisma } from '../lib/prisma';
import { SkillGapItem, SkillGapAnalysisResult } from '@skill-setu/shared';
import { generateGeminiCompletion } from './aiService';

export interface RawSkillInput {
  skillId: string;
  selfAssessedLevel: number;
  verifiedScore?: number | null;
}

export interface GapComputationInput {
  targetRoleId: string;
  userSkills: RawSkillInput[];
}

export function computeSkillGapMetrics(
  roleRequirements: {
    skillId: string;
    skillName: string;
    domainName: string;
    requiredProficiency: number;
    priority: 'must_have' | 'good_to_have' | 'optional';
    weight: number;
  }[],
  userSkills: RawSkillInput[]
): {
  overallReadinessScore: number;
  gaps: SkillGapItem[];
  strengths: { skillId: string; skillName: string; level: number }[];
} {
  const userSkillMap = new Map<string, RawSkillInput>();
  for (const s of userSkills) {
    userSkillMap.set(s.skillId, s);
  }

  let totalWeightedRequired = 0;
  let totalWeightedGap = 0;

  const gaps: SkillGapItem[] = [];
  const strengths: { skillId: string; skillName: string; level: number }[] = [];

  for (const req of roleRequirements) {
    const userSkill = userSkillMap.get(req.skillId);
    const selfLevel = userSkill?.selfAssessedLevel ?? 1;
    const verified = userSkill?.verifiedScore ?? null;

    // Documented formula: 40% self-assessment + 60% diagnostic verified score
    const effectiveLevel = verified !== null
      ? Number((0.4 * selfLevel + 0.6 * verified).toFixed(2))
      : Number(selfLevel.toFixed(2));

    const gap = Math.max(0, Number((req.requiredProficiency - effectiveLevel).toFixed(2)));

    // Priority multiplier
    const priorityMultiplier = req.priority === 'must_have' ? 1.5 : (req.priority === 'good_to_have' ? 1.0 : 0.5);
    const priorityScore = Number((gap * req.weight * priorityMultiplier).toFixed(2));

    let priorityCategory: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (gap >= 2.0 || (gap >= 1.0 && req.priority === 'must_have')) {
      priorityCategory = 'critical';
    } else if (gap >= 1.0) {
      priorityCategory = 'high';
    } else if (gap > 0.3) {
      priorityCategory = 'medium';
    }

    totalWeightedRequired += req.requiredProficiency * req.weight;
    totalWeightedGap += gap * req.weight;

    if (gap > 0) {
      gaps.push({
        skillId: req.skillId,
        skillName: req.skillName,
        domainName: req.domainName,
        requiredLevel: req.requiredProficiency,
        currentLevel: effectiveLevel,
        gap,
        priority: priorityCategory,
        priorityScore,
        weight: req.weight
      });
    } else {
      strengths.push({
        skillId: req.skillId,
        skillName: req.skillName,
        level: effectiveLevel
      });
    }
  }

  // Sort gaps by priority score descending
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  const rawReadiness = totalWeightedRequired > 0
    ? (1 - (totalWeightedGap / totalWeightedRequired)) * 100
    : 100;

  const overallReadinessScore = Math.max(0, Math.min(100, Math.round(rawReadiness)));

  return {
    overallReadinessScore,
    gaps,
    strengths
  };
}

export async function analyzeLearnerSkillGaps(
  userId: string,
  targetRoleId?: string
): Promise<SkillGapAnalysisResult> {
  // If targetRoleId is not passed, fetch from profile
  let roleId = targetRoleId;
  if (!roleId) {
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });
    roleId = profile?.targetRoleId || undefined;
  }

  // If still no role, find default role (Full-Stack Developer)
  let role = roleId
    ? await prisma.role.findUnique({
        where: { id: roleId },
        include: {
          skillsRequired: {
            include: { skill: { include: { domain: true } } }
          }
        }
      })
    : null;

  if (!role) {
    role = await prisma.role.findFirst({
      include: {
        skillsRequired: {
          include: { skill: { include: { domain: true } } }
        }
      }
    });
  }

  if (!role) {
    throw new Error('No career roles found in competency framework.');
  }

  // Fetch user skills
  const dbUserSkills = await prisma.userSkill.findMany({
    where: { userId }
  });

  const formattedReqs = role.skillsRequired.map((r) => ({
    skillId: r.skillId,
    skillName: r.skill.name,
    domainName: r.skill.domain.name,
    requiredProficiency: r.requiredProficiency,
    priority: r.priority as any,
    weight: r.weight
  }));

  const formattedUserSkills: RawSkillInput[] = dbUserSkills.map((s) => ({
    skillId: s.skillId,
    selfAssessedLevel: s.selfAssessedLevel,
    verifiedScore: s.verifiedScore
  }));

  const { overallReadinessScore, gaps, strengths } = computeSkillGapMetrics(
    formattedReqs,
    formattedUserSkills
  );

  // Generate concise AI explanation
  let aiSummary = '';
  try {
    const topGapNames = gaps.slice(0, 3).map((g) => `${g.skillName} (Gap: ${g.gap}, Priority: ${g.priority})`).join(', ');
    const prompt = `Explain the key skill gaps for a learner targeting the role "${role.title}".
Overall readiness score: ${overallReadinessScore}%.
Top skill gaps: ${topGapNames || 'None, learner meets current requirements'}.
Provide a concise, encouraging 2-3 sentence strategic summary and highlight which gap to bridge first.`;

    aiSummary = await generateGeminiCompletion(prompt);
  } catch (err) {
    aiSummary = `Your readiness for ${role.title} is ${overallReadinessScore}%. Prioritize addressing your top skill gaps (${gaps.slice(0, 2).map(g => g.skillName).join(' and ')}) to rapidly improve role qualification.`;
  }

  return {
    userId,
    targetRoleId: role.id,
    targetRoleTitle: role.title,
    overallReadinessScore,
    gaps,
    strengths,
    aiSummaryExplanation: aiSummary,
    analyzedAt: new Date().toISOString()
  };
}
