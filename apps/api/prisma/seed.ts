import { PrismaClient } from '@prisma/client';
import { domainsData, rolesData, curatedCoursesData, diagnosticQuestionsData, generateCourseId } from './seedData';
import { ensureSystemQuizzesSeeded } from '../src/services/systemQuizService';

const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: connectionUrl ? { db: { url: connectionUrl } } : undefined
});

export const SEED_TRANSACTION_OPTIONS = {
  maxWait: 15000,
  timeout: 120000
};

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
  await prisma.$transaction(
    async (tx) => {
      const result = await remapAndCleanupOldCourses(tx as any, curatedCoursesData);
      console.log(
        `🧹 Transactionally remapped ${result.remappedCount} old course rows (${result.remappedEnrollments} enrollments, ${result.remappedPathItems} path items; dropped ${result.droppedEnrollments} enrollments, ${result.droppedPathItems} path items). Verified final course count: ${result.finalCount} / ${curatedCoursesData.length}.`
      );
    },
    SEED_TRANSACTION_OPTIONS
  );

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

  // 6. Bootstrap system practice quizzes
  const seededQuizzes = await ensureSystemQuizzesSeeded();
  console.log(`✅ Seeded / verified ${seededQuizzes} system practice quizzes.`);

  console.log('🎉 Seeding successfully completed!');
}

export interface CourseRemapClient {
  course: {
    findMany: (args?: any) => Promise<any[]>;
    delete?: (args: any) => Promise<any>;
    deleteMany?: (args: any) => Promise<any>;
    count: () => Promise<number>;
  };
  enrollment: {
    findMany: (args?: any) => Promise<any[]>;
    findUnique?: (args: any) => Promise<any>;
    delete?: (args: any) => Promise<any>;
    deleteMany?: (args: any) => Promise<any>;
    update?: (args: any) => Promise<any>;
    updateMany?: (args: any) => Promise<any>;
  };
  learningPathItem: {
    findMany: (args?: any) => Promise<any[]>;
    findFirst?: (args: any) => Promise<any>;
    delete?: (args: any) => Promise<any>;
    deleteMany?: (args: any) => Promise<any>;
    update?: (args: any) => Promise<any>;
    updateMany?: (args: any) => Promise<any>;
  };
  learningPath?: {
    findMany: (args?: any) => Promise<any[]>;
  };
  courseSkill: {
    findMany?: (args?: any) => Promise<any[]>;
    deleteMany: (args: any) => Promise<any>;
  };
}

export interface CourseRemapResult {
  remappedCount: number;
  finalCount: number;
  remappedEnrollments: number;
  remappedPathItems: number;
  droppedEnrollments: number;
  droppedPathItems: number;
}

