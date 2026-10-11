import { PrismaClient } from '@prisma/client';
import { domainsData, rolesData, curatedCoursesData, diagnosticQuestionsData } from './seedData';

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
    const course = await prisma.course.upsert({
      where: { id: courseData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36) },
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
        id: courseData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36),
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

  // 4. Seed Diagnostic Assessment Questions
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
      }
    }
  }
  console.log(`✅ Seeded diagnostic assessment questions.`);

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
