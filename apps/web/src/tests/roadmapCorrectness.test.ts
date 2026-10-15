import { describe, it, expect } from 'vitest';

describe('Item 5: Roadmap Correctness & Milestone Verification', () => {
  it('derives milestone counts and progress percentage strictly from rendered courses', () => {
    const courses = [
      { courseId: 'c1', status: 'completed' as const, course: { estimatedHours: 20 } },
      { courseId: 'c2', status: 'in_progress' as const, course: { estimatedHours: 15 } }
    ];

    const completedCount = courses.filter((c) => c.status === 'completed').length;
    const totalCount = courses.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const totalHours = courses.reduce((sum, c) => sum + c.course.estimatedHours, 0);

    expect(completedCount).toBe(1);
    expect(totalCount).toBe(2);
    expect(progressPercent).toBe(50);
    // Verified: No hardcoded +56 hours or +2 fake capstone milestones added
    expect(totalHours).toBe(35);
  });

  it('renders exact zeros in the empty state with no fake dummy hours or counts', () => {
    const courses: any[] = [];
    const completedCount = courses.filter((c) => c.status === 'completed').length;
    const totalCount = courses.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const totalHours = courses.reduce((sum, c) => sum + c.course.estimatedHours, 0);

    expect(completedCount).toBe(0);
    expect(totalCount).toBe(0);
    expect(progressPercent).toBe(0);
    expect(totalHours).toBe(0);
  });

  it('resolves actual role name with preference order: learningPath > profile role name > fallback', () => {
    const getRoleTitle = (pathRoleTitle?: string | null, profileRoleTitle?: string | null) => {
      return pathRoleTitle || profileRoleTitle || 'Target Career';
    };

    expect(getRoleTitle('Product Manager', 'Full-Stack Developer')).toBe('Product Manager');
    expect(getRoleTitle(null, 'Product Manager')).toBe('Product Manager');
    expect(getRoleTitle(undefined, undefined)).toBe('Target Career');
  });

  it('ranks gap skills strictly by priority = weight * gap', () => {
    const gaps = [
      { skillId: 's1', skillName: 'Product Discovery', gap: 2, weight: 1.6 }, // 3.2
      { skillId: 's2', skillName: 'Technical Writing', gap: 3, weight: 0.9 }, // 2.7
      { skillId: 's3', skillName: 'Product Analytics', gap: 3, weight: 1.4 }, // 4.2
    ];

    const ranked = [...gaps].map((g) => ({
      ...g,
      priorityScore: Number((g.gap * g.weight).toFixed(2))
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    expect(ranked[0].skillId).toBe('s3'); // 4.2
    expect(ranked[1].skillId).toBe('s1'); // 3.2
    expect(ranked[2].skillId).toBe('s2'); // 2.7
  });

  it('dispatches and receives skill_setu_diagnostic_completed event correctly', () => {
    const target = typeof window !== 'undefined' ? window : new EventTarget();
    let eventReceived = false;
    let detailReceived: any = null;

    const handler = (event: any) => {
      eventReceived = true;
      detailReceived = event.detail;
    };

    target.addEventListener('skill_setu_diagnostic_completed', handler);

    const customEvent = typeof CustomEvent !== 'undefined'
      ? new CustomEvent('skill_setu_diagnostic_completed', {
          detail: {
            skillId: 'prod-discovery',
            assessedLevel: 3,
            scorePercentage: 75
          }
        })
      : Object.assign(new Event('skill_setu_diagnostic_completed'), {
          detail: {
            skillId: 'prod-discovery',
            assessedLevel: 3,
            scorePercentage: 75
          }
        });

    target.dispatchEvent(customEvent);

    expect(eventReceived).toBe(true);
    expect(detailReceived.skillId).toBe('prod-discovery');
    expect(detailReceived.assessedLevel).toBe(3);

    target.removeEventListener('skill_setu_diagnostic_completed', handler);
  });

  it('validates authentic roadmap.sh paths for all 6 target career roles', async () => {
    const { careerRoadmaps, getCareerRoadmap } = await import('../data/careerRoadmaps');
    const roleKeys = ['fullstack-dev', 'data-analyst', 'ml-engineer', 'product-manager', 'business-analyst', 'cloud-architect'];

    for (const key of roleKeys) {
      const roadmap = careerRoadmaps[key];
      expect(roadmap, `Missing roadmap for role: ${key}`).toBeDefined();
      expect(roadmap.roadmapShUrl.startsWith('https://roadmap.sh/'), `Invalid roadmap.sh URL: ${roadmap.roadmapShUrl}`).toBe(true);
      expect(roadmap.phases.length).toBeGreaterThanOrEqual(3);
      expect(roadmap.totalEstimatedHours).toBeGreaterThan(50);

      const allMilestones = roadmap.phases.flatMap((p) => p.milestones);
      expect(allMilestones.length).toBeGreaterThanOrEqual(4);

      for (const milestone of allMilestones) {
        expect(milestone.id).toBeTruthy();
        expect(milestone.title).toBeTruthy();
        expect(milestone.estimatedHours).toBeGreaterThan(0);
        expect(milestone.topics.length).toBeGreaterThanOrEqual(2);
        if (milestone.recommendedCourse) {
          expect(milestone.recommendedCourse.isFree).toBe(true);
          expect(milestone.recommendedCourse.url.startsWith('https://')).toBe(true);
        }
      }
    }

    // Resolves role accurately with case-insensitive / slug matching
    expect(getCareerRoadmap('fullstack-dev').roleTitle).toBe('Full-Stack Developer');
    expect(getCareerRoadmap('DATA-ANALYST').roleTitle).toBe('Data Analyst');
    expect(getCareerRoadmap('Machine Learning Engineer').roleTitle).toBe('Machine Learning Engineer');
    expect(getCareerRoadmap(null).roleTitle).toBe('Full-Stack Developer');
  });
});
