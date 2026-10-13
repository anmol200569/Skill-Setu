import { describe, it, expect, beforeEach } from 'vitest';
import { config } from '../src/config';
import {
  computeGapStateHash,
  getFallbackSkillSummary,
  clearSummaryCache
} from '../src/services/gapAnalysisEngine';
import { SkillGapItem } from '@skill-setu/shared';

describe('Gemini Optimization, Caching & Fallback Unit Tests', () => {
  beforeEach(() => {
    clearSummaryCache();
  });

  const sampleGaps: SkillGapItem[] = [
    {
      skillId: 'adv-sql',
      skillName: 'Advanced SQL & Query Optimization',
      domainName: 'Data & Analytics',
      requiredLevel: 4,
      currentLevel: 2,
      isAssessed: true,
      gap: 2,
      priority: 'critical',
      priorityScore: 9.6,
      weight: 1.6
    },
    {
      skillId: 'sys-design',
      skillName: 'System Design & Scalability',
      domainName: 'Programming & Software Development',
      requiredLevel: 3,
      currentLevel: 1.5,
      isAssessed: true,
      gap: 1.5,
      priority: 'high',
      priorityScore: 4.5,
      weight: 1.0
    }
  ];

  it('configurable GEMINI_TIMEOUT_MS is parsed as a number', () => {
    expect(typeof config.gemini.timeoutMs).toBe('number');
    expect(config.gemini.timeoutMs).toBeGreaterThanOrEqual(1000);
  });

  it('computes deterministic md5 hash for gap state signatures', () => {
    const hash1 = computeGapStateHash('user-1', 'role-1', 65, sampleGaps);
    const hash2 = computeGapStateHash('user-1', 'role-1', 65, sampleGaps);
    const hashDifferentScore = computeGapStateHash('user-1', 'role-1', 75, sampleGaps);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{32}$/);
    expect(hash1).not.toBe(hashDifferentScore);
  });

  it('returns high-clarity template fallback summary when AI times out', () => {
    const fallback = getFallbackSkillSummary('Data Analyst', 65, sampleGaps);
    expect(fallback).toContain('Data Analyst');
    expect(fallback).toContain('65%');
    expect(fallback).toContain('Advanced SQL & Query Optimization');
    expect(fallback).toContain('System Design & Scalability');
  });

  it('handles empty gap list gracefully in fallback summary', () => {
    const fallback = getFallbackSkillSummary('Full-Stack Developer', 100, []);
    expect(fallback).toContain('Full-Stack Developer');
    expect(fallback).toContain('100%');
    expect(fallback).toContain('meet the target proficiency');
  });
});
