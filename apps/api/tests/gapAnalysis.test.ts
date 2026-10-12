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
    const result = await analyzeLearnerSkillGaps('user-without-target-role', '');
    expect(result.status).toBe('not_started');
    expect(result.overallReadinessScore).toBeNull();
    expect(result.targetRoleId).toBeNull();
    expect(result.gaps).toEqual([]);
    expect(result.strengths).toEqual([]);
  });
});
