import { describe, it, expect } from 'vitest';
import {
  sortGapsByImpact,
  isDashboardNotStarted,
  getDashboardReadiness,
  computeEstimatedReadinessGain,
  determineNextBestAction,
  computeReadinessScore
} from '../lib/dashboardLogic';
import { GapItem, RecommendedCourseItem } from '../pages/learner/DashboardPage';

describe('Dashboard Pure Logic & Metrics Unit Tests', () => {
  describe('1. Gaps sorted by impact (largest deficit first)', () => {
    it('sorts gaps in descending order of absolute deficit', () => {
      const unsortedGaps: GapItem[] = [
        {
          skillId: 's1',
          skillName: 'TypeScript',
          domainName: 'Programming',
          requiredLevel: 4,
          currentLevel: 3,
          gap: -1.0,
          priority: 'medium',
          weight: 1.0
        },
        {
          skillId: 's2',
          skillName: 'Containers & Docker',
          domainName: 'DevOps',
          requiredLevel: 5,
          currentLevel: 1,
          gap: -4.0,
          priority: 'critical',
          weight: 1.5
        },
        {
          skillId: 's3',
          skillName: 'System Design',
          domainName: 'Architecture',
          requiredLevel: 4,
          currentLevel: 2,
          gap: -2.0,
          priority: 'high',
          weight: 1.2
        }
      ];

      const sorted = sortGapsByImpact(unsortedGaps);

      expect(sorted[0].skillName).toBe('Containers & Docker');
      expect(sorted[0].gap).toBe(-4.0);
      expect(sorted[1].skillName).toBe('System Design');
      expect(sorted[1].gap).toBe(-2.0);
      expect(sorted[2].skillName).toBe('TypeScript');
      expect(sorted[2].gap).toBe(-1.0);
    });

    it('handles empty gap list gracefully', () => {
      expect(sortGapsByImpact([])).toEqual([]);
    });
  });

  describe('2. "not_started" state with no numbers when no target role', () => {
    it('returns not_started state when stats has status "not_started"', () => {
      const stats = { status: 'not_started', targetRoleId: null, overallReadiness: null };
      const profile = { targetRoleId: null };

      expect(isDashboardNotStarted(stats, profile)).toBe(true);
      expect(getDashboardReadiness(stats, profile)).toBeNull();
    });

    it('returns not_started state when both stats and profile have no targetRoleId', () => {
      const stats = { status: 'active', targetRoleId: null, overallReadiness: 50 };
      const profile = { targetRoleId: null };

      expect(isDashboardNotStarted(stats, profile)).toBe(true);
      expect(getDashboardReadiness(stats, profile)).toBeNull();
    });

    it('returns active status and numeric readiness when user has a target role', () => {
      const stats = {
        status: 'active',
        targetRoleId: 'role-fullstack',
        overallReadiness: 72
      };
      const profile = { targetRoleId: 'role-fullstack' };

      expect(isDashboardNotStarted(stats, profile)).toBe(false);
      expect(getDashboardReadiness(stats, profile)).toBe(72);
    });

    it('returns null readiness when stats is missing or undefined', () => {
      expect(getDashboardReadiness(null, null)).toBeNull();
    });
  });

  describe('3. Next Best Action choosing the highest-impact gap', () => {
    it('selects the highest-impact gap as topGap and computes real readiness gain', () => {
      const sortedGaps: GapItem[] = [
        {
          skillId: 'docker-1',
          skillName: 'Containers & Docker',
          domainName: 'DevOps',
          requiredLevel: 4,
          currentLevel: 1,
          gap: 3.0,
          priority: 'critical',
          weight: 1.0
        },
        {
          skillId: 'netsec-1',
          skillName: 'Network Security',
          domainName: 'Security',
          requiredLevel: 3,
          currentLevel: 2,
          gap: 1.0,
          priority: 'medium',
          weight: 1.0
        }
      ];

      const recommendations: RecommendedCourseItem[] = [
        {
          course: {
            id: 'c1',
            title: 'Docker Hands-On Workshop',
            provider: 'freeCodeCamp',
            estimatedHours: 10,
            difficulty: 'Intermediate',
            isFree: true,
            destinationUrl: 'https://docker.example.com'
          },
          matchingSkill: 'Containers & Docker',
          matchPercentage: 95,
          recommendationReason: 'Bridges highest-impact container gap'
        }
      ];

      const radarSkills = [
        { required: 4, weight: 1.0 },
        { required: 4, weight: 1.0 },
        { required: 4, weight: 1.0 },
        { required: 4, weight: 1.0 },
        { required: 3, weight: 1.0 }
      ]; // total required = 19

      const action = determineNextBestAction(sortedGaps, recommendations, radarSkills);

      expect(action.topGap?.skillName).toBe('Containers & Docker');
      expect(action.topCourse?.course.title).toBe('Docker Hands-On Workshop');
      // Gain = round((3 * 1.0 / 19) * 100) = 16
      expect(action.estimatedGain).toBe(16);
    });

    it('handles empty gaps list safely', () => {
      const action = determineNextBestAction([], []);
      expect(action.topGap).toBeNull();
      expect(action.topCourse).toBeNull();
      expect(action.estimatedGain).toBe(0);
    });
  });

  describe('4. What-If Compare computing the same readiness as the backend', () => {
    it('computes identical readiness score matching backend gapAnalysisEngine formula', () => {
      // Role requirements: 3 skills with weights
      const roleRequirements = [
        { requiredProficiency: 4, weight: 1.5 },
        { requiredProficiency: 3, weight: 1.0 },
        { requiredProficiency: 5, weight: 2.0 }
      ];
      // Total weighted required: (4*1.5) + (3*1.0) + (5*2.0) = 6.0 + 3.0 + 10.0 = 19.0

      // User skills:
      // Skill 1: self 3, verified 4 -> effective = 0.4*3 + 0.6*4 = 1.2 + 2.4 = 3.6 -> gap = max(0, 4 - 3.6) = 0.4
      // Skill 2: self 2, verified null -> effective = 2.0 -> gap = max(0, 3 - 2) = 1.0
      // Skill 3: self 4, verified 5 -> effective = 0.4*4 + 0.6*5 = 1.6 + 3.0 = 4.6 -> gap = max(0, 5 - 4.6) = 0.4
      // Total weighted gap: (0.4 * 1.5) + (1.0 * 1.0) + (0.4 * 2.0) = 0.6 + 1.0 + 0.8 = 2.4
      // Raw readiness = (1 - 2.4 / 19.0) * 100 = (1 - 0.126315) * 100 = 87.368% -> round = 87
      const userSkills = [
        { selfAssessedLevel: 3, verifiedScore: 4 },
        { selfAssessedLevel: 2, verifiedScore: null },
        { selfAssessedLevel: 4, verifiedScore: 5 }
      ];

      const score = computeReadinessScore(roleRequirements, userSkills);
      expect(score).toBe(87);
    });

    it('returns 100% when all requirements are fully exceeded', () => {
      const roleRequirements = [
        { requiredProficiency: 3, weight: 1.0 },
        { requiredProficiency: 2, weight: 1.0 }
      ];
      const userSkills = [
        { selfAssessedLevel: 5, verifiedScore: 5 },
        { selfAssessedLevel: 4, verifiedScore: 4 }
      ];

      expect(computeReadinessScore(roleRequirements, userSkills)).toBe(100);
    });

    it('returns 0% when no skills are acquired and maximum gap exists', () => {
      const roleRequirements = [
        { requiredProficiency: 5, weight: 1.0 }
      ];
      const userSkills = [
        { selfAssessedLevel: 0, verifiedScore: 0 }
      ];

      expect(computeReadinessScore(roleRequirements, userSkills)).toBe(0);
    });
  });
});
