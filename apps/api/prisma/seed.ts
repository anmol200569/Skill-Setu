import { PrismaClient } from '@prisma/client';
import { domainsData, rolesData, curatedCoursesData, diagnosticQuestionsData, generateCourseId } from './seedData';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting Skill Setu database seeding...');

  // 1. Seed Domains & Skills
  const skillCodeToIdMap = new Map<string, string>();

  for (const domainData of domainsData) {
    const domain = await prisma.domain.upsert({
      where: { code: domainData.code },
      update: {
        name: domainData.name,
        description: domainData.description,
        icon: domainData.icon
      },
      create: {
        code: domainData.code,
        name: domainData.name,
        description: domainData.description,
        icon: domainData.icon
      }
    });

    for (const skillData of domainData.skills) {
      const skill = await prisma.skill.upsert({
        where: { code: skillData.code },
        update: {
          name: skillData.name,
          category: skillData.category,
          description: skillData.description,
          domainId: domain.id
        },
        create: {
          code: skillData.code,
          name: skillData.name,
          category: skillData.category,
          description: skillData.description,
          domainId: domain.id
        }
      });
      skillCodeToIdMap.set(skill.code, skill.id);
    }
  }
  console.log(`✅ Seeded ${domainsData.length} domains and skills.`);

  // 2. Seed Roles and Role Skill Requirements
  for (const roleData of rolesData) {
    const role = await prisma.role.upsert({
      where: { code: roleData.code },
      update: {
        title: roleData.title,
        description: roleData.description,
        industryDemand: roleData.industryDemand
      },
      create: {
        code: roleData.code,
        title: roleData.title,
        description: roleData.description,
        industryDemand: roleData.industryDemand
      }
    });

    for (const req of roleData.requirements) {
      const skillId = skillCodeToIdMap.get(req.skillCode);
      if (skillId) {
        await prisma.roleSkillRequirement.upsert({
          where: {
            roleId_skillId: {
              roleId: role.id,
              skillId: skillId
            }
          },
          update: {
            requiredProficiency: req.requiredProficiency,
            priority: req.priority as any,
            weight: req.weight
          },
          create: {
            roleId: role.id,
            skillId: skillId,
            requiredProficiency: req.requiredProficiency,
            priority: req.priority as any,
            weight: req.weight
          }
        });
      }
    }
  }
  console.log(`✅ Seeded ${rolesData.length} career roles and requirements.`);

  // 3. Seed Curated Courses & Course-Skill relations
  for (const courseData of curatedCoursesData) {
    const targetId = generateCourseId(courseData);

    const existingCourse = await prisma.course.findFirst({
      where: {
        OR: [
          { id: targetId },
          { destinationUrl: courseData.destinationUrl }
        ]
      }
    });

    // If an existing course row has a different old ID, remap any relations first
    if (existingCourse && existingCourse.id !== targetId) {
      const enrollments = await prisma.enrollment.findMany({ where: { courseId: existingCourse.id } });
      for (const enr of enrollments) {
        const hasTarget = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: enr.userId, courseId: targetId } }
        });
        if (hasTarget) {
          await prisma.enrollment.delete({ where: { id: enr.id } });
        } else {
          await prisma.enrollment.update({ where: { id: enr.id }, data: { courseId: targetId } });
        }
      }
      await prisma.learningPathItem.updateMany({
        where: { courseId: existingCourse.id },
        data: { courseId: targetId }
      });
      await prisma.courseSkill.deleteMany({ where: { courseId: existingCourse.id } });
      await prisma.course.delete({ where: { id: existingCourse.id } });
    }

    const course = await prisma.course.upsert({
      where: { id: targetId },
      update: {
        title: courseData.title,
        provider: courseData.provider,
        destinationUrl: courseData.destinationUrl,
        skillsCovered: courseData.skillsCovered,
        difficulty: courseData.difficulty,
        estimatedHours: courseData.estimatedHours,
        language: courseData.language,
        isFree: courseData.isFree,
        rating: courseData.rating,
        ratingSource: courseData.ratingSource,
        description: courseData.description
      },
      create: {
        id: targetId,
        title: courseData.title,
        provider: courseData.provider,
        destinationUrl: courseData.destinationUrl,
        skillsCovered: courseData.skillsCovered,
        difficulty: courseData.difficulty,
        estimatedHours: courseData.estimatedHours,
        language: courseData.language,
        isFree: courseData.isFree,
        rating: courseData.rating,
        ratingSource: courseData.ratingSource,
        description: courseData.description
      }
    });

    // Map course skills
    for (const skillCode of courseData.skillsCovered) {
      const skillId = skillCodeToIdMap.get(skillCode);
      if (skillId) {
        await prisma.courseSkill.upsert({
          where: {
            courseId_skillId: {
              courseId: course.id,
              skillId: skillId
            }
          },
          update: {},
          create: {
            courseId: course.id,
            skillId: skillId
          }
        });
      }
    }
  }
  console.log(`✅ Seeded ${curatedCoursesData.length} curated courses.`);

  // 3b. Transactional Remapping of ALL old-id course rows to matching new curated IDs
  await prisma.$transaction(async (tx) => {
    const result = await remapAndCleanupOldCourses(tx as any, curatedCoursesData);
    console.log(`🧹 Transactionally remapped ${result.remappedCount} old course rows. Verified final course count: ${result.finalCount} / ${curatedCoursesData.length}.`);
  });

  // 4. Seed Diagnostic Assessment Questions (Idempotent)
  for (const q of diagnosticQuestionsData) {
    const skillId = skillCodeToIdMap.get(q.skillCode);
    if (skillId) {
      const existing = await prisma.assessmentQuestion.findFirst({
        where: {
          skillId: skillId,
          questionText: q.questionText
        }
      });

      if (!existing) {
        await prisma.assessmentQuestion.create({
          data: {
            skillId: skillId,
            questionText: q.questionText,
            type: q.type as any,
            difficulty: q.difficulty as any,
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation
          }
        });
      } else {
        await prisma.assessmentQuestion.update({
          where: { id: existing.id },
          data: {
            type: q.type as any,
            difficulty: q.difficulty as any,
            options: q.options,
            correctAnswers: q.correctAnswers,
            explanation: q.explanation
          }
        });
      }
    }
  }
  console.log(`✅ Seeded diagnostic assessment questions.`);

  // Cleanup obsolete questions not present in seedData.ts
  const validQuestionSignatures = new Set(
    diagnosticQuestionsData.map((q) => `${q.skillCode}:::${q.questionText.trim()}`)
  );

  const existingQuestions = await prisma.assessmentQuestion.findMany({
    select: {
      id: true,
      questionText: true,
      skill: {
        select: {
          code: true
        }
      },
      _count: {
        select: {
          answers: true
        }
      }
    }
  });

  let deletedQCount = 0;
  let inactiveQCount = 0;

  for (const q of existingQuestions) {
    const rawText = q.questionText.replace(/^\[INACTIVE\]\s*/i, '').trim();
    const signature = `${q.skill.code}:::${rawText}`;
    if (!validQuestionSignatures.has(signature)) {
      if (q._count.answers === 0) {
        await prisma.assessmentQuestion.delete({ where: { id: q.id } });
        deletedQCount++;
      } else if (!q.questionText.startsWith('[INACTIVE] ')) {
        await prisma.assessmentQuestion.update({
          where: { id: q.id },
          data: {
            questionText: `[INACTIVE] ${rawText}`
          }
        });
        inactiveQCount++;
      }
    }
  }

  if (deletedQCount > 0 || inactiveQCount > 0) {
    console.log(`🧹 Cleaned up questions: ${deletedQCount} deleted (unreferenced), ${inactiveQCount} marked inactive.`);
  }

  // 5. Bootstrap Initial Administrator if email configured
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  if (adminEmail) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    if (existingAdmin && existingAdmin.role !== 'admin') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' }
      });
      console.log(`👑 Assigned admin role to bootstrapped administrator: ${adminEmail}`);
    }
  }

  console.log('🎉 Seeding successfully completed!');
}

