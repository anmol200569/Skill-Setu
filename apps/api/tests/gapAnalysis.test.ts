import { describe, it, expect } from 'vitest';
import { computeSkillGapMetrics, RawSkillInput } from '../src/services/gapAnalysisEngine';

describe('Skill Gap Analysis & Readiness Engine', () => {
  const sampleRequirements = [
    {
      skillId: 'ts-js',
      skillName: 'TypeScript & JavaScript',
      domainName: 'Programming & Software Development',
      requiredProficiency: 4,
      priority: 'must_have' as const,
      weight: 1.5
    },
    {
      skillId: 'react',
      skillName: 'React & Modern Frontend',
      domainName: 'Programming & Software Development',
      requiredProficiency: 4,
      priority: 'must_have' as const,
      weight: 1.5
    },
    {
      skillId: 'sys-design',
      skillName: 'System Design & Scalability',
      domainName: 'Programming & Software Development',
      requiredProficiency: 3,
      priority: 'good_to_have' as const,
      weight: 1.0
    }
  ];

  it('computes effective level using 40% self-assessment + 60% diagnostic verified score', () => {
    const userSkills: RawSkillInput[] = [
      {
        skillId: 'ts-js',
        selfAssessedLevel: 2,
        verifiedScore: 4
      }
    ];

    const result = computeSkillGapMetrics(sampleRequirements, userSkills);
    const tsGap = result.gaps.find((g) => g.skillId === 'ts-js');

    expect(tsGap).toBeDefined();
    // 0.4 * 2 + 0.6 * 4 = 0.8 + 2.4 = 3.2
    expect(tsGap?.currentLevel).toBe(3.2);
    // Required 4 - Effective 3.2 = 0.8
    expect(tsGap?.gap).toBe(0.8);
  });

  it('correctly calculates 100% readiness when learner meets all required levels', () => {
    const userSkills: RawSkillInput[] = [
      { skillId: 'ts-js', selfAssessedLevel: 4, verifiedScore: 4 },
      { skillId: 'react', selfAssessedLevel: 4, verifiedScore: 4 },
      { skillId: 'sys-design', selfAssessedLevel: 3, verifiedScore: 3 }
    ];

    const result = computeSkillGapMetrics(sampleRequirements, userSkills);
    expect(result.overallReadinessScore).toBe(100);
    expect(result.gaps.length).toBe(0);
    expect(result.strengths.length).toBe(3);
  });

  it('prioritizes must_have critical gaps over optional gaps in priorityScore ranking', () => {
    const userSkills: RawSkillInput[] = [
      { skillId: 'ts-js', selfAssessedLevel: 1, verifiedScore: 1 }, // gap = 3, must_have (1.5x) -> score 6.75
      { skillId: 'react', selfAssessedLevel: 4, verifiedScore: 4 }, // satisfied, gap = 0
      { skillId: 'sys-design', selfAssessedLevel: 1, verifiedScore: 1 } // gap = 2, good_to_have (1.0x) -> score 2.0
    ];

    const result = computeSkillGapMetrics(sampleRequirements, userSkills);
    expect(result.gaps[0].skillId).toBe('ts-js');
    expect(result.gaps[0].priority).toBe('critical');
    expect(result.gaps[0].priorityScore).toBeGreaterThan(result.gaps[1].priorityScore);
  });

  it('enforces overall readiness bounded between 0 and 100', () => {
    const userSkills: RawSkillInput[] = [
      { skillId: 'ts-js', selfAssessedLevel: 1, verifiedScore: 1 },
      { skillId: 'react', selfAssessedLevel: 1, verifiedScore: 1 },
      { skillId: 'sys-design', selfAssessedLevel: 1, verifiedScore: 1 }
    ];

    const result = computeSkillGapMetrics(sampleRequirements, userSkills);
    expect(result.overallReadinessScore).toBeGreaterThanOrEqual(0);
    expect(result.overallReadinessScore).toBeLessThanOrEqual(100);
  });

  it('returns explicit not_started state with null readiness when user has no target role', async () => {
    const { analyzeLearnerSkillGaps } = await import('../src/services/gapAnalysisEngine');
    const { prisma } = await import('../src/lib/prisma');
    const { vi } = await import('vitest');

    vi.spyOn(prisma.profile, 'findUnique').mockResolvedValue(null);

    const result = await analyzeLearnerSkillGaps('user-without-target-role', '');
    expect(result.status).toBe('not_started');
    expect(result.overallReadinessScore).toBeNull();
    expect(result.targetRoleId).toBeNull();
    expect(result.gaps).toEqual([]);
    expect(result.strengths).toEqual([]);
  });

  describe('Strict Assessment Contract: 0, Partial, Full Assessment and Shared Formula Parity', () => {
    it('returns not_started with null readiness and unassessed skills in unassessedSkills list when 0 skills assessed', () => {
      // User with 0 diagnostic answers (verifiedScore is null / undefined)
      const userSkills: RawSkillInput[] = [
        { skillId: 'ts-js', selfAssessedLevel: 2, verifiedScore: null },
        { skillId: 'react', selfAssessedLevel: 3, verifiedScore: null }
      ];

      const result = computeSkillGapMetrics(sampleRequirements, userSkills);

      expect(result.status).toBe('not_started');
      expect(result.overallReadinessScore).toBeNull();
      expect(result.assessedSkillsCount).toBe(0);
      expect(result.totalSkillsCount).toBe(3);
      expect(result.assessedRatioText).toBe('Based on 0 of 3 skills assessed');
      expect(result.isPreliminary).toBe(false);

      // Gaps must only contain assessed skills; unassessed skills must be in unassessedSkills without numeric deficit
      expect(result.gaps).toEqual([]);
      expect(result.unassessedSkills.length).toBe(3);
      for (const unassessed of result.unassessedSkills) {
        expect(unassessed).toHaveProperty('skillId');
        expect(unassessed).toHaveProperty('skillName');
        expect(unassessed).toHaveProperty('requiredLevel');
        expect(unassessed).not.toHaveProperty('gap');
        expect(unassessed).not.toHaveProperty('priorityScore');
      }
    });

    it('computes effectiveLevel = verifiedScore directly when user has no self-assessed level (do NOT assume self = 1)', () => {
      // User has verified score 3.0 on ts-js (required 4.0), but no selfAssessedLevel
      const userSkills: RawSkillInput[] = [
        { skillId: 'ts-js', verifiedScore: 3.0 }
      ];

      const result = computeSkillGapMetrics(sampleRequirements, userSkills);
      expect(result.assessedSkillsCount).toBe(1);
      const tsGap = result.gaps.find((g) => g.skillId === 'ts-js');
      expect(tsGap).toBeDefined();
      // If self assumed 1: eff = 0.4*1 + 0.6*3 = 2.2 -> gap 1.8
      // Under rule (no assumption): eff = 3.0 -> gap = 4.0 - 3.0 = 1.0
      expect(tsGap?.currentLevel).toBe(3.0);
      expect(tsGap?.gap).toBe(1.0);
    });

    it('flags isPreliminary when fewer than half of the role skills are assessed (e.g. 1 of 3)', () => {
      // Only ts-js has a verified diagnostic score
      const userSkills: RawSkillInput[] = [
        { skillId: 'ts-js', selfAssessedLevel: 2, verifiedScore: 4 },
        { skillId: 'react', selfAssessedLevel: 1, verifiedScore: null },
        { skillId: 'sys-design', selfAssessedLevel: 1, verifiedScore: null }
      ];

      const result = computeSkillGapMetrics(sampleRequirements, userSkills);

      expect(result.status).toBe('active');
      expect(result.assessedSkillsCount).toBe(1);
      expect(result.totalSkillsCount).toBe(3);
      expect(result.assessedRatioText).toBe('Based on 1 of 3 skills assessed');
      expect(result.isPreliminary).toBe(true); // 1 < 3/2 -> preliminary

      // ts-js is assessed: effective = 0.4*2 + 0.6*4 = 3.2. Gap = 4 - 3.2 = 0.8
      // Readiness from assessed skills: (1 - (0.8*1.5) / (4*1.5)) * 100 = (1 - 1.2 / 6.0) * 100 = 80%
      expect(result.overallReadinessScore).toBe(80);

      // Assessed gaps contain only ts-js; unassessedSkills contain react & sys-design
      expect(result.gaps.length).toBe(1);
      expect(result.gaps[0].skillId).toBe('ts-js');
      expect(result.unassessedSkills.length).toBe(2);
      expect(result.unassessedSkills.map((u) => u.skillId)).toEqual(['react', 'sys-design']);
    });

    it('computes readiness across all requirements in full assessment (3 of 3) with isPreliminary = false', () => {
      const userSkills: RawSkillInput[] = [
        { skillId: 'ts-js', selfAssessedLevel: 3, verifiedScore: 4 }, // eff = 3.6, gap = 0.4
        { skillId: 'react', selfAssessedLevel: 4, verifiedScore: 3 }, // eff = 3.4, gap = 0.6
        { skillId: 'sys-design', selfAssessedLevel: 2, verifiedScore: 3 } // eff = 2.6, gap = 0.4
      ];

      const result = computeSkillGapMetrics(sampleRequirements, userSkills);

      expect(result.status).toBe('active');
      expect(result.assessedSkillsCount).toBe(3);
      expect(result.totalSkillsCount).toBe(3);
      expect(result.assessedRatioText).toBe('Based on 3 of 3 skills assessed');
      expect(result.isPreliminary).toBe(false); // 3 >= 3/2
      expect(result.unassessedSkills.length).toBe(0);
      expect(result.gaps.length).toBe(3);
    });

    it('proves identical numbers for shared readiness formula across API and Web', async () => {
      const { calculateReadiness } = await import('@skill-setu/shared');

      const inputs = [
        { skillId: 'ts-js', selfAssessedLevel: 3, verifiedScore: 4 },
        { skillId: 'react', selfAssessedLevel: 2, verifiedScore: 3 },
        { skillId: 'sys-design', selfAssessedLevel: 1, verifiedScore: null }
      ];

      const apiResult = computeSkillGapMetrics(sampleRequirements, inputs);
      const sharedResult = calculateReadiness(sampleRequirements, inputs);

      expect(apiResult.overallReadinessScore).toBe(sharedResult.overallReadinessScore);
      expect(apiResult.assessedSkillsCount).toBe(sharedResult.assessedSkillsCount);
      expect(apiResult.assessedRatioText).toBe(sharedResult.assessedRatioText);
      expect(apiResult.isPreliminary).toBe(sharedResult.isPreliminary);
      expect(apiResult.gaps).toEqual(sharedResult.gaps);
      expect(apiResult.unassessedSkills).toEqual(sharedResult.unassessedSkills);
    });

    it('verifies weighted averaging honors role requirement weights in readiness calculation', async () => {
      const { calculateReadiness } = await import('@skill-setu/shared');

      // Two skills with equal required proficiency (4.0), but different weights: 3.0 vs 1.0
      const weightedReqs = [
        { skillId: 'heavy-skill', skillName: 'Heavy Skill', requiredProficiency: 4, weight: 3.0 },
        { skillId: 'light-skill', skillName: 'Light Skill', requiredProficiency: 4, weight: 1.0 }
      ];

      // Case A: User masters heavy-skill (verified 4), but has 0 in light-skill (verified 0)
      // totalRequired = 4*3 + 4*1 = 16. gap = 0 in heavy, 4 in light. totalGap = 0*3 + 4*1 = 4.
      // Readiness = (1 - 4/16) * 100 = 75%
      const caseA = calculateReadiness(weightedReqs, [
        { skillId: 'heavy-skill', selfAssessedLevel: 4, verifiedScore: 4 },
        { skillId: 'light-skill', selfAssessedLevel: 0, verifiedScore: 0 }
      ]);
      expect(caseA.overallReadinessScore).toBe(75);

      // Case B: User masters light-skill (verified 4), but has 0 in heavy-skill (verified 0)
      // totalRequired = 16. gap = 4 in heavy, 0 in light. totalGap = 4*3 + 0*1 = 12.
      // Readiness = (1 - 12/16) * 100 = 25%
      const caseB = calculateReadiness(weightedReqs, [
        { skillId: 'heavy-skill', selfAssessedLevel: 0, verifiedScore: 0 },
        { skillId: 'light-skill', selfAssessedLevel: 4, verifiedScore: 4 }
      ]);
      expect(caseB.overallReadinessScore).toBe(25);
    });
  });
});

