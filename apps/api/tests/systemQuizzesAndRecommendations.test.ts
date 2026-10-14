import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import * as gapAnalysisEngine from '../src/services/gapAnalysisEngine';

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
      expect(res.body.creatorId).toBeUndefined();
    });

    it('rejects submitting a quiz owned by another user with 404', async () => {
      // Mock only prisma: findUnique returns quiz owned by Learner A
      vi.spyOn(prisma.quiz, 'findUnique').mockResolvedValue({
        id: userAQuizId,
        creatorId: learnerAId,
        skillId: 's-sql'
      } as any);

      // Learner B submits attempt for Learner A's quiz
      const res = await request(app)
        .post('/api/v1/quizzes/submit')
        .set('Authorization', 'Bearer test-empty-token') // Learner B
        .send({
          quizId: userAQuizId,
          timeSpentSeconds: 30,
          answers: [{ questionId: 'q-1', selectedOptions: ['opt_1'] }]
        });

      // Assert that submitting a quiz owned by another user returns 404 (or 403)
      expect([403, 404]).toContain(res.status);
      expect(res.body.error).toBe('NotFound');
    });

    it('allows a learner to submit an attempt for a system quiz (creatorId: null) returning 200 without wholesale evaluateQuizAttempt mocking', async () => {
      // Mock ONLY prisma models used by submitQuiz & evaluateQuizAttempt (no evaluateQuizAttempt mock)
      vi.spyOn(prisma.quiz, 'findUnique').mockImplementation(async (args: any) => {
        if (args?.where?.id === systemQuizId) {
          return {
            id: systemQuizId,
            creatorId: null,
            skillId: 's-sql',
            title: 'PostgreSQL Architecture System Quiz',
            questions: [
              {
                id: 'q-sys-1',
                questionText: 'What is MVCC in PostgreSQL?',
                type: 'single_mcq',
                difficulty: 'intermediate',
                options: [
                  { id: 'opt_1', text: 'Multi-Version Concurrency Control' },
                  { id: 'opt_2', text: 'Main Version Control Cache' }
                ],
                correctAnswers: ['opt_1'],
                explanation: 'MVCC allows readers not to block writers in PostgreSQL',
                topicTag: 'Databases',
                orderIndex: 1
              }
            ]
          } as any;
        }
        return null;
      });

      vi.spyOn(prisma.quizAttempt, 'create').mockImplementation(async (args: any) => {
        return {
          id: 'att-sys-101',
          quizId: systemQuizId,
          userId: learnerAId,
          scorePercentage: args.data.scorePercentage,
          totalQuestions: args.data.totalQuestions,
          correctAnswersCount: args.data.correctAnswersCount,
          timeSpentSeconds: args.data.timeSpentSeconds,
          submittedAt: new Date('2026-10-14T10:00:00Z')
        } as any;
      });

      vi.spyOn(prisma.userSkill, 'findUnique').mockResolvedValue({
        id: 'us-sql-1',
        userId: learnerAId,
        skillId: 's-sql',
        selfAssessedLevel: 2,
        verifiedScore: null,
        effectiveScore: 2
      } as any);

      vi.spyOn(prisma.userSkill, 'upsert').mockResolvedValue({
        id: 'us-sql-1',
        userId: learnerAId,
        skillId: 's-sql',
        selfAssessedLevel: 2.5,
        effectiveScore: 2.5
      } as any);

      vi.spyOn(prisma.profile, 'findFirst').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/quizzes/submit')
        .set('Authorization', 'Bearer test-learner-token')
        .send({
          quizId: systemQuizId,
          timeSpentSeconds: 45,
          answers: [{ questionId: 'q-sys-1', selectedOptions: ['opt_1'] }]
        });

      expect(res.status).toBe(200);
      expect(res.body.quizId).toBe(systemQuizId);
      expect(res.body.scorePercentage).toBe(100);
      expect(res.body.correctAnswersCount).toBe(1);
      expect(res.body.totalQuestions).toBe(1);
      expect(res.body.skillBoostApplied).toBe(true);
      expect(res.body.answers).toBeDefined();
      expect(res.body.answers[0].isCorrect).toBe(true);
    });
  });

  describe('3. Learner B cannot read Learner A\'s uploaded quiz', () => {
    it('returns 404 when learner B attempts to get learner A\'s custom quiz, but 200 when learner A accesses it', async () => {
      const mockLearnerAQuiz = {
        id: userAQuizId,
        creatorId: learnerAId,
        title: 'Learner A Secret Study Notes Quiz',
        description: 'Private uploaded quiz',
        difficulty: 'intermediate',
        language: 'en',
        skillId: 's-sql',
        questionCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: 'q-a-1',
            questionText: 'Learner A private question?',
            type: 'single_mcq',
            difficulty: 'intermediate',
            options: [{ id: 'opt_1', text: 'Private Option 1' }],
            correctAnswers: ['opt_1'],
            explanation: 'Private explanation',
            topicTag: 'Private Topic',
            orderIndex: 1
          }
        ]
      };

      const capturedWheres: any[] = [];

      // The prisma.quiz.findFirst mock returns learner A's quiz ONLY when the received where
      // would actually match it: id equals the quiz id AND (creatorId equals the requesting user's id OR creatorId is null).
      vi.spyOn(prisma.quiz, 'findFirst').mockImplementation(async (args: any) => {
        const where = args?.where;
        capturedWheres.push(where);

        if (!where || where.id !== mockLearnerAQuiz.id) {
          return null;
        }

        // If where specifies OR conditions (as built by getQuizById)
        if (Array.isArray(where.OR)) {
          const matches = where.OR.some((cond: any) => {
            if (cond.creatorId === mockLearnerAQuiz.creatorId) return true;
            if (cond.creatorId === null && mockLearnerAQuiz.creatorId === null) return true;
            return false;
          });
          return matches ? (mockLearnerAQuiz as any) : null;
        }

        // If where specifies creatorId directly
        if ('creatorId' in where) {
          return where.creatorId === mockLearnerAQuiz.creatorId ? (mockLearnerAQuiz as any) : null;
        }

        // If where did not constrain creatorId at all (e.g. buggy where: { id }),
        // it matches the row and returns mockLearnerAQuiz, causing the 404 assertion to fail.
        return mockLearnerAQuiz as any;
      });

      // 1. Learner B attempts to get Learner A's quiz -> MUST get 404
      const resB = await request(app)
        .get(`/api/v1/quizzes/${userAQuizId}`)
        .set('Authorization', 'Bearer test-empty-token'); // Learner B

      expect(resB.status).toBe(404);
      expect(resB.body).toEqual({ error: 'NotFound', message: 'Quiz not found' });

      // 2. Learner A attempts to get their own quiz -> MUST get 200
      const resA = await request(app)
        .get(`/api/v1/quizzes/${userAQuizId}`)
        .set('Authorization', 'Bearer test-learner-token'); // Learner A

      expect(resA.status).toBe(200);
      expect(resA.body.id).toBe(userAQuizId);
      expect(resA.body.title).toBe(mockLearnerAQuiz.title);

      // 3. Assert where clause built for Learner B never contains Learner A's id as creatorId
      const whereBuiltForB = capturedWheres[0];
      expect(whereBuiltForB).toBeDefined();
      expect(whereBuiltForB.id).toBe(userAQuizId);

      const creatorIdsInB = Array.isArray(whereBuiltForB.OR)
        ? whereBuiltForB.OR.map((cond: any) => cond.creatorId)
        : [whereBuiltForB.creatorId];

      expect(creatorIdsInB).not.toContain(learnerAId);
      expect(creatorIdsInB).toContain(learnerBId);
      expect(creatorIdsInB).toContain(null);
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

  describe('5. Onboarding submit sets Profile.isOnboarded = true and saves targetRoleId', () => {
    it('sets Profile.isOnboarded = true and saves targetRoleId in database upsert', async () => {
      let receivedUpsertArgs: any = null;

      vi.spyOn(prisma.profile, 'upsert').mockImplementation(async (args: any) => {
        receivedUpsertArgs = args;
        return {
          id: 'prof-learner-a',
          userId: learnerAId,
          fullName: args.create.fullName,
          education: args.create.education,
          experienceYears: args.create.experienceYears,
          currentStatus: args.create.currentStatus,
          currentRole: args.create.currentRole,
          targetRoleId: args.create.targetRoleId,
          careerGoals: args.create.careerGoals,
          preferredLanguage: args.create.preferredLanguage,
          weeklyStudyHours: args.create.weeklyStudyHours,
          learningPreferences: args.create.learningPreferences,
          isOnboarded: args.create.isOnboarded,
          targetRole: {
            id: args.create.targetRoleId,
            title: 'Full Stack Engineer',
            code: 'full-stack-eng'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        } as any;
      });

      const onboardingPayload = {
        fullName: 'Learner A User',
        education: 'Bachelor of Technology',
        experienceYears: 2,
        currentStatus: 'student',
        currentRole: 'Junior Intern',
        targetRoleId: 'role-fullstack-dev-uuid',
        careerGoals: 'Become a Senior Full Stack Engineer',
        preferredLanguage: 'en',
        weeklyStudyHours: 15,
        learningPreferences: ['hands-on', 'video-tutorials']
      };

      const res = await request(app)
        .post('/api/v1/profile/onboarding')
        .set('Authorization', 'Bearer test-learner-token')
        .send(onboardingPayload);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Onboarding completed successfully');
      expect(res.body.profile.isOnboarded).toBe(true);
      expect(res.body.profile.targetRoleId).toBe('role-fullstack-dev-uuid');
      expect(res.body.profile.targetRoleName).toBe('Full Stack Engineer');

      // Assert prisma.profile.upsert received isOnboarded: true and targetRoleId in both update and create
      expect(receivedUpsertArgs).toBeDefined();
      expect(receivedUpsertArgs.where).toEqual({ userId: learnerAId });
      expect(receivedUpsertArgs.update.isOnboarded).toBe(true);
      expect(receivedUpsertArgs.update.targetRoleId).toBe('role-fullstack-dev-uuid');
      expect(receivedUpsertArgs.create.isOnboarded).toBe(true);
      expect(receivedUpsertArgs.create.targetRoleId).toBe('role-fullstack-dev-uuid');
    });
  });

  describe('6. System Quizzes JSON validation & position distribution', () => {
    it('verifies every correctAnswers id exists in options, exactly one correct answer for single_mcq, and no position holds >40%', () => {
      const jsonPath = path.join(__dirname, '../prisma/seed-quizzes/systemQuizzes.json');
      expect(fs.existsSync(jsonPath)).toBe(true);

      const quizzes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      expect(Array.isArray(quizzes)).toBe(true);
      expect(quizzes.length).toBe(81);

      let totalQuestions = 0;
      const positionCounts: Record<string, number> = { opt_1: 0, opt_2: 0, opt_3: 0, opt_4: 0 };

      for (const quiz of quizzes) {
        expect(Array.isArray(quiz.questions)).toBe(true);
        expect(quiz.questions.length).toBe(5);

        for (const question of quiz.questions) {
          totalQuestions++;
          const optionIds = new Set(question.options.map((o: any) => o.id));

          // 1. Every correctAnswers id exists in options
          expect(Array.isArray(question.correctAnswers)).toBe(true);
          expect(question.correctAnswers.length).toBeGreaterThan(0);
          for (const ca of question.correctAnswers) {
            expect(optionIds.has(ca)).toBe(true);
          }

          // 2. Exactly one correct answer for single_mcq
          if (question.type === 'single_mcq') {
            expect(question.correctAnswers).toHaveLength(1);
          }

          // Track position count
          const correctId = question.correctAnswers[0];
          expect(positionCounts[correctId]).toBeDefined();
          positionCounts[correctId]++;
        }
      }

      expect(totalQuestions).toBe(405);

      // 3. No position holds more than 40% of correct answers (target roughly 20-30%)
      for (const [pos, count] of Object.entries(positionCounts)) {
        const percentage = (count / totalQuestions) * 100;
        expect(percentage).toBeLessThanOrEqual(40);
        expect(percentage).toBeGreaterThanOrEqual(15);
      }
    });

    it('verifies correct option is longest in <= 40% of questions and no question has correct option > 1.5x average wrong length', () => {
      const jsonPath = path.join(__dirname, '../prisma/seed-quizzes/systemQuizzes.json');
      const quizzes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

      let totalQuestions = 0;
      let longestCorrectCount = 0;

      for (const quiz of quizzes) {
        for (const question of quiz.questions) {
          totalQuestions++;
          const correctOption = question.options.find((o: any) => question.correctAnswers.includes(o.id));
          expect(correctOption).toBeDefined();

          const wrongOptions = question.options.filter((o: any) => !question.correctAnswers.includes(o.id));
          expect(wrongOptions.length).toBeGreaterThan(0);

          const maxLen = Math.max(...question.options.map((o: any) => o.text.length));
          if (correctOption.text.length === maxLen) {
            longestCorrectCount++;
          }

          const avgWrongLen = wrongOptions.reduce((acc: number, o: any) => acc + o.text.length, 0) / wrongOptions.length;
          const ratio = correctOption.text.length / avgWrongLen;

          expect(ratio).toBeLessThanOrEqual(1.5);
        }
      }

      expect(totalQuestions).toBe(405);
      const longestPercentage = (longestCorrectCount / totalQuestions) * 100;
      expect(longestPercentage).toBeLessThanOrEqual(40);
    });
  });
});