export interface CourseRemapClient {
  course: {
    findMany: (args: any) => Promise<any[]>;
    delete: (args: any) => Promise<any>;
    count: () => Promise<number>;
  };
  enrollment: {
    findMany: (args: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  learningPathItem: {
    updateMany: (args: any) => Promise<any>;
  };
  courseSkill: {
    deleteMany: (args: any) => Promise<any>;
  };
}

export async function remapAndCleanupOldCourses(
  tx: CourseRemapClient,
  curatedCourses: typeof curatedCoursesData
): Promise<{ remappedCount: number; finalCount: number }> {
  const validCourseIds = new Set(curatedCourses.map((c) => generateCourseId(c)));
  const curatedMapByUrl = new Map<string, string>();
  const curatedMapByTitle = new Map<string, string>();

  for (const c of curatedCourses) {
    const id = generateCourseId(c);
    curatedMapByUrl.set(c.destinationUrl.trim().toLowerCase(), id);
    const titleKey = `${c.provider.trim().toLowerCase()}:::${c.title.trim().toLowerCase()}`;
    curatedMapByTitle.set(titleKey, id);
  }

  const targetReactCourse = curatedCourses.find((c) => c.title === 'Front End Development Libraries')!;
  const targetSqlCourse = curatedCourses.find((c) => c.title === 'Administering Microsoft Azure SQL Databases (DP-300)')!;
  const targetFullStackCourse = curatedCourses.find((c) => c.title === 'Back End Development and APIs')!;

  const explicitLegacyRemap: Record<string, string> = {
    'react-documentation---official-inter': generateCourseId(targetReactCourse),
    'relational-database-design-and-sql-m': generateCourseId(targetSqlCourse),
    'full-stack-open---deep-dive-into-mod': generateCourseId(targetFullStackCourse)
  };

  const allDbCourses = await tx.course.findMany({
    select: { id: true, title: true, provider: true, destinationUrl: true }
  });

  const oldCourses = allDbCourses.filter((c) => !validCourseIds.has(c.id));
  let remappedCount = 0;

  for (const old of oldCourses) {
    const urlKey = (old.destinationUrl || '').trim().toLowerCase();
    let targetId = curatedMapByUrl.get(urlKey);
    if (!targetId) {
      const titleKey = `${(old.provider || '').trim().toLowerCase()}:::${(old.title || '').trim().toLowerCase()}`;
      targetId = curatedMapByTitle.get(titleKey);
    }
    if (!targetId && explicitLegacyRemap[old.id]) {
      targetId = explicitLegacyRemap[old.id];
    }

    if (!targetId) {
      throw new Error(`[Seed Migration Error] Course "${old.id}" ("${old.title}") has no matching curated course target.`);
    }

    // Remap enrollments
    const enrollments = await tx.enrollment.findMany({ where: { courseId: old.id } });
    for (const enr of enrollments) {
      const hasTarget = await tx.enrollment.findUnique({
        where: { userId_courseId: { userId: enr.userId, courseId: targetId } }
      });
      if (hasTarget) {
        await tx.enrollment.delete({ where: { id: enr.id } });
      } else {
        await tx.enrollment.update({ where: { id: enr.id }, data: { courseId: targetId } });
      }
    }

    // Remap learning path items (deduplicating within the same learningPath)
    const lpItems = await tx.learningPathItem.findMany({ where: { courseId: old.id } });
    for (const item of lpItems) {
      const existingInPath = await tx.learningPathItem.findFirst({
        where: {
          learningPathId: item.learningPathId,
          courseId: targetId,
          id: { not: item.id }
        }
      });
      if (existingInPath) {
        await tx.learningPathItem.delete({ where: { id: item.id } });
      } else {
        await tx.learningPathItem.update({
          where: { id: item.id },
          data: { courseId: targetId }
        });
      }
    }

    // Delete course skills
    await tx.courseSkill.deleteMany({ where: { courseId: old.id } });

    // Delete obsolete course row
    await tx.course.delete({ where: { id: old.id } });
    remappedCount++;
  }

  // Strictly assert final course count inside the transaction
  const finalCount = await tx.course.count();
  if (finalCount !== curatedCourses.length) {
    throw new Error(
      `Course count mismatch after seeding: expected ${curatedCourses.length}, found ${finalCount}`
    );
  }

  return { remappedCount, finalCount };
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
