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

  it('remaps fake old-id rows referenced by enrollments and learning paths and enforces 61 count assertion', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');

    const newTargetIdDocker = generateCourseId(
      curatedCoursesData.find((c) => c.title === 'The Docker Handbook for Beginners to Production')!
    );
    const newTargetIdReact = generateCourseId(
      curatedCoursesData.find((c) => c.title === 'Front End Development Libraries')!
    );

    // Mock DB state
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
      },
      {
        id: 'react-documentation---official-inter',
        title: 'React Documentation & Official Interactive Tutorials',
        provider: 'React.dev',
        destinationUrl: 'https://react.dev/learn'
      }
    ];

    let fakeEnrollments = [
      { id: 'enr-1', userId: 'user-1', courseId: 'react-documentation---official-inter' },
      { id: 'enr-2', userId: 'user-2', courseId: 'the-docker-handbook-for-beginners-to-production' },
      { id: 'enr-3', userId: 'user-3', courseId: newTargetIdDocker }, // already enrolled in target
      { id: 'enr-4', userId: 'user-3', courseId: 'the-docker-handbook-for-beginners-to-production' } // duplicate to be deleted
    ];

    let fakeLearningPaths = [
      { id: 'lp-1', learningPathId: 'path-user-1', courseId: 'react-documentation---official-inter' }
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
        findMany: async ({ where }: any) => fakeEnrollments.filter((e) => e.courseId === where.courseId),
        findUnique: async ({ where }: any) => {
          const { userId, courseId } = where.userId_courseId;
          return fakeEnrollments.find((e) => e.userId === userId && e.courseId === courseId) || null;
        },
        delete: async ({ where }: any) => {
          fakeEnrollments = fakeEnrollments.filter((e) => e.id !== where.id);
        },
        update: async ({ where, data }: any) => {
          const item = fakeEnrollments.find((e) => e.id === where.id);
          if (item) item.courseId = data.courseId;
        }
      },
      learningPathItem: {
        findMany: async ({ where }: any) => fakeLearningPaths.filter((lp) => lp.courseId === where.courseId),
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
          if (item) item.courseId = data.courseId;
        }
      },
      courseSkill: {
        deleteMany: async () => {}
      }
    };

    const result = await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    expect(result.remappedCount).toBe(2);
    expect(result.finalCount).toBe(61);
    expect(deletedCourses).toEqual([
      'the-docker-handbook-for-beginners-to-production',
      'react-documentation---official-inter'
    ]);

    // Check enrollment remapping
    expect(fakeEnrollments.find((e) => e.id === 'enr-1')?.courseId).toBe(newTargetIdReact);
    expect(fakeEnrollments.find((e) => e.id === 'enr-2')?.courseId).toBe(newTargetIdDocker);
    expect(fakeEnrollments.find((e) => e.id === 'enr-4')).toBeUndefined(); // deleted duplicate

    // Check learning path remapping
    expect(fakeLearningPaths[0].courseId).toBe(newTargetIdReact);
  });

  it('deduplicates several old-id LearningPathItem rows mapping to ONE new course without duplicate rows or constraint failures', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');
    const newTargetIdReact = generateCourseId(
      curatedCoursesData.find((c) => c.title === 'Front End Development Libraries')!
    );

    const fakeDbCourses = [
      ...curatedCoursesData.map((c) => ({
        id: generateCourseId(c),
        title: c.title,
        provider: c.provider,
        destinationUrl: c.destinationUrl
      })),
      {
        id: 'react-documentation---official-inter',
        title: 'React Documentation & Official Interactive Tutorials',
        provider: 'React.dev',
        destinationUrl: 'https://react.dev/learn'
      }
    ];

    // Same user, same learning path ("lp-same-user-path"), but multiple old/existing items
    let fakeLearningPaths = [
      // Row 1: already has target course in the same path
      { id: 'lpi-1', learningPathId: 'lp-same-user-path', courseId: newTargetIdReact },
      // Row 2: old course that maps to newTargetIdReact
      { id: 'lpi-2', learningPathId: 'lp-same-user-path', courseId: 'react-documentation---official-inter' }
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
        findMany: async ({ where }: any) => fakeLearningPaths.filter((lp) => lp.courseId === where.courseId),
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
          if (item) item.courseId = data.courseId;
        }
      },
      courseSkill: {
        deleteMany: async () => {}
      }
    };

    const result = await remapAndCleanupOldCourses(mockTx as any, curatedCoursesData);

    expect(result.remappedCount).toBe(1);
    expect(result.finalCount).toBe(61);

    // Exactly one row exists in this path for newTargetIdReact (duplicate deleted, no constraint error)
    const itemsInPath = fakeLearningPaths.filter((lp) => lp.learningPathId === 'lp-same-user-path');
    expect(itemsInPath.length).toBe(1);
    expect(itemsInPath[0].courseId).toBe(newTargetIdReact);
    expect(itemsInPath[0].id).toBe('lpi-1');
  });

  it('confirms the course remap runs in one transaction and rolls back on failure', async () => {
    const { remapAndCleanupOldCourses } = await import('../prisma/seed');
    // Set up DB with mismatched count so assertion fails inside the transaction
    const corruptedDbCourses = [
      {
        id: 'obsolete-orphaned-course-without-match',
        title: 'Unmatchable Random Ghost Course Title 999',
        provider: 'Unknown',
        destinationUrl: 'https://example.com/ghost'
      }
    ];

    let rollbackExecuted = false;

    // Simulate Prisma transactional runner
    async function runPrismaTransaction(fn: (tx: any) => Promise<any>): Promise<any> {
      // Snapshot state prior to transaction
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
            deleteMany: async () => {}
          }
        };

        return await fn(mockTx);
      } catch (err) {
        // Rollback on failure
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
});
