import { describe, it, expect } from 'vitest';
import {
  sortGapsByImpact,
  isDashboardNotStarted,
  getDashboardReadiness,
  computeEstimatedReadinessGain,
  determineNextBestAction,
  computeReadinessScore,
  buildWeeklyPlanItems,
  buildDisplayGaps,
  calculateChecklistProgress
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

    it('ranks gaps by priorityScore matching AI synthesis so Highest-Impact step and AI synthesis always agree', () => {
      // Stakeholder Communication: gap 1.28, weight 1.5, priority critical (1.5) -> priorityScore = 2.88
      // Advanced SQL: gap 1.5, weight 1.4, priority high (1.25) -> priorityScore = 2.625
      const gaps: GapItem[] = [
        {
          skillId: 'adv-sql',
          skillName: 'Advanced SQL',
          requiredLevel: 3,
          currentLevel: 1.5,
          gap: 1.5,
          priority: 'high',
          weight: 1.4,
          priorityScore: 2.625
        },
        {
          skillId: 'stakeholder-mgt',
          skillName: 'Stakeholder Communication',
          requiredLevel: 4,
          currentLevel: 2.72,
          gap: 1.28,
          priority: 'critical',
          weight: 1.5,
          priorityScore: 2.88
        }
      ];

      const sorted = sortGapsByImpact(gaps);
      expect(sorted[0].skillName).toBe('Stakeholder Communication');
      expect(sorted[1].skillName).toBe('Advanced SQL');
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

    it('prompts to take diagnostic with no deficit or gain numbers when the highest-requirement skill is unassessed', () => {
      // Role requires TypeScript (level 5) and React (level 4).
      // React is assessed (gap 1.5), but TypeScript (highest requirement, level 5) is unassessed.
      const assessedGaps = [
        {
          skillId: 'react',
          skillName: 'React',
          domainName: 'Frontend',
          requiredLevel: 4,
          currentLevel: 2.5,
          gap: 1.5,
          isAssessed: true,
          priority: 'high' as const,
          priorityScore: 3.0,
          weight: 1.0
        }
      ];

      const unassessedSkills = [
        {
          skillId: 'typescript',
          skillName: 'TypeScript',
          requiredLevel: 5,
          weight: 1.5
        }
      ];

      const recommendations = [
        {
          course: {
            id: 'c-react',
            title: 'Mastering React',
            provider: 'freeCodeCamp',
            skillsCovered: ['React'],
            destinationUrl: 'https://example.com/react',
            difficulty: 'Intermediate' as const,
            estimatedHours: 10,
            language: 'English' as const,
            isFree: true,
            description: 'Learn React'
          },
          matchingSkill: 'React',
          recommendationReason: 'Bridges React gap'
        }
      ];

      const action = determineNextBestAction(assessedGaps, recommendations, [], unassessedSkills);

      expect(action.unassessedPrompt).toEqual({
        skillId: 'typescript',
        skillName: 'TypeScript'
      });
      expect(action.topGap).toBeNull();
      expect(action.topCourse).toBeNull();
      expect(action.estimatedGain).toBe(0);
    });

    it('handles empty gaps list safely', () => {
      const action = determineNextBestAction([], []);
      expect(action.topGap).toBeNull();
      expect(action.topCourse).toBeNull();
      expect(action.estimatedGain).toBe(0);
      expect(action.unassessedPrompt).toBeNull();
    });
  });

  describe('4. What-If Compare computing the same readiness as the backend', () => {
    it('suppresses readiness score (null) when fewer than 3 skills are assessed for a role', () => {
      // Role requirements: 3 skills with weights
      const roleRequirements = [
        { requiredProficiency: 4, weight: 1.5 },
        { requiredProficiency: 3, weight: 1.0 },
        { requiredProficiency: 5, weight: 2.0 }
      ];

      // Only 2 skills assessed (fewer than 3 skills)
      const userSkills = [
        { selfAssessedLevel: 3, verifiedScore: 4 },
        { selfAssessedLevel: 2, verifiedScore: null },
        { selfAssessedLevel: 4, verifiedScore: 5 }
      ];

      const score = computeReadinessScore(roleRequirements, userSkills);
      expect(score).toBeNull();
    });

    it('computes identical readiness score matching backend gapAnalysisEngine formula when at least 3 skills and 60% are assessed', () => {
      // Role requirements: 4 skills with weights
      const roleRequirements = [
        { requiredProficiency: 4, weight: 1.5 },
        { requiredProficiency: 3, weight: 1.0 },
        { requiredProficiency: 5, weight: 2.0 },
        { requiredProficiency: 3, weight: 1.0 }
      ];

      // Skill 1: assessed (self 3, verified 4) -> eff = 3.6, gap = 0.4, weightedReq = 6.0, weightedGap = 0.6
      // Skill 2: unassessed (verified null) -> Not included in readiness numerator/denominator
      // Skill 3: assessed (self 4, verified 5) -> eff = 4.6, gap = 0.4, weightedReq = 10.0, weightedGap = 0.8
      // Skill 4: assessed (self 3, verified 3) -> eff = 3.0, gap = 0.0, weightedReq = 3.0, weightedGap = 0.0
      // 3 of 4 assessed (75% >= 60% and 3 >= 3)
      // Assessed weighted req = 19.0, assessed weighted gap = 1.4
      // Readiness = round((1 - 1.4 / 19.0) * 100) = 93%
      const userSkills = [
        { selfAssessedLevel: 3, verifiedScore: 4 },
        { selfAssessedLevel: 2, verifiedScore: null },
        { selfAssessedLevel: 4, verifiedScore: 5 },
        { selfAssessedLevel: 3, verifiedScore: 3 }
      ];

      const score = computeReadinessScore(roleRequirements, userSkills);
      expect(score).toBe(93);
    });

    it('returns null readiness when 0 skills are assessed', () => {
      const roleRequirements = [
        { requiredProficiency: 4, weight: 1.5 },
        { requiredProficiency: 3, weight: 1.0 }
      ];
      const userSkills = [
        { selfAssessedLevel: 3, verifiedScore: null },
        { selfAssessedLevel: 2, verifiedScore: null }
      ];

      expect(computeReadinessScore(roleRequirements, userSkills)).toBeNull();
    });

    it('computes full assessment score when all skills have diagnostic answers', () => {
      const roleRequirements = [
        { requiredProficiency: 4, weight: 1.5 },
        { requiredProficiency: 3, weight: 1.0 },
        { requiredProficiency: 5, weight: 2.0 }
      ];
      const userSkills = [
        { selfAssessedLevel: 3, verifiedScore: 4 },
        { selfAssessedLevel: 2, verifiedScore: 2 },
        { selfAssessedLevel: 4, verifiedScore: 5 }
      ];

      // Total weighted req = 19.0. Total weighted gap = 0.6 + 1.0 + 0.8 = 2.4. (1 - 2.4/19)*100 = 87%
      expect(computeReadinessScore(roleRequirements, userSkills)).toBe(87);
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

    it('shows no gain (0) if readiness gain cannot be computed with the formula', () => {
      expect(computeEstimatedReadinessGain(null, [])).toBe(0);
      expect(computeEstimatedReadinessGain({ gap: 0, weight: 1 }, [{ required: 5 }])).toBe(0);
      expect(computeEstimatedReadinessGain({ gap: 2, weight: 1 }, [])).toBe(0);
    });

    it('proves identical numbers and contract output for Web and API imports using shared calculateReadiness', async () => {
      const { calculateReadiness } = await import('@skill-setu/shared');
      const reqs = [
        { skillId: 's1', skillName: 'React', requiredProficiency: 4, weight: 1.5 },
        { skillId: 's2', skillName: 'Node', requiredProficiency: 3, weight: 1.0 }
      ];
      const userAssessments = [
        { skillId: 's1', selfAssessedLevel: 2, verifiedScore: 3 },
        { skillId: 's2', selfAssessedLevel: 1, verifiedScore: null }
      ];

      const sharedOutput = calculateReadiness(reqs, userAssessments);
      const webScore = computeReadinessScore(
        reqs.map(r => ({ skillId: r.skillId, requiredProficiency: r.requiredProficiency, weight: r.weight })),
        userAssessments
      );

      expect(webScore).toBe(sharedOutput.overallReadinessScore);
      expect(sharedOutput.assessedRatioText).toBe('Based on 1 of 2 skills assessed');
      expect(sharedOutput.isPreliminary).toBe(false); // 1 is not fewer than 2/2 (1 == 1)
      expect(sharedOutput.gaps.length).toBe(1);
      expect(sharedOutput.gaps[0].skillId).toBe('s1');
      expect(sharedOutput.unassessedSkills.length).toBe(1);
      expect(sharedOutput.unassessedSkills[0].skillId).toBe('s2');
      expect(sharedOutput.unassessedSkills[0]).not.toHaveProperty('gap');
      expect(sharedOutput.unassessedSkills[0]).not.toHaveProperty('priorityScore');
    });

    it('verifies effectiveLevel = verifiedScore directly when no selfAssessedLevel is provided (no self=1 assumption)', async () => {
      const { calculateReadiness } = await import('@skill-setu/shared');
      const reqs = [
        { skillId: 's1', skillName: 'React', requiredProficiency: 4, weight: 1.0 }
      ];
      const userAssessments = [
        { skillId: 's1', verifiedScore: 3 } // no selfAssessedLevel
      ];

      const sharedOutput = calculateReadiness(reqs, userAssessments);
      expect(sharedOutput.gaps[0].currentLevel).toBe(3);
      expect(sharedOutput.gaps[0].gap).toBe(1); // 4 - 3 = 1 (if self=1 assumed: 4 - 2.2 = 1.8)
    });

    it('flags isPreliminary when fewer than half of skills are assessed (e.g. 1 of 3)', async () => {
      const { calculateReadiness } = await import('@skill-setu/shared');
      const reqs = [
        { skillId: 's1', skillName: 'React', requiredProficiency: 4, weight: 1.0 },
        { skillId: 's2', skillName: 'Node', requiredProficiency: 3, weight: 1.0 },
        { skillId: 's3', skillName: 'SQL', requiredProficiency: 3, weight: 1.0 }
      ];
      const userAssessments = [
        { skillId: 's1', selfAssessedLevel: 3, verifiedScore: 3 },
        { skillId: 's2', verifiedScore: null },
        { skillId: 's3', verifiedScore: null }
      ];

      const sharedOutput = calculateReadiness(reqs, userAssessments);
      expect(sharedOutput.isPreliminary).toBe(true);
      expect(sharedOutput.assessedSkillsCount).toBe(1);
      expect(sharedOutput.totalSkillsCount).toBe(3);
      expect(sharedOutput.unassessedSkills.length).toBe(2);
    });
  });

  describe('5. Weekly Plan and Gap Breakdown Helpers (Fix E)', () => {
    it('returns empty array when no recommended courses exist', () => {
      const items = buildWeeklyPlanItems([], 10);
      expect(items).toEqual([]);
    });

    it('builds specific weekly items from recommended courses when courses exist', () => {
      const recs: RecommendedCourseItem[] = [
        {
          course: {
            id: 'c1',
            title: 'Modern React Mastery',
            provider: 'Coursera',
            destinationUrl: 'https://coursera.org',
            difficulty: 'Intermediate',
            estimatedHours: 12
          },
          matchScore: 80,
          gapAddressed: 'React',
          recommendationReason: 'Covers React'
        },
        {
          course: {
            id: 'c2',
            title: 'Node.js Microservices',
            provider: 'Udemy',
            destinationUrl: 'https://udemy.com',
            difficulty: 'Advanced',
            estimatedHours: 8
          },
          matchScore: 65,
          gapAddressed: 'Node.js',
          recommendationReason: 'Covers Node.js'
        }
      ];

      const items = buildWeeklyPlanItems(recs, 10);
      expect(items.length).toBe(4);
      expect(items[0].text).toContain('React via Modern React Mastery');
      expect(items[1].text).toContain('Node.js via Node.js Microservices');
      expect(items[2].isRoutine).toBe(true);
      expect(items[3].isRoutine).toBe(true);
    });

    it('merges unassessed required skills into display gaps so no blank layout area appears', () => {
      const assessedGaps: GapItem[] = [
        {
          skillId: 's1',
          skillName: 'React',
          requiredLevel: 4,
          currentLevel: 2,
          gap: 2,
          priority: 'critical',
          weight: 1.5
        }
      ];

      const unassessed = [
        {
          skillId: 's2',
          skillName: 'TypeScript',
          requiredLevel: 3,
          priority: 'high' as const,
          weight: 1.2
        },
        {
          skillId: 's3',
          skillName: 'SQL',
          requiredLevel: 3,
          priority: 'medium' as const,
          weight: 1.0
        }
      ];

      const merged = buildDisplayGaps(assessedGaps, unassessed);
      expect(merged.length).toBe(3);
      expect(merged[0].skillId).toBe('s1');
      expect(merged[0].isAssessed).not.toBe(false);

      expect(merged[1].skillId).toBe('s2');
      expect(merged[1].isAssessed).toBe(false);
      expect(merged[1].currentLevel).toBeNull();

      expect(merged[2].skillId).toBe('s3');
      expect(merged[2].isAssessed).toBe(false);
    });
  });

  describe('6. Checklist with and without a saved role', () => {
    it('returns step 1 unchecked and 0 of 4 completed for a brand-new user with no saved role', () => {
      const result = calculateChecklistProgress(false, {
        diagnosticAttemptsCount: 0,
        activeGapsCount: 0,
        completedCoursesCount: 0
      });
      expect(result.step1Completed).toBe(false);
      expect(result.step2Completed).toBe(false);
      expect(result.step3Completed).toBe(false);
      expect(result.step4Completed).toBe(false);
      expect(result.completedCount).toBe(0);
      expect(result.totalCount).toBe(4);
    });

    it('returns step 1 checked and at least 1 of 4 completed when a saved target role exists', () => {
      const result = calculateChecklistProgress(true, {
        diagnosticAttemptsCount: 0,
        activeGapsCount: 0,
        completedCoursesCount: 0
      });
      expect(result.step1Completed).toBe(true);
      expect(result.completedCount).toBe(1);
    });

    it('returns step 1 and step 2 checked when role is saved and diagnostic is completed', () => {
      const result = calculateChecklistProgress(true, {
        diagnosticAttemptsCount: 1,
        activeGapsCount: 1,
        completedCoursesCount: 0
      });
      expect(result.step1Completed).toBe(true);
      expect(result.step2Completed).toBe(true);
      expect(result.step3Completed).toBe(true);
      expect(result.completedCount).toBe(3);
    });

    it('handles null stats gracefully without throwing', () => {
      const result = calculateChecklistProgress(false, null);
      expect(result.step1Completed).toBe(false);
      expect(result.completedCount).toBe(0);
    });
  });
});
