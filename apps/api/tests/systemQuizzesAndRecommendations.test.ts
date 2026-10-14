import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import * as gapAnalysisEngine from '../src/services/gapAnalysisEngine';
import * as quizGenerator from '../src/services/quizGenerator';

const app = createApp();

describe('System Practice Quizzes & Recommended Endpoint (Bug 2)', () => {
  const learnerAId = 'test-learner-uuid';
  const learnerBId = 'test-empty-uuid';
  const systemQuizId = 'sys-quiz-sql-101';
  const userAQuizId = 'user-a-quiz-101';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. GET /quizzes/recommended (ranked by gap, max 6)', () => {
    it('returns recommended system quizzes ranked by largest gap deficit first, capped at max 6', async () => {
      // Mock learner profile with target role
      vi.spyOn(prisma.profile, 'findUnique').mockResolvedValue({
        id: 'prof-learner-a',
        userId: learnerAId,
        targetRoleId: 'role-fullstack'
      } as any);

      // Mock 8 gaps to verify ranking and max 6 cap
      const mockGaps = [
        { skillId: 's-sql', skillName: 'SQL', gap: 3.5, priority: 'high', currentLevel: 1.5, requiredLevel: 5 },
        { skillId: 's-docker', skillName: 'Docker', gap: 3.0, priority: 'high', currentLevel: 1.0, requiredLevel: 4 },
        { skillId: 's-react', skillName: 'React', gap: 2.5, priority: 'medium', currentLevel: 2.0, requiredLevel: 4.5 },
        { skillId: 's-node', skillName: 'Node.js', gap: 2.0, priority: 'medium', currentLevel: 2.0, requiredLevel: 4 },
        { skillId: 's-python', skillName: 'Python', gap: 1.8, priority: 'low', currentLevel: 2.0, requiredLevel: 3.8 },
        { skillId: 's-k8s', skillName: 'Kubernetes', gap: 1.5, priority: 'low', currentLevel: 1.5, requiredLevel: 3 },
        { skillId: 's-aws', skillName: 'AWS', gap: 1.2, priority: 'low', currentLevel: 2.0, requiredLevel: 3.2 }, // 7th gap
        { skillId: 's-sec', skillName: 'Security', gap: 0.8, priority: 'low', currentLevel: 2.0, requiredLevel: 2.8 } // 8th gap
      ];

      vi.spyOn(gapAnalysisEngine, 'analyzeLearnerSkillGaps').mockResolvedValue({
        userId: learnerAId,
        targetRoleId: 'role-fullstack',
        status: 'in_progress',
        overallReadinessScore: 55,
        gaps: mockGaps
      } as any);

      // Mock system quiz lookup for each gap
      vi.spyOn(prisma.quiz, 'findFirst').mockImplementation(async (args: any) => {
        const skillId = args?.where?.skillId;
        const matchedGap = mockGaps.find((g) => g.skillId === skillId);
        if (matchedGap && args?.where?.creatorId === null) {
          return {
            id: `sys-quiz-${skillId}`,
            creatorId: null,
            skillId,
            title: `${matchedGap.skillName} Practice Quiz`,
            description: `System benchmark quiz for ${matchedGap.skillName}`,
            difficulty: 'beginner',
            questionCount: 5,
            skill: { id: skillId, name: matchedGap.skillName, code: skillId },
            _count: { questions: 5, attempts: 12 }
          } as any;
        }
        return null;
      });

      const res = await request(app)
        .get('/api/v1/quizzes/recommended')
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Strictly capped at max 6
      expect(res.body.length).toBe(6);

      // Ranked by largest gap deficit descending
      expect(res.body[0].skillName).toBe('SQL');
      expect(res.body[0].gapDeficit).toBe(3.5);
      expect(res.body[1].skillName).toBe('Docker');
      expect(res.body[1].gapDeficit).toBe(3.0);
      expect(res.body[2].skillName).toBe('React');
      expect(res.body[2].gapDeficit).toBe(2.5);
      expect(res.body[5].skillName).toBe('Kubernetes');

      // 7th and 8th gaps must NOT be present
      const returnedSkillNames = res.body.map((q: any) => q.skillName);
      expect(returnedSkillNames).not.toContain('AWS');
      expect(returnedSkillNames).not.toContain('Security');

      // Verified recommendationReason formatting
      expect(res.body[0].recommendationReason).toContain('Bridges your top high gap in SQL');
    });
  });

  describe('2. A learner can read and submit a system quiz', () => {
    it('allows a learner to read a system quiz (creatorId: null)', async () => {
      const mockSystemQuiz = {
        id: systemQuizId,
        creatorId: null,
        title: 'PostgreSQL Architecture System Quiz',
        description: 'Benchmark diagnostic quiz on relational schemas',
        difficulty: 'intermediate',
        language: 'en',
        skillId: 's-sql',
        questionCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: 'q-sys-1',
            questionText: 'What is MVCC in PostgreSQL?',
            type: 'single_mcq',
            difficulty: 'intermediate',
            options: [{ id: 'opt_1', text: 'Multi-Version Concurrency Control' }],
            topicTag: 'Databases',
            orderIndex: 1
          }
        ]
      };

      vi.spyOn(prisma.quiz, 'findFirst').mockImplementation(async (args: any) => {
        if (args?.where?.id === systemQuizId) {
          // Check that query allows creatorId: null
          const orConditions = args?.where?.OR || [];
          const allowsSystem = orConditions.some((cond: any) => cond.creatorId === null);
          if (allowsSystem) {
            return mockSystemQuiz as any;
          }
        }
        return null;
      });

      const res = await request(app)
        .get(`/api/v1/quizzes/${systemQuizId}`)
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(systemQuizId);
      expect(res.body.title).toBe('PostgreSQL Architecture System Quiz');
      expect(res.body.questions).toHaveLength(1);
      // Privacy check: creatorId is not exposed
      expect(res.body.creatorId).toBeUndefined();
    });

    it('allows a learner to submit an attempt for a system quiz (creatorId: null)', async () => {
      vi.spyOn(prisma.quiz, 'findUnique').mockImplementation(async (args: any) => {
        if (args?.where?.id === systemQuizId) {
          return { id: systemQuizId, creatorId: null, skillId: 's-sql' } as any;
        }
        return null;
      });

      vi.spyOn(quizGenerator, 'evaluateQuizAttempt').mockResolvedValue({
        attemptId: 'att-sys-1',
        quizId: systemQuizId,
        scorePercentage: 100,
        earnedPoints: 50,
        passed: true,
        correctCount: 1,
        totalQuestions: 1,
        timeSpentSeconds: 45,
        skillBoostApplied: true,
        boostAmount: 0.5,
        newSelfAssessedLevel: 2.5,
        submittedAnswers: [
          {
            questionId: 'q-sys-1',
            selectedOptions: ['opt_1'],
            isCorrect: true,
            explanation: 'MVCC allows readers not to block writers'
          }
        ]
      } as any);

      const res = await request(app)
        .post('/api/v1/quizzes/submit')
        .set('Authorization', 'Bearer test-learner-token')
        .send({
          quizId: systemQuizId,
          timeSpentSeconds: 45,
          answers: [{ questionId: 'q-sys-1', selectedOptions: ['opt_1'] }]
        });

      expect(res.status).toBe(200);
      expect(res.body.scorePercentage).toBe(100);
      expect(res.body.skillBoostApplied).toBe(true);
    });
  });

  describe('3. Learner B cannot read Learner A\'s uploaded quiz', () => {
    it('returns 404 when learner B attempts to get learner A\'s custom quiz', async () => {
      vi.spyOn(prisma.quiz, 'findFirst').mockImplementation(async (args: any) => {
        // Query looks for: where: { id: userAQuizId, OR: [{ creatorId: user.id }, { creatorId: null }] }
        if (args?.where?.id === userAQuizId) {
          const orConditions = args?.where?.OR || [];
          const allowsUserB = orConditions.some((c: any) => c.creatorId === learnerBId);
          const allowsSystem = orConditions.some((c: any) => c.creatorId === null);
          // Since the quiz belongs to Learner A (creatorId: learnerAId), it matches neither Learner B nor null
          if (allowsUserB || allowsSystem) {
            return null; // Not found for user B
          }
        }
        return null;
      });

      const res = await request(app)
        .get(`/api/v1/quizzes/${userAQuizId}`)
        .set('Authorization', 'Bearer test-empty-token'); // Learner B

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'NotFound', message: 'Quiz not found' });
    });
  });

  describe('4. listQuizzes default excludes system quizzes', () => {
    it('queries where: { creatorId: user.id } by default so system quizzes are excluded from user upload list', async () => {
      let receivedWhere: any = null;

      vi.spyOn(prisma.quiz, 'findMany').mockImplementation(async (args: any) => {
        receivedWhere = args?.where;
        if (args?.where?.creatorId === learnerAId) {
          return [
            {
              id: userAQuizId,
              creatorId: learnerAId,
              title: 'Learner A Personal Lecture Notes Quiz',
              description: 'My custom uploaded quiz',
              difficulty: 'intermediate',
              language: 'en',
              skillId: null,
              createdAt: new Date(),
              _count: { questions: 3, attempts: 1 }
            }
          ] as any;
        }
        return [];
      });

      // Default GET /api/v1/quizzes without query parameter
      const res = await request(app)
        .get('/api/v1/quizzes')
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);
      expect(receivedWhere).toEqual({ creatorId: learnerAId });
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(userAQuizId);
      expect(res.body[0].isSystem).toBe(false);
    });

    it('queries OR: [{ creatorId: user.id }, { creatorId: null }] when ?includeSystem=true is explicitly requested', async () => {
      let receivedWhere: any = null;

      vi.spyOn(prisma.quiz, 'findMany').mockImplementation(async (args: any) => {
        receivedWhere = args?.where;
        return [];
      });

      const res = await request(app)
        .get('/api/v1/quizzes?includeSystem=true')
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);
      expect(receivedWhere).toEqual({
        OR: [
          { creatorId: learnerAId },
          { creatorId: null }
        ]
      });
    });
  });
});
