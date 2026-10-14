import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { supabaseAuth } from '../src/lib/supabase';

const app = createApp();

describe('Admin Analytics Database Aggregation Tests (TASK B2)', () => {
  it('correctly calculates gapPercentage = learnersWithGap / assessedLearners and hides < 3 assessed', async () => {
    vi.spyOn(supabaseAuth.auth, 'getUser').mockResolvedValue({
      data: { user: { id: 'admin-uuid', email: 'admin@skillsetu.org' } },
      error: null
    } as any);

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-uuid',
      email: 'admin@skillsetu.org',
      role: 'admin'
    } as any);

    vi.spyOn(prisma.user, 'count').mockResolvedValue(10); // 10 total learners
    vi.spyOn(prisma.quiz, 'count').mockResolvedValue(4);
    vi.spyOn(prisma.quizAttempt, 'count').mockResolvedValue(15);
    vi.spyOn(prisma.assessmentAttempt, 'count').mockResolvedValue(8);
    vi.spyOn(prisma.role, 'findMany').mockResolvedValue([
      { id: 'role-1', title: 'Backend Engineer', _count: { profiles: 6 } }
    ] as any);
    vi.spyOn(prisma.domain, 'findMany').mockResolvedValue([
      { id: 'dom-1', name: 'Cloud & Infrastructure', _count: { skills: 5 } }
    ] as any);

    const mockSkills = [
      {
        id: 'skill-docker',
        name: 'Containers & Docker',
        domain: { id: 'dom-1', name: 'DevOps' },
        roleSkills: [{ roleId: 'role-1', requiredProficiency: 4 }],
        roleRequirements: [{ roleId: 'role-1', requiredProficiency: 4 }]
      },
      {
        id: 'skill-rust',
        name: 'Rust Systems Programming',
        domain: { id: 'dom-2', name: 'Systems' },
        roleSkills: [{ roleId: 'role-1', requiredProficiency: 3 }],
        roleRequirements: [{ roleId: 'role-1', requiredProficiency: 3 }]
      }
    ];
    vi.spyOn(prisma.skill, 'findMany').mockResolvedValue(mockSkills as any);

    // 4 assessed learners for Docker (2 have gaps: score 2 & score 3 < req 4; 2 are proficient: score 4 & score 5)
    // 2 assessed learners for Rust (< 3 threshold: not enough data)
    const mockUserSkills = [
      { skillId: 'skill-docker', effectiveScore: 2, user: { id: 'u1', profile: { targetRoleId: 'role-1' } } },
      { skillId: 'skill-docker', effectiveScore: 3, user: { id: 'u2', profile: { targetRoleId: 'role-1' } } },
      { skillId: 'skill-docker', effectiveScore: 4, user: { id: 'u3', profile: { targetRoleId: 'role-1' } } },
      { skillId: 'skill-docker', effectiveScore: 5, user: { id: 'u4', profile: { targetRoleId: 'role-1' } } },
      { skillId: 'skill-rust', effectiveScore: 1, user: { id: 'u1', profile: { targetRoleId: 'role-1' } } },
      { skillId: 'skill-rust', effectiveScore: 2, user: { id: 'u2', profile: { targetRoleId: 'role-1' } } }
    ];
    vi.spyOn(prisma.userSkill, 'findMany').mockResolvedValue(mockUserSkills as any);

    // One learner with sufficient assessments for calculateReadiness
    vi.spyOn(prisma.user, 'findMany').mockResolvedValue([
      {
        id: 'u1',
        profile: {
          targetRoleId: 'role-1',
          targetRole: {
            roleSkills: [
              { skillId: 's1', requiredProficiency: 4, priority: 'must_have', weight: 1, skill: { id: 's1', name: 'S1' } },
              { skillId: 's2', requiredProficiency: 4, priority: 'must_have', weight: 1, skill: { id: 's2', name: 'S2' } },
              { skillId: 's3', requiredProficiency: 4, priority: 'must_have', weight: 1, skill: { id: 's3', name: 'S3' } }
            ],
            skillsRequired: [
              { skillId: 's1', requiredProficiency: 4, priority: 'must_have', weight: 1, skill: { id: 's1', name: 'S1' } },
              { skillId: 's2', requiredProficiency: 4, priority: 'must_have', weight: 1, skill: { id: 's2', name: 'S2' } },
              { skillId: 's3', requiredProficiency: 4, priority: 'must_have', weight: 1, skill: { id: 's3', name: 'S3' } }
            ]
          }
        },
        userSkills: [
          { skillId: 's1', selfAssessedLevel: 3, verifiedScore: 3 },
          { skillId: 's2', selfAssessedLevel: 3, verifiedScore: 3 },
          { skillId: 's3', selfAssessedLevel: 3, verifiedScore: 3 }
        ]
      }
    ] as any);

    vi.spyOn(prisma.quizAttempt, 'findMany').mockResolvedValue([
      {
        id: 'attempt-1',
        scorePercentage: 85,
        submittedAt: new Date('2026-10-12T10:00:00Z'),
        quiz: { id: 'q1', title: 'Kubernetes Pod Security' }
      }
    ] as any);

    const res = await request(app)
      .get('/api/v1/analytics/admin')
      .set('Authorization', 'Bearer admin-token');

    expect(res.status).toBe(200);

    // 1. Check skill aggregation
    const dockerStat = res.body.commonSkillGaps.find((s: any) => s.skillId === 'skill-docker');
    expect(dockerStat).toBeDefined();
    expect(dockerStat.assessedLearners).toBe(4);
    expect(dockerStat.learnersWithGap).toBe(2);
    // Never divide by 10 total learners: 2 / 4 = 50%
    expect(dockerStat.gapPercentage).toBe(50);
    expect(dockerStat.hasEnoughData).toBe(true);
    expect(dockerStat.avgGap).toBe(1.5); // ( (4-2) + (4-3) ) / 2 = 1.5
  });

  it('hides gap percentage and flags hasEnoughData=false when a skill has fewer than 3 assessed learners', async () => {
    vi.spyOn(supabaseAuth.auth, 'getUser').mockResolvedValue({
      data: { user: { id: 'admin-uuid', email: 'admin@skillsetu.org' } },
      error: null
    } as any);
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-uuid',
      email: 'admin@skillsetu.org',
      role: 'admin'
    } as any);
    vi.spyOn(prisma.user, 'count').mockResolvedValue(5);
    vi.spyOn(prisma.quiz, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.quizAttempt, 'count').mockResolvedValue(2);
    vi.spyOn(prisma.assessmentAttempt, 'count').mockResolvedValue(2);
    vi.spyOn(prisma.role, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.domain, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.quizAttempt, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.user, 'findMany').mockResolvedValue([]);

    // Only 2 learners assessed on this skill (< 3 threshold)
    vi.spyOn(prisma.skill, 'findMany').mockResolvedValue([
      {
        id: 'skill-low-sample',
        name: 'Quantum Computing',
        domain: { id: 'dom-1', name: 'Advanced Tech' },
        roleRequirements: [{ roleId: 'role-1', requiredProficiency: 3 }]
      }
    ] as any);

    vi.spyOn(prisma.userSkill, 'findMany').mockResolvedValue([
      { skillId: 'skill-low-sample', effectiveScore: 1, user: { id: 'u1', profile: { targetRoleId: 'role-1' } } },
      { skillId: 'skill-low-sample', effectiveScore: 2, user: { id: 'u2', profile: { targetRoleId: 'role-1' } } }
    ] as any);

    const res = await request(app)
      .get('/api/v1/analytics/admin')
      .set('Authorization', 'Bearer admin-token');

    expect(res.status).toBe(200);
    const lowSampleSkill = res.body.commonSkillGaps.find((s: any) => s.skillId === 'skill-low-sample');
    expect(lowSampleSkill).toBeDefined();
    expect(lowSampleSkill.assessedLearners).toBe(2);
    expect(lowSampleSkill.hasEnoughData).toBe(false);
    expect(lowSampleSkill.gapPercentage).toBeNull();
  });

  it('guarantees zero learner names or emails in admin analytics responses (anonymized privacy)', async () => {
    vi.spyOn(supabaseAuth.auth, 'getUser').mockResolvedValue({
      data: { user: { id: 'admin-uuid', email: 'admin@skillsetu.org' } },
      error: null
    } as any);
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-uuid',
      email: 'admin@skillsetu.org',
      role: 'admin'
    } as any);
    vi.spyOn(prisma.user, 'count').mockResolvedValue(3);
    vi.spyOn(prisma.quiz, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.quizAttempt, 'count').mockResolvedValue(2);
    vi.spyOn(prisma.assessmentAttempt, 'count').mockResolvedValue(2);
    vi.spyOn(prisma.role, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.domain, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.skill, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.userSkill, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.user, 'findMany').mockResolvedValue([]);

    // Raw attempts from DB containing sensitive fields
    vi.spyOn(prisma.quizAttempt, 'findMany').mockResolvedValue([
      {
        id: 'attempt-sensitive',
        scorePercentage: 90,
        submittedAt: new Date('2026-10-14T00:00:00Z'),
        user: { id: 'user-secret', email: 'secret_student@example.com', name: 'John Doe' },
        quiz: { id: 'q1', title: 'Security Basics' }
      }
    ] as any);

    const res = await request(app)
      .get('/api/v1/analytics/admin')
      .set('Authorization', 'Bearer admin-token');

    expect(res.status).toBe(200);

    // Verify recentLearnerActivity does not leak names or emails
    const activities = res.body.recentLearnerActivity;
    expect(Array.isArray(activities)).toBe(true);
    expect(activities.length).toBeGreaterThan(0);

    for (const act of activities) {
      expect(act.learnerDisplay).toMatch(/^Learner #\d+$/);
      expect(act.learnerName).toBeUndefined();
      expect(act.email).toBeUndefined();
      expect(act.userId).toBeUndefined();
    }

    // Verify full serialized response body does not contain any user emails
    const responseText = JSON.stringify(res.body);
    expect(responseText).not.toContain('secret_student@example.com');
    expect(responseText).not.toContain('John Doe');
  });

  it('computes avgPlatformReadiness using calculateReadiness and displays not enough data if no learners have readiness', async () => {
    vi.spyOn(supabaseAuth.auth, 'getUser').mockResolvedValue({
      data: { user: { id: 'admin-uuid', email: 'admin@skillsetu.org' } },
      error: null
    } as any);
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'admin-uuid',
      email: 'admin@skillsetu.org',
      role: 'admin'
    } as any);
    vi.spyOn(prisma.user, 'count').mockResolvedValue(5);
    vi.spyOn(prisma.quiz, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.quizAttempt, 'count').mockResolvedValue(0);
    vi.spyOn(prisma.assessmentAttempt, 'count').mockResolvedValue(0);
    vi.spyOn(prisma.role, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.domain, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.skill, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.userSkill, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.quizAttempt, 'findMany').mockResolvedValue([]);

    // Zero learners with completed readiness calculations
    vi.spyOn(prisma.user, 'findMany').mockResolvedValue([]);

    const res = await request(app)
      .get('/api/v1/analytics/admin')
      .set('Authorization', 'Bearer admin-token');

    expect(res.status).toBe(200);
    // When no learners have readiness calculations, avgPlatformReadiness is null
    expect(res.body.avgPlatformReadiness).toBeNull();
  });
});