export async function remapAndCleanupOldCourses(
  tx: CourseRemapClient,
  curatedCourses: typeof curatedCoursesData
): Promise<CourseRemapResult> {
  const validCourseIds = new Set(curatedCourses.map((c) => generateCourseId(c)));
  const curatedMapByUrl = new Map<string, string>();
  const curatedMapByTitle = new Map<string, string>();

  for (const c of curatedCourses) {
    const id = generateCourseId(c);
    curatedMapByUrl.set(c.destinationUrl.trim().toLowerCase(), id);
    const titleKey = `${c.provider.trim().toLowerCase()}:::${c.title.trim().toLowerCase()}`;
    curatedMapByTitle.set(titleKey, id);
  }

  // Courses with no genuine equivalent in curated catalog: relations are dropped, not remapped
  const KNOWN_NON_EQUIVALENT_DROPPED_IDS = new Set([
    'full-stack-open---deep-dive-into-mod',
    'relational-database-design-and-sql-m',
    'react-documentation---official-inter'
  ]);

  const allDbCourses = await tx.course.findMany({
    select: { id: true, title: true, provider: true, destinationUrl: true }
  });

  const dbCourseIdSet = new Set(allDbCourses.map((c) => c.id));

  // Pre-check 1: Ensure all curated courses have been upserted into Course table
  const missingCurated = Array.from(validCourseIds).filter((id) => !dbCourseIdSet.has(id));
  if (missingCurated.length > 0) {
    throw new Error(
      `[Seed Migration Pre-check Error] Cannot remap relations. Target curated courses missing from Course table: ${missingCurated.join(', ')}`
    );
  }

  const oldCourses = allDbCourses.filter((c) => !validCourseIds.has(c.id));
  const oldCourseIds = oldCourses.map((c) => c.id);

  const mappedOldCourseMap = new Map<string, string>();
  for (const old of oldCourses) {
    if (KNOWN_NON_EQUIVALENT_DROPPED_IDS.has(old.id)) {
      continue;
    }
    const urlKey = (old.destinationUrl || '').trim().toLowerCase();
    let targetId = curatedMapByUrl.get(urlKey);
    if (!targetId) {
      const titleKey = `${(old.provider || '').trim().toLowerCase()}:::${(old.title || '').trim().toLowerCase()}`;
      targetId = curatedMapByTitle.get(titleKey);
    }
    if (targetId && validCourseIds.has(targetId)) {
      mappedOldCourseMap.set(old.id, targetId);
    } else {
      throw new Error(`[Seed Migration Error] Course "${old.id}" ("${old.title}") has no matching curated course target.`);
    }
  }

  // Pre-check 2: Any Enrollment, LearningPathItem or CourseSkill row referencing an unknown course ID
  const enrollmentsInDb = await tx.enrollment.findMany({ select: { courseId: true } });
  const pathItemsInDb = await tx.learningPathItem.findMany({ select: { courseId: true } });
  const courseSkillsInDb = tx.courseSkill.findMany
    ? await tx.courseSkill.findMany({ select: { courseId: true } })
    : [];

  const referencedCourseIds = new Set<string>();
  enrollmentsInDb.forEach((e: any) => referencedCourseIds.add(e.courseId));
  pathItemsInDb.forEach((p: any) => referencedCourseIds.add(p.courseId));
  courseSkillsInDb.forEach((cs: any) => referencedCourseIds.add(cs.courseId));

  const invalidReferencedIds: string[] = [];
  for (const refId of referencedCourseIds) {
    const isValid =
      validCourseIds.has(refId) ||
      mappedOldCourseMap.has(refId) ||
      KNOWN_NON_EQUIVALENT_DROPPED_IDS.has(refId);
    if (!isValid) {
      invalidReferencedIds.push(refId);
    }
  }

  if (invalidReferencedIds.length > 0) {
    throw new Error(
      `[Seed Migration Pre-check Error] Found relations referencing course IDs that are neither curated, mapped, nor dropped: ${invalidReferencedIds.join(', ')}`
    );
  }

  if (oldCourseIds.length === 0) {
    const finalCount = await tx.course.count();
    return {
      remappedCount: 0,
      finalCount,
      remappedEnrollments: 0,
      remappedPathItems: 0,
      droppedEnrollments: 0,
      droppedPathItems: 0
    };
  }

  const STATUS_RANK: Record<string, number> = {
    completed: 3,
    in_progress: 2,
    not_started: 1
  };

  function getEnrollmentPriority(enr: { status?: string; progressPercent?: number }): number {
    const statusScore = (STATUS_RANK[enr?.status || 'not_started'] || 1) * 1000;
    const progressScore = enr?.progressPercent || 0;
    return statusScore + progressScore;
  }

  // --- Load all old relations in batched queries ---
  let oldEnrollments: any[] = [];
  try {
    oldEnrollments = await tx.enrollment.findMany({
      where: { courseId: { in: oldCourseIds } }
    });
  } catch (_) {
    oldEnrollments = [];
  }
  oldEnrollments = oldEnrollments.filter((e: any) => oldCourseIds.includes(e.courseId));
  if (oldEnrollments.length === 0 && oldCourseIds.length > 0) {
    const allEnrs = await tx.enrollment.findMany();
    oldEnrollments = allEnrs.filter((e: any) => oldCourseIds.includes(e.courseId));
  }

  let oldPathItems: any[] = [];
  try {
    oldPathItems = await tx.learningPathItem.findMany({
      where: { courseId: { in: oldCourseIds } },
      orderBy: { stepOrder: 'asc' }
    });
  } catch (_) {
    oldPathItems = [];
  }
  oldPathItems = oldPathItems.filter((i: any) => oldCourseIds.includes(i.courseId));
  if (oldPathItems.length === 0 && oldCourseIds.length > 0) {
    const allItems = await tx.learningPathItem.findMany();
    oldPathItems = allItems.filter((i: any) => oldCourseIds.includes(i.courseId));
  }

  // 1. Process non-equivalent dropped courses
  let droppedEnrollments = 0;
  let droppedPathItems = 0;
  const droppedEnrollmentIds: string[] = [];
  const droppedPathItemIds: string[] = [];

  for (const old of oldCourses) {
    if (KNOWN_NON_EQUIVALENT_DROPPED_IDS.has(old.id)) {
      const enrs = oldEnrollments.filter((e: any) => e.courseId === old.id);
      const items = oldPathItems.filter((p: any) => p.courseId === old.id);
      console.log(
        `🗑️ Dropped non-equivalent relations for "${old.id}" ("${old.title}"): ${enrs.length} enrollments, ${items.length} path items.`
      );
      enrs.forEach((e: any) => droppedEnrollmentIds.push(e.id));
      items.forEach((p: any) => droppedPathItemIds.push(p.id));
      droppedEnrollments += enrs.length;
      droppedPathItems += items.length;
    }
  }

  // 2. Process mapped enrollments
  let remappedEnrollments = 0;
  const duplicateEnrollmentIdsToDelete: string[] = [];
  const enrollmentsToRemap: { id: string; targetId: string }[] = [];
  const promotedTargetUpdates: { id: string; data: any }[] = [];

  const mappedOldEnrollments = oldEnrollments.filter(
    (e: any) => !KNOWN_NON_EQUIVALENT_DROPPED_IDS.has(e.courseId)
  );

  const targetCourseIds = Array.from(new Set(Array.from(mappedOldCourseMap.values())));
  const userIds = Array.from(new Set(mappedOldEnrollments.map((e: any) => e.userId)));

  let existingTargetEnrollments: any[] = [];
  if (targetCourseIds.length > 0 && userIds.length > 0) {
    try {
      existingTargetEnrollments = await tx.enrollment.findMany({
        where: {
          userId: { in: userIds },
          courseId: { in: targetCourseIds }
        }
      });
    } catch (_) {
      existingTargetEnrollments = [];
    }
    if (existingTargetEnrollments.length === 0) {
      const allEnrs = await tx.enrollment.findMany();
      existingTargetEnrollments = allEnrs.filter(
        (e: any) => userIds.includes(e.userId) && targetCourseIds.includes(e.courseId)
      );
    }
  }

  const existingTargetEnrMap = new Map<string, any>();
  for (const e of existingTargetEnrollments) {
    existingTargetEnrMap.set(`${e.userId}:::${e.courseId}`, e);
  }

  for (const enr of mappedOldEnrollments) {
    const targetId = mappedOldCourseMap.get(enr.courseId)!;
    const key = `${enr.userId}:::${targetId}`;
    const existingTargetEnr = existingTargetEnrMap.get(key);

    if (existingTargetEnr) {
      const oldPriority = getEnrollmentPriority(enr);
      const existingPriority = getEnrollmentPriority(existingTargetEnr);

      if (oldPriority > existingPriority) {
        promotedTargetUpdates.push({
          id: existingTargetEnr.id,
          data: {
            status: enr.status,
            progressPercent: Math.max(existingTargetEnr.progressPercent || 0, enr.progressPercent || 0),
            completedAt: enr.completedAt ?? existingTargetEnr.completedAt
          }
        });
        existingTargetEnr.status = enr.status;
        existingTargetEnr.progressPercent = Math.max(existingTargetEnr.progressPercent || 0, enr.progressPercent || 0);
      }
      duplicateEnrollmentIdsToDelete.push(enr.id);
    } else {
      existingTargetEnrMap.set(key, enr);
      enrollmentsToRemap.push({ id: enr.id, targetId });
      remappedEnrollments++;
    }
  }

  // Execute enrollment deletions
  const allEnrollmentIdsToDelete = [...droppedEnrollmentIds, ...duplicateEnrollmentIdsToDelete];
  if (allEnrollmentIdsToDelete.length > 0) {
    if (tx.enrollment.deleteMany) {
      await tx.enrollment.deleteMany({ where: { id: { in: allEnrollmentIdsToDelete } } });
    } else {
      for (const id of allEnrollmentIdsToDelete) {
        await tx.enrollment.delete!({ where: { id } });
      }
    }
  }

  // Execute promoted target updates
  for (const promo of promotedTargetUpdates) {
    await tx.enrollment.update!({ where: { id: promo.id }, data: promo.data });
  }

  // Execute enrollment remapping (batched by targetId)
  const remapEnrByTarget = new Map<string, string[]>();
  for (const item of enrollmentsToRemap) {
    const list = remapEnrByTarget.get(item.targetId) || [];
    list.push(item.id);
    remapEnrByTarget.set(item.targetId, list);
  }
  for (const [targetId, ids] of remapEnrByTarget.entries()) {
    if (tx.enrollment.updateMany) {
      await tx.enrollment.updateMany({
        where: { id: { in: ids } },
        data: { courseId: targetId }
      });
    } else {
      for (const id of ids) {
        await tx.enrollment.update!({ where: { id }, data: { courseId: targetId } });
      }
    }
  }

  // 3. Process mapped learning path items
  let remappedPathItems = 0;
  const duplicatePathItemIdsToDelete: string[] = [];
  const pathItemsToRemap: { id: string; targetId: string }[] = [];

  const mappedOldPathItems = oldPathItems.filter(
    (p: any) => !KNOWN_NON_EQUIVALENT_DROPPED_IDS.has(p.courseId)
  );

  const affectedLpIds = Array.from(new Set(mappedOldPathItems.map((p: any) => p.learningPathId)));

  let existingCuratedLpItems: any[] = [];
  if (affectedLpIds.length > 0) {
    try {
      existingCuratedLpItems = await tx.learningPathItem.findMany({
        where: {
          learningPathId: { in: affectedLpIds },
          courseId: { in: Array.from(validCourseIds) }
        }
      });
    } catch (_) {
      existingCuratedLpItems = [];
    }
    if (existingCuratedLpItems.length === 0) {
      const allItems = await tx.learningPathItem.findMany();
      existingCuratedLpItems = allItems.filter(
        (i: any) => affectedLpIds.includes(i.learningPathId) && validCourseIds.has(i.courseId)
      );
    }
  }

  const existingCoursesPerLp = new Set<string>();
  for (const item of existingCuratedLpItems) {
    existingCoursesPerLp.add(`${item.learningPathId}:::${item.courseId}`);
  }

  for (const item of mappedOldPathItems) {
    const targetId = mappedOldCourseMap.get(item.courseId)!;
    const key = `${item.learningPathId}:::${targetId}`;

    if (existingCoursesPerLp.has(key)) {
      duplicatePathItemIdsToDelete.push(item.id);
    } else {
      existingCoursesPerLp.add(key);
      pathItemsToRemap.push({ id: item.id, targetId });
      remappedPathItems++;
    }
  }

  // Execute path item deletions
  const allPathItemIdsToDelete = [...droppedPathItemIds, ...duplicatePathItemIdsToDelete];
  if (allPathItemIdsToDelete.length > 0) {
    if (tx.learningPathItem.deleteMany) {
      await tx.learningPathItem.deleteMany({ where: { id: { in: allPathItemIdsToDelete } } });
    } else {
      for (const id of allPathItemIdsToDelete) {
        await tx.learningPathItem.delete!({ where: { id } });
      }
    }
  }

  // Execute path item remapping (batched by targetId)
  const remapPathByTarget = new Map<string, string[]>();
  for (const item of pathItemsToRemap) {
    const list = remapPathByTarget.get(item.targetId) || [];
    list.push(item.id);
    remapPathByTarget.set(item.targetId, list);
  }
  for (const [targetId, ids] of remapPathByTarget.entries()) {
    if (tx.learningPathItem.updateMany) {
      await tx.learningPathItem.updateMany({
        where: { id: { in: ids } },
        data: { courseId: targetId }
      });
    } else {
      for (const id of ids) {
        await tx.learningPathItem.update!({ where: { id }, data: { courseId: targetId } });
      }
    }
  }

  // 4. Renumber stepOrder to 1..n per LearningPath (keeping existing relative order)
  const allRemainingPathItems = await tx.learningPathItem.findMany();
  const itemsByLp = new Map<string, any[]>();
  for (const item of allRemainingPathItems) {
    const list = itemsByLp.get(item.learningPathId) || [];
    list.push(item);
    itemsByLp.set(item.learningPathId, list);
  }
  for (const [, items] of itemsByLp.entries()) {
    items.sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0));
    let currentStep = 1;
    for (const item of items) {
      if (item.stepOrder !== currentStep) {
        if (tx.learningPathItem.update) {
          await tx.learningPathItem.update({
            where: { id: item.id },
            data: { stepOrder: currentStep }
          });
        }
        item.stepOrder = currentStep;
      }
      currentStep++;
    }
  }

  // 5. Delete all courseSkills for old courses in one batched call
  await tx.courseSkill.deleteMany({
    where: { courseId: { in: oldCourseIds } }
  });

  // 6. Delete all old course rows in one batched call
  if (tx.course.deleteMany) {
    await tx.course.deleteMany({
      where: { id: { in: oldCourseIds } }
    });
  } else {
    for (const id of oldCourseIds) {
      await tx.course.delete!({ where: { id } });
    }
  }

  const remappedCount = oldCourseIds.length;

  // Strictly assert final course count inside the transaction
  const finalCount = await tx.course.count();
  if (finalCount !== curatedCourses.length) {
    throw new Error(
      `Course count mismatch after seeding: expected ${curatedCourses.length}, found ${finalCount}`
    );
  }

  return {
    remappedCount,
    finalCount,
    remappedEnrollments,
    remappedPathItems,
    droppedEnrollments,
    droppedPathItems
  };
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
