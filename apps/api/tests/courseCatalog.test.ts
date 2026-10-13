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
});
