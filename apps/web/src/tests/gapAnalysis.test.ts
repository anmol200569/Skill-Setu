import { describe, it, expect } from 'vitest';
import {
  determineSkillStatus,
  calculateGapPriorityScore,
  enrichGapItem,
  sortGapsByPriority,
  getTopPriorityGaps,
  mapSkillsToRadarData,
  calculateAssessmentCoverage,
  GapItemInput
} from '../lib/gapAnalysis';

describe('Skill Gap Analysis & Pure Logic Unit Tests', () => {
  describe('1. determineSkillStatus (Status Labelling)', () => {
    it('returns "notAssessed" when currentLevel is null or undefined', () => {
      expect(determineSkillStatus(null, 4)).toBe('notAssessed');
      expect(determineSkillStatus(undefined, 3)).toBe('notAssessed');
    });

    it('returns "notAssessed" when isAssessed is explicitly false', () => {
      expect(determineSkillStatus(3, 4, false)).toBe('notAssessed');
      expect(determineSkillStatus(5, 3, false)).toBe('notAssessed');
    });

    it('returns "strong" when achieved level meets or exceeds the required target', () => {
      expect(determineSkillStatus(4, 4)).toBe('strong');
      expect(determineSkillStatus(5, 3)).toBe('strong');
      expect(determineSkillStatus(3.5, 3)).toBe('strong');
    });

    it('returns "needsImprovement" when achieved level is below the required target', () => {
      expect(determineSkillStatus(2, 4)).toBe('needsImprovement');
      expect(determineSkillStatus(0, 3)).toBe('needsImprovement');
      expect(determineSkillStatus(3.9, 4)).toBe('needsImprovement');
    });
  });

  describe('2. calculateGapPriorityScore & enrichGapItem (Priority Calculation)', () => {
    it('calculates priority score as role weight multiplied by gap size', () => {
      // gap = 2, weight = 1.5 -> score = 3.0
      expect(calculateGapPriorityScore(2, 1.5)).toBe(3.0);
      // gap = 1.5, weight = 1.2 -> score = 1.8
      expect(calculateGapPriorityScore(1.5, 1.2)).toBe(1.8);
    });

    it('clamps negative or zero gap size to 0 so exceeded targets have zero priority score', () => {
      expect(calculateGapPriorityScore(-1.5, 1.5)).toBe(0);
      expect(calculateGapPriorityScore(0, 2.0)).toBe(0);
    });

    it('enriches raw gap items with status, gap size, and priority score', () => {
      const raw: GapItemInput = {
        skillId: 's1',
        skillName: 'React Architecture',
        currentLevel: 2,
        requiredLevel: 4,
        weight: 1.5,
      };

      const enriched = enrichGapItem(raw);
      expect(enriched.isAssessed).toBe(true);
      expect(enriched.current).toBe(2);
      expect(enriched.required).toBe(4);
      expect(enriched.gapSize).toBe(2);
      expect(enriched.priorityScore).toBe(3.0);
      expect(enriched.status).toBe('needsImprovement');
    });

    it('correctly enriches unassessed skills with gap size 0 and notAssessed status', () => {
      const raw: GapItemInput = {
        skillId: 's2',
        skillName: 'System Architecture',
        currentLevel: null,
        requiredLevel: 5,
        weight: 2.0,
      };

      const enriched = enrichGapItem(raw);
      expect(enriched.isAssessed).toBe(false);
      expect(enriched.current).toBe(0);
      expect(enriched.gapSize).toBe(0);
      expect(enriched.priorityScore).toBe(0);
      expect(enriched.status).toBe('notAssessed');
    });
  });

  describe('3. sortGapsByPriority (Gap Sorting)', () => {
    it('sorts gaps by priority score descending (weight x gap size)', () => {
      const items: GapItemInput[] = [
        {
          skillName: 'TypeScript',
          currentLevel: 3,
          requiredLevel: 4,
          weight: 1.0, // gap 1 * 1.0 = 1.0
        },
        {
          skillName: 'Docker Containers',
          currentLevel: 1,
          requiredLevel: 5,
          weight: 1.5, // gap 4 * 1.5 = 6.0
        },
        {
          skillName: 'SQL Databases',
          currentLevel: 2,
          requiredLevel: 4,
          weight: 1.2, // gap 2 * 1.2 = 2.4
        },
      ];

      const sorted = sortGapsByPriority(items);
      expect(sorted[0].skillName).toBe('Docker Containers');
      expect(sorted[0].priorityScore).toBe(6.0);
      expect(sorted[1].skillName).toBe('SQL Databases');
      expect(sorted[1].priorityScore).toBe(2.4);
      expect(sorted[2].skillName).toBe('TypeScript');
      expect(sorted[2].priorityScore).toBe(1.0);
    });

    it('breaks ties using larger gap size when priority scores match', () => {
      const items: GapItemInput[] = [
        {
          skillName: 'Skill A',
          currentLevel: 3,
          requiredLevel: 5,
          weight: 1.0, // gap 2, score 2.0
        },
        {
          skillName: 'Skill B',
          currentLevel: 4,
          requiredLevel: 5,
          weight: 2.0, // gap 1, score 2.0
        },
      ];

      const sorted = sortGapsByPriority(items);
      expect(sorted[0].skillName).toBe('Skill A');
      expect(sorted[0].gapSize).toBe(2);
      expect(sorted[1].skillName).toBe('Skill B');
      expect(sorted[1].gapSize).toBe(1);
    });

    it('handles empty input list without throwing', () => {
      expect(sortGapsByPriority([])).toEqual([]);
    });
  });

  describe('4. getTopPriorityGaps (Top 3 Priority Gaps Highlight)', () => {
    it('returns the top 3 gaps requiring improvement and excludes strong or unassessed skills', () => {
      const items: GapItemInput[] = [
        {
          skillName: 'React',
          currentLevel: 4,
          requiredLevel: 4, // Strong (met target)
          weight: 2.0,
        },
        {
          skillName: 'GraphQL',
          currentLevel: null, // Not assessed
          requiredLevel: 4,
          weight: 1.5,
        },
        {
          skillName: 'Kubernetes',
          currentLevel: 1,
          requiredLevel: 4, // gap 3 * 1.5 = 4.5
          weight: 1.5,
        },
        {
          skillName: 'PostgreSQL',
          currentLevel: 2,
          requiredLevel: 4, // gap 2 * 1.2 = 2.4
          weight: 1.2,
        },
        {
          skillName: 'Testing with Vitest',
          currentLevel: 2,
          requiredLevel: 3, // gap 1 * 1.0 = 1.0
          weight: 1.0,
        },
        {
          skillName: 'CI/CD Pipelines',
          currentLevel: 2,
          requiredLevel: 3, // gap 1 * 0.8 = 0.8
          weight: 0.8,
        },
      ];

      const topGaps = getTopPriorityGaps(items, 3);
      expect(topGaps.length).toBe(3);
      expect(topGaps[0].skillName).toBe('Kubernetes');
      expect(topGaps[1].skillName).toBe('PostgreSQL');
      expect(topGaps[2].skillName).toBe('Testing with Vitest');
      // Ensure React (strong) and GraphQL (unassessed) are excluded from active priority gaps
      expect(topGaps.some((g) => g.skillName === 'React')).toBe(false);
      expect(topGaps.some((g) => g.skillName === 'GraphQL')).toBe(false);
    });

    it('returns empty array when all skills are strong (no active gaps)', () => {
      const items: GapItemInput[] = [
        { skillName: 'TypeScript', currentLevel: 5, requiredLevel: 4 },
        { skillName: 'React', currentLevel: 4, requiredLevel: 3 },
      ];
      expect(getTopPriorityGaps(items, 3)).toEqual([]);
    });
  });

  describe('5. mapSkillsToRadarData (Chart Data Mapping)', () => {
    it('filters out unassessed skills and maps achieved vs target rounded to 1 decimal', () => {
      const skills = [
        { skill: 'React', fullSkill: 'React Framework', current: 3.25, required: 4.0 },
        { skill: 'Docker', fullSkill: 'Docker DevOps', current: null, required: 3.0 },
        { skill: 'Node.js', current: 2.7, required: 3.5 },
      ];

      const radarPoints = mapSkillsToRadarData(skills);
      expect(radarPoints.length).toBe(2);
      expect(radarPoints[0]).toEqual({
        skill: 'React',
        fullSkill: 'React Framework',
        achieved: 3.3,
        target: 4.0,
      });
      expect(radarPoints[1]).toEqual({
        skill: 'Node.js',
        fullSkill: 'Node.js',
        achieved: 2.7,
        target: 3.5,
      });
    });

    it('returns empty array if all skills are unassessed', () => {
      const skills = [
        { skill: 'Go', current: null, required: 4 },
        { skill: 'Rust', current: undefined, required: 3 },
      ];
      expect(mapSkillsToRadarData(skills)).toEqual([]);
    });
  });

  describe('6. calculateAssessmentCoverage (Coverage & Thresholds)', () => {
    it('calculates percentage of role requirements assessed', () => {
      const coverage = calculateAssessmentCoverage(3, 5, 60);
      expect(coverage.coveragePercent).toBe(60);
      expect(coverage.isSufficient).toBe(true);
    });

    it('flags coverage as insufficient when below 60%', () => {
      const coverage = calculateAssessmentCoverage(2, 5, 60);
      expect(coverage.coveragePercent).toBe(40);
      expect(coverage.isSufficient).toBe(false);
    });

    it('flags coverage as insufficient when fewer than 3 skills assessed even if percentage >= 60%', () => {
      // 2 out of 2 is 100%, but fewer than 3 skills assessed
      const coverage = calculateAssessmentCoverage(2, 2, 60);
      expect(coverage.coveragePercent).toBe(100);
      expect(coverage.isSufficient).toBe(false);
    });

    it('handles zero total skills without division by zero errors', () => {
      const coverage = calculateAssessmentCoverage(0, 0, 60);
      expect(coverage.coveragePercent).toBe(0);
      expect(coverage.isSufficient).toBe(false);
    });
  });
});
