import { describe, it, expect } from 'vitest';
import { curatedCoursesData, domainsData, rolesData, generateCourseId } from '../prisma/seedData';

describe('Curated Course Catalog Validation', () => {
  const allowedProviders = new Set([
    'Microsoft Learn',
    'Google Cloud Skills Boost',
    'freeCodeCamp',
    'NPTEL',
    'CS50'
  ]);

  it('contains exactly 61 curated courses', () => {
    expect(curatedCoursesData.length).toBe(61);
  });

  it('uses ONLY the 5 allowed providers', () => {
    for (const course of curatedCoursesData) {
      expect(
        allowedProviders.has(course.provider),
        `Course "${course.title}" has unauthorized provider: "${course.provider}"`
      ).toBe(true);
    }
  });

  it('has valid structure and metadata for every course', () => {
    for (const course of curatedCoursesData) {
      expect(course.title.trim().length).toBeGreaterThan(0);
      expect(course.destinationUrl).toMatch(/^https:\/\/.+/);
      expect(course.estimatedHours).toBeGreaterThan(0);
      expect(course.skillsCovered.length).toBeGreaterThan(0);
      expect(['Beginner', 'Intermediate', 'Advanced', 'All Levels']).toContain(course.difficulty);
      expect(typeof course.isFree).toBe('boolean');
      expect(course.description.trim().length).toBeGreaterThan(10);
    }
  });

  it('all course skills exist in domainsData', () => {
    const validSkillCodes = new Set<string>();
    for (const domain of domainsData) {
      for (const skill of domain.skills) {
        validSkillCodes.add(skill.code);
      }
    }

    for (const course of curatedCoursesData) {
      for (const skillCode of course.skillsCovered) {
        expect(
          validSkillCodes.has(skillCode),
          `Course "${course.title}" references unknown skillCode: "${skillCode}"`
        ).toBe(true);
      }
    }
  });

  it('covers all 7 skill domains', () => {
    for (const domain of domainsData) {
      const domainSkillCodes = new Set(domain.skills.map((s) => s.code));
      const matchingCourses = curatedCoursesData.filter((c) =>
        c.skillsCovered.some((code) => domainSkillCodes.has(code))
      );
      expect(
        matchingCourses.length,
        `Domain "${domain.name}" (${domain.code}) must have at least one course`
      ).toBeGreaterThan(0);
    }
  });

  it('covers all 6 career roles', () => {
    for (const role of rolesData) {
      const requiredSkillCodes = new Set(role.requirements.map((r) => r.skillCode));
      const matchingCourses = curatedCoursesData.filter((c) =>
        c.skillsCovered.some((code) => requiredSkillCodes.has(code))
      );
      expect(
        matchingCourses.length,
        `Career role "${role.title}" (${role.code}) must have at least one course`
      ).toBeGreaterThan(0);
    }
  });

  it('generates strictly unique deterministic course IDs with zero collisions and count equals 61', () => {
    const ids = new Set<string>();
    for (const course of curatedCoursesData) {
      const courseId = generateCourseId(course);

      expect(ids.has(courseId), `Duplicate course ID detected: "${courseId}" for course "${course.title}"`).toBe(false);
      expect(courseId.length).toBeGreaterThan(10);
      ids.add(courseId);
    }
    expect(ids.size).toBe(61);
    expect(ids.size).toBe(curatedCoursesData.length);
  });

  it('(a) remaps valid equivalent old-id rows, updates relations, and counts remapped enrollments and path items', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    const newTargetIdDocker = generateCourseId(
      curatedCoursesData.find((c) => c.title === 'The Docker Handbook for Beginners to Production')!
    );

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'the-docker-handbook-for-beginners-to-production',
        title: 'The Docker Handbook for Beginners to Production',
        provider: 'freeCodeCamp',
        destinationUrl: 'https://www.freecodecamp.org/news/the-docker-handbook/'
      }
    ];

    let fakeEnrollments = [
      { id: 'enr-1', userId: 'user-1', courseId: 'the-docker-handbook-for-beginners-to-production', status: 'not_started', progressPercent: 0 }
    ];

    let fakeLearningPaths = [
      { id: 'lp-1', learningPathId: 'path-user-1', courseId: 'the-docker-handbook-for-beginners-to-production' }
    ];

    let deletedCourses: string[] = [];

    const mockTx = {
      course: {
        findMany: async () => [...fakeDbCourses],
        delete: async ({ where }: any) => {
          deletedCourses.push(where.id);
          const idx = fakeDbCourses.findIndex((c) => c.id === where.id);
          if (idx !== -1) fakeDbCourses.splice(idx, 1);
        },
        count: async () => fakeDbCourses.length
      },
      enrollment: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakeEnrollments];
          return fakeEnrollments.filter((e) => e.courseId === args.where.courseId);
        },
        findUnique: async ({ where }: any) => {
          const { userId, courseId } = where.userId_courseId;
          return fakeEnrollments.find((e) => e.userId === userId && e.courseId === courseId) || null;
        },
        delete: async ({ where }: any) => {
          fakeEnrollments = fakeEnrollments.filter((e) => e.id !== where.id);
        },
        update: async ({ where, data }: any) => {
          const item = fakeEnrollments.find((e) => e.id === where.id);
          if (item) Object.assign(item, data);
        }
      },
      learningPathItem: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakeLearningPaths];
          return fakeLearningPaths.filter((lp) => lp.courseId === args.where.courseId);
        },
        findFirst: async ({ where }: any) => {
          return (
            fakeLearningPaths.find(
              (lp) =>
                lp.learningPathId === where.learningPathId &&
                lp.courseId === where.courseId &&
                (!where.id?.not || lp.id !== where.id.not)
            ) || null
          );
        },
        delete: async ({ where }: any) => {
          fakeLearningPaths = fakeLearningPaths.filter((lp) => lp.id !== where.id);
        },
        update: async ({ where, data }: any) => {
          const item = fakeLearningPaths.find((lp) => lp.id === where.id);
          if (item) Object.assign(item, data);
        }
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    const result = await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    expect(result.remappedCount).toBe(1);
    expect(result.remappedEnrollments).toBe(1);
    expect(result.remappedPathItems).toBe(1);
    expect(result.droppedEnrollments).toBe(0);
    expect(result.droppedPathItems).toBe(0);
    expect(result.finalCount).toBe(61);
    expect(deletedCourses).toEqual(['the-docker-handbook-for-beginners-to-production']);
    expect(fakeEnrollments[0].courseId).toBe(newTargetIdDocker);
    expect(fakeLearningPaths[0].courseId).toBe(newTargetIdDocker);
  });

  it('(b) throws before any update if a curated target course is missing in Course table', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    // Only 60 courses in DB instead of 61
    const missingTargetCurated = curatedCoursesData.slice(1).map((c) => ({
      id: generateCourseId(c),
      title: c.title,
      provider: c.provider,
      destinationUrl: c.destinationUrl
    }));

    let enrollmentUpdateAttempted = false;
    const mockTx = {
      course: {
        findMany: async () => [...missingTargetCurated],
        delete: async () => {},
        count: async () => missingTargetCurated.length
      },
      enrollment: {
        findMany: async () => [],
        findUnique: async () => null,
        delete: async () => {},
        update: async () => { enrollmentUpdateAttempted = true; }
      },
      learningPathItem: {
        findMany: async () => [],
        findFirst: async () => null,
        delete: async () => {},
        update: async () => {}
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    await expect(remapAndCleanupOldCourses(mockTx as any, curatedCoursesData)).rejects.toThrow(
      /\[Seed Migration Pre-check Error\] Cannot remap relations. Target curated courses missing from Course table/
    );
    expect(enrollmentUpdateAttempted).toBe(false);
  });

  it('(c) deduplicates enrollments when two old courses map to one target, keeping the higher progress', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    const targetCourse = curatedCoursesData.find((c) => c.title === 'The Docker Handbook for Beginners to Production')!;
    const newTargetIdDocker = generateCourseId(targetCourse);

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'the-docker-handbook-for-beginners-to-production',
        title: 'The Docker Handbook for Beginners to Production',
        provider: 'freeCodeCamp',
        destinationUrl: 'https://www.freecodecamp.org/news/the-docker-handbook/'
      }
    ];

    // Case 1: user-1 has existing target enrollment with 'not_started' (0%), incoming is 'completed' (100%) -> target upgraded to 'completed'
    // Case 2: user-2 has existing target enrollment with 'completed' (100%), incoming is 'in_progress' (50%) -> target stays 'completed'
    // Case 3: user-3 has existing target enrollment with 'in_progress' (30%), incoming is 'in_progress' (75%) -> target progress updated to 75%
    let fakeEnrollments = [
      // user-1
      { id: 'enr-target-1', userId: 'user-1', courseId: newTargetIdDocker, status: 'not_started', progressPercent: 0 },
      { id: 'enr-old-1', userId: 'user-1', courseId: 'the-docker-handbook-for-beginners-to-production', status: 'completed', progressPercent: 100 },
      // user-2
      { id: 'enr-target-2', userId: 'user-2', courseId: newTargetIdDocker, status: 'completed', progressPercent: 100 },
      { id: 'enr-old-2', userId: 'user-2', courseId: 'the-docker-handbook-for-beginners-to-production', status: 'in_progress', progressPercent: 50 },
      // user-3
      { id: 'enr-target-3', userId: 'user-3', courseId: newTargetIdDocker, status: 'in_progress', progressPercent: 30 },
      { id: 'enr-old-3', userId: 'user-3', courseId: 'the-docker-handbook-for-beginners-to-production', status: 'in_progress', progressPercent: 75 }
    ];

    const mockTx = {
      course: {
        findMany: async () => [...fakeDbCourses],
        delete: async ({ where }: any) => {
          const idx = fakeDbCourses.findIndex((c) => c.id === where.id);
          if (idx !== -1) fakeDbCourses.splice(idx, 1);
        },
        count: async () => fakeDbCourses.length
      },
      enrollment: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakeEnrollments];
          return fakeEnrollments.filter((e) => e.courseId === args.where.courseId);
        },
        findUnique: async ({ where }: any) => {
          const { userId, courseId } = where.userId_courseId;
          return fakeEnrollments.find((e) => e.userId === userId && e.courseId === courseId) || null;
        },
        delete: async ({ where }: any) => {
          fakeEnrollments = fakeEnrollments.filter((e) => e.id !== where.id);
        },
        update: async ({ where, data }: any) => {
          const item = fakeEnrollments.find((e) => e.id === where.id);
          if (item) Object.assign(item, data);
        }
      },
      learningPathItem: {
        findMany: async () => [],
        findFirst: async () => null,
        delete: async () => {},
        update: async () => {}
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    // Old enrollment rows are deleted
    expect(fakeEnrollments.some((e) => e.id === 'enr-old-1')).toBe(false);
    expect(fakeEnrollments.some((e) => e.id === 'enr-old-2')).toBe(false);
    expect(fakeEnrollments.some((e) => e.id === 'enr-old-3')).toBe(false);

    // user-1 was upgraded to completed
    const u1 = fakeEnrollments.find((e) => e.id === 'enr-target-1')!;
    expect(u1.status).toBe('completed');
    expect(u1.progressPercent).toBe(100);

    // user-2 stayed completed
    const u2 = fakeEnrollments.find((e) => e.id === 'enr-target-2')!;
    expect(u2.status).toBe('completed');
    expect(u2.progressPercent).toBe(100);

    // user-3 progressed up to 75%
    const u3 = fakeEnrollments.find((e) => e.id === 'enr-target-3')!;
    expect(u3.status).toBe('in_progress');
    expect(u3.progressPercent).toBe(75);
  });

  it('(d) drops non-equivalent course relations, counts dropped items, and logs drops', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'full-stack-open---deep-dive-into-mod',
        title: 'Full Stack Open — Deep Dive Into Modern Web Development',
        provider: 'University of Helsinki',
        destinationUrl: 'https://fullstackopen.com/en/'
      },
      {
        id: 'react-documentation---official-inter',
        title: 'React Documentation & Official Interactive Tutorials',
        provider: 'React.dev',
        destinationUrl: 'https://react.dev/learn'
      }
    ];

    let fakeEnrollments = [
      { id: 'enr-fso', userId: 'user-1', courseId: 'full-stack-open---deep-dive-into-mod', status: 'in_progress', progressPercent: 40 },
      { id: 'enr-react', userId: 'user-2', courseId: 'react-documentation---official-inter', status: 'completed', progressPercent: 100 }
    ];

    let fakeLearningPaths = [
      { id: 'lp-fso', learningPathId: 'path-1', courseId: 'full-stack-open---deep-dive-into-mod' }
    ];

    let deletedCourses: string[] = [];

    const mockTx = {
      course: {
        findMany: async () => [...fakeDbCourses],
        delete: async ({ where }: any) => {
          deletedCourses.push(where.id);
          const idx = fakeDbCourses.findIndex((c) => c.id === where.id);
          if (idx !== -1) fakeDbCourses.splice(idx, 1);
        },
        count: async () => fakeDbCourses.length
      },
      enrollment: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakeEnrollments];
          return fakeEnrollments.filter((e) => e.courseId === args.where.courseId);
        },
        findUnique: async () => null,
        delete: async ({ where }: any) => {
          fakeEnrollments = fakeEnrollments.filter((e) => e.id !== where.id);
        },
        update: async () => {}
      },
      learningPathItem: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakeLearningPaths];
          return fakeLearningPaths.filter((lp) => lp.courseId === args.where.courseId);
        },
        findFirst: async () => null,
        delete: async ({ where }: any) => {
          fakeLearningPaths = fakeLearningPaths.filter((lp) => lp.id !== where.id);
        },
        update: async () => {}
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    const result = await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    expect(result.droppedEnrollments).toBe(2);
    expect(result.droppedPathItems).toBe(1);
    expect(fakeEnrollments.length).toBe(0);
    expect(fakeLearningPaths.length).toBe(0);
    expect(deletedCourses).toContain('full-stack-open---deep-dive-into-mod');
    expect(deletedCourses).toContain('react-documentation---official-inter');
    expect(result.finalCount).toBe(61);
  });

  it('(e) throws if an enrollment, learning path item or course skill references an unmapped course ID', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      }))
    ];

    const fakeEnrollments = [
      { id: 'enr-orphan', userId: 'user-1', courseId: 'unmapped-orphan-course-id-999' }
    ];

    const mockTx = {
      course: {
        findMany: async () => [...fakeDbCourses],
        delete: async () => {},
        count: async () => fakeDbCourses.length
      },
      enrollment: {
        findMany: async () => [...fakeEnrollments],
        findUnique: async () => null,
        delete: async () => {},
        update: async () => {}
      },
      learningPathItem: {
        findMany: async () => [],
        findFirst: async () => null,
        delete: async () => {},
        update: async () => {}
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    await expect(remapAndCleanupOldCourses(mockTx as any, curatedCoursesData)).rejects.toThrow(
      /\[Seed Migration Pre-check Error\] Found relations referencing course IDs that are neither curated, mapped, nor dropped: unmapped-orphan-course-id-999/
    );
  });

  it('deduplicates several old-id LearningPathItem rows mapping to ONE new course without duplicate rows or constraint failures', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');
    const newTargetIdDocker = generateCourseId(
      curatedCoursesData.find((c) => c.title === 'The Docker Handbook for Beginners to Production')!
    );

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'the-docker-handbook-for-beginners-to-production',
        title: 'The Docker Handbook for Beginners to Production',
        provider: 'freeCodeCamp',
        destinationUrl: 'https://www.freecodecamp.org/news/the-docker-handbook/'
      }
    ];

    let fakeLearningPaths = [
      { id: 'lpi-1', learningPathId: 'lp-same-user-path', courseId: newTargetIdDocker },
      { id: 'lpi-2', learningPathId: 'lp-same-user-path', courseId: 'the-docker-handbook-for-beginners-to-production' }
    ];

    const mockTx = {
      course: {
        findMany: async () => [...fakeDbCourses],
        delete: async ({ where }: any) => {
          const idx = fakeDbCourses.findIndex((c) => c.id === where.id);
          if (idx !== -1) fakeDbCourses.splice(idx, 1);
        },
        count: async () => fakeDbCourses.length
      },
      enrollment: {
        findMany: async () => [],
        findUnique: async () => null,
        delete: async () => {},
        update: async () => {}
      },
      learningPathItem: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakeLearningPaths];
          return fakeLearningPaths.filter((lp) => lp.courseId === args.where.courseId);
        },
        findFirst: async ({ where }: any) => {
          return (
            fakeLearningPaths.find(
              (lp) =>
                lp.learningPathId === where.learningPathId &&
                lp.courseId === where.courseId &&
                (!where.id?.not || lp.id !== where.id.not)
            ) || null
          );
        },
        delete: async ({ where }: any) => {
          fakeLearningPaths = fakeLearningPaths.filter((lp) => lp.id !== where.id);
        },
        update: async ({ where, data }: any) => {
          const item = fakeLearningPaths.find((lp) => lp.id === where.id);
          if (item) Object.assign(item, data);
        }
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    const result = await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    expect(result.remappedCount).toBe(1);
    expect(result.finalCount).toBe(61);

    const itemsInPath = fakeLearningPaths.filter((lp) => lp.learningPathId === 'lp-same-user-path');
    expect(itemsInPath.length).toBe(1);
    expect(itemsInPath[0].courseId).toBe(newTargetIdDocker);
    expect(itemsInPath[0].id).toBe('lpi-1');
  });

  it('confirms the course remap runs in one transaction and rolls back on failure', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');
    const corruptedDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'obsolete-orphaned-course-without-match',
        title: 'Unmatchable Random Ghost Course Title 999',
        provider: 'Unknown',
        destinationUrl: 'https://example.com/ghost'
      }
    ];

    let rollbackExecuted = false;

    async function runPrismaTransaction(fn: (tx: any) => Promise<any>): Promise<any> {
      const stateBefore = JSON.stringify(corruptedDbCourses);
      try {
        const mockTx = {
          course: {
            findMany: async () => [...corruptedDbCourses],
            delete: async () => {},
            count: async () => corruptedDbCourses.length
          },
          enrollment: {
            findMany: async () => [],
            findUnique: async () => null,
            delete: async () => {},
            update: async () => {}
          },
          learningPathItem: {
            findMany: async () => [],
            findFirst: async () => null,
            delete: async () => {},
            update: async () => {}
          },
          courseSkill: {
            findMany: async () => [],
            deleteMany: async () => {}
          }
        };

        return await fn(mockTx);
      } catch (err) {
        rollbackExecuted = true;
        expect(JSON.stringify(corruptedDbCourses)).toBe(stateBefore);
        throw err;
      }
    }

    await expect(
      runPrismaTransaction(async (tx) => {
        return await remapAndCleanupOldCourses(tx, curatedCoursesData);
      })
    ).rejects.toThrow(/\[Seed Migration Error\]/);

    expect(rollbackExecuted).toBe(true);
  });

  it('confirms SEED_TRANSACTION_OPTIONS configures { maxWait: 15000, timeout: 120000 } for long-running seed transactions', async () => {
    const { SEED_TRANSACTION_OPTIONS } = await import('../prisma/seed');
    expect(SEED_TRANSACTION_OPTIONS).toBeDefined();
    expect(SEED_TRANSACTION_OPTIONS.maxWait).toBe(15000);
    expect(SEED_TRANSACTION_OPTIONS.timeout).toBe(120000);
  });

  it('renumbers stepOrder to 1..n per LearningPath after non-equivalent drops, keeping original relative order idempotently', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'full-stack-open---deep-dive-into-mod',
        title: 'Full Stack Open — Deep Dive Into Modern Web Development',
        provider: 'University of Helsinki',
        destinationUrl: 'https://fullstackopen.com/en/'
      },
      {
        id: 'react-documentation---official-inter',
        title: 'React Documentation & Official Interactive Tutorials',
        provider: 'React.dev',
        destinationUrl: 'https://react.dev/learn'
      }
    ];

    // Path A had steps [1, 2, 3, 4, 5]. Step 1 and 2 were dropped courses. Remaining were steps 3, 4, 5.
    // Path B had steps [1, 2, 3, 4]. Step 2 was dropped course. Remaining were steps 1, 3, 4.
    let fakePathItems = [
      // Path A
      { id: 'item-a-1', learningPathId: 'lp-a', courseId: 'full-stack-open---deep-dive-into-mod', stepOrder: 1 },
      { id: 'item-a-2', learningPathId: 'lp-a', courseId: 'react-documentation---official-inter', stepOrder: 2 },
      { id: 'item-a-3', learningPathId: 'lp-a', courseId: generateCourseId(curatedCoursesData[0]), stepOrder: 3 },
      { id: 'item-a-4', learningPathId: 'lp-a', courseId: generateCourseId(curatedCoursesData[1]), stepOrder: 4 },
      { id: 'item-a-5', learningPathId: 'lp-a', courseId: generateCourseId(curatedCoursesData[2]), stepOrder: 5 },
      // Path B
      { id: 'item-b-1', learningPathId: 'lp-b', courseId: generateCourseId(curatedCoursesData[3]), stepOrder: 1 },
      { id: 'item-b-2', learningPathId: 'lp-b', courseId: 'react-documentation---official-inter', stepOrder: 2 },
      { id: 'item-b-3', learningPathId: 'lp-b', courseId: generateCourseId(curatedCoursesData[4]), stepOrder: 3 },
      { id: 'item-b-4', learningPathId: 'lp-b', courseId: generateCourseId(curatedCoursesData[5]), stepOrder: 4 }
    ];

    const updatedStepOrders: { id: string; stepOrder: number }[] = [];

    const mockTx = {
      course: {
        findMany: async () => [...fakeDbCourses],
        delete: async () => {},
        deleteMany: async ({ where }: any) => {
          if (where?.id?.in) {
            where.id.in.forEach((id: string) => {
              const idx = fakeDbCourses.findIndex((c) => c.id === id);
              if (idx !== -1) fakeDbCourses.splice(idx, 1);
            });
          }
        },
        count: async () => fakeDbCourses.length
      },
      enrollment: {
        findMany: async () => [],
        findUnique: async () => null,
        delete: async () => {},
        deleteMany: async () => {},
        update: async () => {},
        updateMany: async () => {}
      },
      learningPathItem: {
        findMany: async (args: any) => {
          if (!args?.where) return [...fakePathItems];
          if (args.where.courseId?.in) {
            return fakePathItems.filter((i) => args.where.courseId.in.includes(i.courseId));
          }
          if (args.where.courseId) {
            return fakePathItems.filter((i) => i.courseId === args.where.courseId);
          }
          return [...fakePathItems];
        },
        delete: async ({ where }: any) => {
          fakePathItems = fakePathItems.filter((i) => i.id !== where.id);
        },
        deleteMany: async ({ where }: any) => {
          if (where?.id?.in) {
            fakePathItems = fakePathItems.filter((i) => !where.id.in.includes(i.id));
          }
        },
        update: async ({ where, data }: any) => {
          const item = fakePathItems.find((i) => i.id === where.id);
          if (item) {
            Object.assign(item, data);
            if (data.stepOrder !== undefined) {
              updatedStepOrders.push({ id: item.id, stepOrder: data.stepOrder });
            }
          }
        },
        updateMany: async () => {}
      },
      courseSkill: {
        findMany: async () => [],
        deleteMany: async () => {}
      }
    };

    const res = await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    expect(res.droppedPathItems).toBe(3);

    // Path A remaining items must be renumbered 1, 2, 3 (not 3, 4, 5)
    const lpA = fakePathItems.filter((i) => i.learningPathId === 'lp-a').sort((a, b) => a.stepOrder - b.stepOrder);
    expect(lpA.length).toBe(3);
    expect(lpA.map((i) => i.stepOrder)).toEqual([1, 2, 3]);
    expect(lpA[0].id).toBe('item-a-3');
    expect(lpA[1].id).toBe('item-a-4');
    expect(lpA[2].id).toBe('item-a-5');

    // Path B remaining items must be renumbered 1, 2, 3 (not 1, 3, 4)
    const lpB = fakePathItems.filter((i) => i.learningPathId === 'lp-b').sort((a, b) => a.stepOrder - b.stepOrder);
    expect(lpB.length).toBe(3);
    expect(lpB.map((i) => i.stepOrder)).toEqual([1, 2, 3]);
    expect(lpB[0].id).toBe('item-b-1');
    expect(lpB[1].id).toBe('item-b-3');
    expect(lpB[2].id).toBe('item-b-4');
  });
});
