import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { diagnosticQuestionsData, domainsData, curatedCoursesData } from '../prisma/seedData';
import { z } from 'zod';

const app = createApp();

describe('Diagnostic Assessments & Seed Data Suite', () => {
  describe('Question Serving & Structure', () => {
    it('serves diagnostic questions for a skill without leaking correctAnswers', async () => {
      const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `q-${i + 1}`,
        skillId: 'test-skill-uuid',
        questionText: `Test Question ${i + 1}?`,
        type: 'single_mcq',
        difficulty: 'intermediate',
        options: [
          { id: 'opt1', text: 'Option A' },
          { id: 'opt2', text: 'Option B' }
        ],
        explanation: 'Detailed explanation for correct answer.'
      }));

      vi.spyOn(prisma.assessmentQuestion, 'findMany').mockResolvedValueOnce(mockQuestions as any);

      const res = await request(app)
        .get('/api/v1/assessment/questions/test-skill-uuid')
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(10);

      // Verify correctAnswers is omitted for test-taker integrity
      for (const q of res.body) {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('questionText');
        expect(q).toHaveProperty('options');
        expect(q).not.toHaveProperty('correctAnswers');
      }

      expect(prisma.assessmentQuestion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            skillId: 'test-skill-uuid',
            NOT: { questionText: { startsWith: '[INACTIVE]' } }
          })
        })
      );
    });

    it('returns empty array [] with 200 when skill has no diagnostic questions', async () => {
      vi.spyOn(prisma.assessmentQuestion, 'findMany').mockResolvedValueOnce([]);

      const res = await request(app)
        .get('/api/v1/assessment/questions/empty-skill-uuid')
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('shuffles option order for single_mcq and multi_mcq while preserving option IDs and canonical true_false order', async () => {
      const mockQuestions = [
        {
          id: 'q-single-mcq',
          skillId: 'test-skill-uuid',
          questionText: 'Single MCQ question?',
          type: 'single_mcq',
          difficulty: 'intermediate',
          options: [
            { id: 'opt1', text: 'Alpha' },
            { id: 'opt2', text: 'Beta' },
            { id: 'opt3', text: 'Gamma' },
            { id: 'opt4', text: 'Delta' }
          ],
          explanation: 'Beta is correct.'
        },
        {
          id: 'q-true-false',
          skillId: 'test-skill-uuid',
          questionText: 'True/False question?',
          type: 'true_false',
          difficulty: 'beginner',
          options: [
            { id: 'opt2', text: 'False' },
            { id: 'opt1', text: 'True' }
          ],
          explanation: 'True is correct.'
        }
      ];

      vi.spyOn(prisma.assessmentQuestion, 'findMany').mockResolvedValue(mockQuestions as any);

      const res = await request(app)
        .get('/api/v1/assessment/questions/test-skill-uuid')
        .set('Authorization', 'Bearer test-learner-token');

      expect(res.status).toBe(200);

      const singleQ = res.body.find((q: any) => q.id === 'q-single-mcq');
      expect(singleQ).toBeDefined();
      expect(singleQ.options.length).toBe(4);
      const singleOptionIds = singleQ.options.map((o: any) => o.id);
      expect(singleOptionIds.sort()).toEqual(['opt1', 'opt2', 'opt3', 'opt4']);

      // True/false must always maintain canonical True first, False second
      const tfQ = res.body.find((q: any) => q.id === 'q-true-false');
      expect(tfQ).toBeDefined();
      expect(tfQ.options.length).toBe(2);
      expect(tfQ.options[0].text).toBe('True');
      expect(tfQ.options[1].text).toBe('False');
    });
  });

  describe('Assessment Scoring Engine', () => {
    it('accurately scores an assessment across all questions and updates assessedLevel', async () => {
      const skillId = 'skill-uuid-1';
      const questionIds = Array.from({ length: 10 }, (_, i) => `q-${i + 1}`);

      vi.spyOn(prisma.skill, 'findUnique').mockResolvedValueOnce({
        id: skillId,
        code: 'ts-js',
        name: 'TypeScript & JavaScript',
        category: 'Frontend',
        description: 'TypeScript skills',
        domainId: 'domain-1',
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      const mockDbQuestions = questionIds.map((id) => ({
        id,
        skillId,
        questionText: `Question ${id}?`,
        type: 'single_mcq',
        difficulty: 'intermediate',
        options: [
          { id: 'opt1', text: 'A' },
          { id: 'opt2', text: 'B' }
        ],
        correctAnswers: ['opt2'],
        explanation: 'Option B is correct.'
      }));

      vi.spyOn(prisma.assessmentQuestion, 'findMany').mockResolvedValueOnce(mockDbQuestions as any);

      // Answers: 8 correct ('opt2'), 2 incorrect ('opt1')
      const userAnswers = questionIds.map((qId, idx) => ({
        questionId: qId,
        selectedOptions: idx < 8 ? ['opt2'] : ['opt1'],
        timeSpentSeconds: 15
      }));

      const createAttemptSpy = vi.spyOn(prisma.assessmentAttempt, 'create').mockResolvedValueOnce({
        id: 'attempt-uuid',
        userId: 'test-learner-uuid',
        skillId,
        score: 80,
        assessedLevel: 4,
        totalQuestions: 10,
        correctQuestions: 8,
        startedAt: new Date(),
        completedAt: new Date()
      } as any);

      vi.spyOn(prisma.userSkill, 'findUnique').mockResolvedValueOnce(null);
      vi.spyOn(prisma.userSkill, 'upsert').mockResolvedValueOnce({} as any);

      const res = await request(app)
        .post('/api/v1/assessment/submit')
        .set('Authorization', 'Bearer test-learner-token')
        .send({
          skillId,
          answers: userAnswers
        });

      expect(res.status).toBe(200);
      expect(res.body.scorePercentage).toBe(80);
      expect(res.body.correctQuestions).toBe(8);
      expect(res.body.totalQuestions).toBe(10);
      expect(res.body.assessedLevel).toBe(4.2); // 1.0 + (0.8 * 4.0) = 4.2

      expect(createAttemptSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: 80,
            assessedLevel: 4,
            totalQuestions: 10,
            correctQuestions: 8
          })
        })
      );
    });

    it('strips [INACTIVE] prefix from questionText before returning evaluated answers to the user', async () => {
      const skillId = 'skill-uuid-inactive-test';
      const questionId = 'q-inactive-1';

      vi.spyOn(prisma.skill, 'findUnique').mockResolvedValueOnce({
        id: skillId,
        code: 'db-sql',
        name: 'Database SQL',
        category: 'Backend',
        description: 'SQL skills',
        domainId: 'domain-1'
      } as any);

      vi.spyOn(prisma.assessmentQuestion, 'findMany').mockResolvedValueOnce([
        {
          id: questionId,
          skillId,
          questionText: '[INACTIVE] What is ACID in relational database management systems?',
          type: 'single_mcq',
          difficulty: 'intermediate',
          options: [{ id: 'opt1', text: 'Atomicity, Consistency, Isolation, Durability' }],
          correctAnswers: ['opt1'],
          explanation: 'ACID defines standard transactional properties.'
        }
      ] as any);

      vi.spyOn(prisma.assessmentAttempt, 'create').mockResolvedValueOnce({
        id: 'attempt-inactive-1',
        userId: 'test-learner-user-id',
        skillId,
        score: 100,
        assessedLevel: 5,
        totalQuestions: 1,
        correctQuestions: 1,
        completedAt: new Date(),
        answers: []
      } as any);

      vi.spyOn(prisma.userSkill, 'findUnique').mockResolvedValueOnce(null);
      vi.spyOn(prisma.userSkill, 'upsert').mockResolvedValueOnce({} as any);

      const res = await request(app)
        .post('/api/v1/assessment/submit')
        .set('Authorization', 'Bearer test-learner-token')
        .send({
          skillId,
          answers: [{ questionId, selectedOptions: ['opt1'], timeSpentSeconds: 10 }]
        });

      expect(res.status).toBe(200);
      expect(res.body.evaluatedAnswers).toBeDefined();
      expect(res.body.evaluatedAnswers.length).toBe(1);
      // The [INACTIVE] prefix MUST be stripped before sending to the client!
      expect(res.body.evaluatedAnswers[0].questionText).toBe(
        'What is ACID in relational database management systems?'
      );
      expect(res.body.evaluatedAnswers[0].questionText).not.toContain('[INACTIVE]');
    });
  });

  describe('Seed Course Cleanup Logic', () => {
    it('deletes unreferenced obsolete courses and preserves referenced courses', async () => {
      const validCourseIds = new Set(
        curatedCoursesData.map((c) =>
          c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        )
      );

      // Mock DB courses
      const dbCourses = [
        { id: 'valid-active-course', _count: { enrollments: 0, learningPathItems: 0 } },
        { id: 'obsolete-unreferenced-course', _count: { enrollments: 0, learningPathItems: 0 } },
        { id: 'obsolete-referenced-course', _count: { enrollments: 3, learningPathItems: 1 } }
      ];

      // Simulate validCourseIds check
      validCourseIds.add('valid-active-course');

      const toDelete: string[] = [];
      for (const course of dbCourses) {
        if (!validCourseIds.has(course.id)) {
          if (course._count.enrollments === 0 && course._count.learningPathItems === 0) {
            toDelete.push(course.id);
          }
        }
      }

      expect(toDelete).toEqual(['obsolete-unreferenced-course']);
      expect(toDelete).not.toContain('obsolete-referenced-course');
      expect(toDelete).not.toContain('valid-active-course');
    });

    it('simulates safe question cleanup logic: deletes unreferenced questions and marks referenced questions as inactive', () => {
      const validSignatures = new Set(['ts-js:::Active Question A', 'ts-js:::Active Question B']);

      const dbQuestions = [
        { id: 'q-active', skillCode: 'ts-js', questionText: 'Active Question A', answerCount: 5 },
        { id: 'q-obsolete-unref', skillCode: 'ts-js', questionText: 'Obsolete Question X', answerCount: 0 },
        { id: 'q-obsolete-ref', skillCode: 'ts-js', questionText: 'Obsolete Question Y', answerCount: 2 }
      ];

      const toDelete: string[] = [];
      const toMarkInactive: { id: string; newText: string }[] = [];

      for (const q of dbQuestions) {
        const rawText = q.questionText.replace(/^\[INACTIVE\]\s*/i, '').trim();
        const sig = `${q.skillCode}:::${rawText}`;
        if (!validSignatures.has(sig)) {
          if (q.answerCount === 0) {
            toDelete.push(q.id);
          } else if (!q.questionText.startsWith('[INACTIVE] ')) {
            toMarkInactive.push({ id: q.id, newText: `[INACTIVE] ${rawText}` });
          }
        }
      }

      expect(toDelete).toEqual(['q-obsolete-unref']);
      expect(toMarkInactive).toEqual([
        { id: 'q-obsolete-ref', newText: '[INACTIVE] Obsolete Question Y' }
      ]);
    });
  });

  describe('Seed Diagnostic Questions Data Integrity', () => {
    const questionZodSchema = z.object({
      skillCode: z.string().min(1),
      questionText: z.string().min(5),
      type: z.enum(['single_mcq', 'multi_mcq', 'true_false']),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      options: z.array(
        z.object({
          id: z.string().min(1),
          text: z.string().min(1)
        })
      ).min(2),
      correctAnswers: z.array(z.string().min(1)).min(1),
      explanation: z.string().min(5)
    });

    it('contains diagnostic questions for every skill in domainsData with 10 questions per skill', () => {
      const allSkillCodes = domainsData.flatMap((d) => d.skills.map((s) => s.code));
      expect(allSkillCodes.length).toBe(27);

      const skillCounts = new Map<string, number>();
      for (const q of diagnosticQuestionsData) {
        skillCounts.set(q.skillCode, (skillCounts.get(q.skillCode) || 0) + 1);
      }

      for (const code of allSkillCodes) {
        const count = skillCounts.get(code) || 0;
        expect(count, `Skill "${code}" does not have 10 questions`).toBeGreaterThanOrEqual(10);
      }
    });

    it('every question strictly passes Zod validation and has valid correctAnswers', () => {
      for (const q of diagnosticQuestionsData) {
        const parsed = questionZodSchema.safeParse(q);
        expect(parsed.success, `Question failed zod validation: ${JSON.stringify(q)}`).toBe(true);

        const optionIds = new Set(q.options.map((o) => o.id));
        for (const ansId of q.correctAnswers) {
          expect(
            optionIds.has(ansId),
            `correctAnswer "${ansId}" does not exist in options for: "${q.questionText}"`
          ).toBe(true);
        }
      }
    });

    it('contains no duplicate questions within any skill', () => {
      const seenPerSkill = new Map<string, Set<string>>();

      for (const q of diagnosticQuestionsData) {
        if (!seenPerSkill.has(q.skillCode)) {
          seenPerSkill.set(q.skillCode, new Set());
        }
        const seen = seenPerSkill.get(q.skillCode)!;
        const normText = q.questionText.trim().toLowerCase();
        expect(seen.has(normText), `Duplicate question in skill ${q.skillCode}: "${q.questionText}"`).toBe(false);
        seen.add(normText);
      }
    });
  });
});
