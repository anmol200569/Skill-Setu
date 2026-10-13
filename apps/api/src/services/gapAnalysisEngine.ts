import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import {
  calculateReadiness,
  calculateEstimatedReadinessGain,
  ReadinessCalculationResult,
  RoleRequirementInput,
  UserSkillAssessmentInput,
  SkillGapItem,
  SkillGapAnalysisResult
} from '@skill-setu/shared';
import { generateGeminiCompletion } from './aiService';

interface CachedSummary {
  summary: string;
  cachedAt: number;
}

// In-memory cache for generated AI summaries keyed by user ID + gap signature hash
const summaryCache = new Map<string, CachedSummary>();
const SUMMARY_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function clearSummaryCache(): void {
  summaryCache.clear();
}

export function computeGapStateHash(userId: string, roleId: string, readiness: number | null, gaps: SkillGapItem[]): string {
  const serialized = `${userId}:${roleId}:${readiness ?? 'null'}:${gaps.map((g) => `${g.skillId}:${g.gap}:${g.priority}:${g.isAssessed}`).join('|')}`;
  return crypto.createHash('md5').update(serialized).digest('hex');
}

/**
 * Deterministic summary from real data (top 2 gaps by name and size) or empty string when 0 assessed.
 * Strictly avoids invented content or hallucinated percentages.
 */
export function getDeterministicSkillSummary(roleTitle: string, readiness: number | null, gaps: SkillGapItem[]): string {
  if (readiness === null || gaps.length === 0) {
    if (readiness !== null && gaps.length === 0) {
      return `Your readiness for ${roleTitle} is ${readiness}%. You currently meet the target proficiency across all evaluated skills.`;
    }
    return '';
  }

  const assessedGaps = gaps.filter((g) => g.isAssessed !== false && g.currentLevel !== null && g.currentLevel !== undefined);
  if (assessedGaps.length === 0) {
    return '';
  }
  const top2 = assessedGaps.slice(0, 2);

  if (top2.length === 1) {
    return `Your readiness for ${roleTitle} is ${readiness}%. Prioritize bridging your top skill gap in ${top2[0].skillName} (deficit of ${top2[0].gap.toFixed(1)} pts) to qualify for this role.`;
  }

  return `Your readiness for ${roleTitle} is ${readiness}%. Prioritize bridging your top skill gaps in ${top2[0].skillName} (deficit of ${top2[0].gap.toFixed(1)} pts) and ${top2[1].skillName} (deficit of ${top2[1].gap.toFixed(1)} pts) to qualify for this role.`;
}

export function getFallbackSkillSummary(roleTitle: string, readiness: number | null, gaps: SkillGapItem[]): string {
  return getDeterministicSkillSummary(roleTitle, readiness, gaps);
}

export interface RawSkillInput {
  skillId: string;
  selfAssessedLevel?: number | null;
  verifiedScore?: number | null;
}

export interface GapComputationInput {
  targetRoleId: string;
  userSkills: RawSkillInput[];
}

export function computeSkillGapMetrics(
  roleRequirements: RoleRequirementInput[],
  userSkills: UserSkillAssessmentInput[]
): ReadinessCalculationResult {
  return calculateReadiness(roleRequirements, userSkills);
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

  // Never default a target role: return explicit not_started state with no numbers
  if (!roleId) {
    return {
      userId,
      targetRoleId: null,
      targetRoleTitle: null,
      status: 'not_started',
      overallReadinessScore: null,
      gaps: [],
      strengths: [],
      aiSummaryExplanation: 'Please select a target career role in your profile to initialize skill gap analysis and readiness scoring.',
      analyzedAt: new Date().toISOString()
    };
  }

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      skillsRequired: {
        include: { skill: { include: { domain: true } } }
      }
    }
  });

  if (!role) {
    return {
      userId,
      targetRoleId: null,
      targetRoleTitle: null,
      status: 'not_started',
      overallReadinessScore: null,
      gaps: [],
      strengths: [],
      aiSummaryExplanation: 'Target career role was not found in the competency framework. Please select a valid role.',
      analyzedAt: new Date().toISOString()
    };
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

  const calculation = computeSkillGapMetrics(
    formattedReqs,
    formattedUserSkills
  );

  let aiSummary = '';
  if (calculation.assessedSkillsCount === 0) {
    aiSummary = '';
  } else {
    // Generate or retrieve cached AI explanation
    const gapHash = computeGapStateHash(userId, role.id, calculation.overallReadinessScore, calculation.gaps);
    const cacheKey = `${userId}:${role.id}:${gapHash}`;
    const cached = summaryCache.get(cacheKey);

    if (cached && Date.now() - cached.cachedAt < SUMMARY_CACHE_TTL_MS) {
      aiSummary = cached.summary;
    } else {
      try {
        const topGapNames = calculation.gaps.slice(0, 3).map((g) => `${g.skillName} (Gap: ${g.gap}, Priority: ${g.priority})`).join(', ');
        const prompt = `Explain the key skill gaps for a learner targeting the role "${role.title}".
Overall readiness score: ${calculation.overallReadinessScore}%.
Top skill gaps: ${topGapNames || 'None, learner meets current requirements'}.
Provide a concise, encouraging 2-3 sentence strategic summary and highlight which gap to bridge first.`;

        // Non-blocking 3.5s timeout with LOW thinking so dashboard never hangs
        aiSummary = await generateGeminiCompletion(prompt, undefined, 0.2, {
          timeoutMs: 3500,
          thinkingLevel: 'LOW'
        });

        // Cache the result for subsequent instant loads
        summaryCache.set(cacheKey, { summary: aiSummary, cachedAt: Date.now() });
      } catch (err) {
        // Deterministic template summary on timeout or API unavailability
        aiSummary = getFallbackSkillSummary(role.title, calculation.overallReadinessScore, calculation.gaps);
      }
    }
  }

  return {
    userId,
    targetRoleId: role.id,
    targetRoleTitle: role.title,
    status: calculation.status,
    overallReadinessScore: calculation.overallReadinessScore,
    assessedSkillsCount: calculation.assessedSkillsCount,
    totalRequiredSkillsCount: calculation.totalSkillsCount,
    assessedRatioText: calculation.assessedRatioText,
    isPreliminary: calculation.isPreliminary,
    gaps: calculation.gaps,
    unassessedSkills: calculation.unassessedSkills,
    strengths: calculation.strengths,
    aiSummaryExplanation: aiSummary,
    analyzedAt: new Date().toISOString()
  };
}
