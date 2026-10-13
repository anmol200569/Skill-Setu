import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createDomainSchema, createSkillSchema, createRoleSchema } from '@skill-setu/shared';

export async function getDomains(_req: Request, res: Response): Promise<void> {
  const domains = await prisma.domain.findMany({
    include: {
      skills: true
    },
    orderBy: { name: 'asc' }
  });

  res.json(domains);
}

export async function getCompetencyStats(_req: Request, res: Response): Promise<void> {
  try {
    const domains = await prisma.domain.findMany({
      include: {
        skills: {
          include: {
            _count: {
              select: {
                assessmentQuestions: {
                  where: {
                    NOT: {
                      questionText: {
                        startsWith: '[INACTIVE]'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    let totalSkills = 0;
    let totalQuestions = 0;

    const domainStats = domains.map((domain) => {
      const skillsCount = domain.skills.length;
      const questionsCount = domain.skills.reduce(
        (sum, s) => sum + s._count.assessmentQuestions,
        0
      );
      totalSkills += skillsCount;
      totalQuestions += questionsCount;

      return {
        id: domain.id,
        code: domain.code,
        name: domain.name,
        description: domain.description,
        icon: domain.icon,
        skillsCount,
        questionsCount
      };
    });

    res.json({
      totalDomains: domains.length,
      totalSkills,
      totalQuestions,
      domains: domainStats
    });
  } catch (error: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to compute competency stats' });
  }
}

export async function getSkills(_req: Request, res: Response): Promise<void> {
  const skills = await prisma.skill.findMany({
    include: {
      domain: true
    },
    orderBy: { name: 'asc' }
  });

  res.json(skills);
}

export async function getRoles(_req: Request, res: Response): Promise<void> {
  const roles = await prisma.role.findMany({
    include: {
      skillsRequired: {
        include: {
          skill: {
            include: { domain: true }
          }
        }
      }
    },
    orderBy: { title: 'asc' }
  });

  res.json(roles);
}

export async function getRoleById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      skillsRequired: {
        include: {
          skill: {
            include: { domain: true }
          }
        }
      }
    }
  });

  if (!role) {
    res.status(404).json({ error: 'NotFound', message: 'Career role not found' });
    return;
  }

  res.json(role);
}

// ---------------- Admin Management Handlers ----------------

export async function createDomain(req: Request, res: Response): Promise<void> {
  const validated = createDomainSchema.parse(req.body);

  const domain = await prisma.domain.create({
    data: {
      code: validated.code,
      name: validated.name,
      description: validated.description,
      icon: validated.icon
    }
  });

  res.status(201).json(domain);
}

export async function updateDomain(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const validated = createDomainSchema.partial().parse(req.body);

  const domain = await prisma.domain.update({
    where: { id },
    data: validated
  });

  res.json(domain);
}

export async function deleteDomain(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await prisma.domain.delete({ where: { id } });
  res.json({ message: 'Domain deleted successfully' });
}

export async function createSkill(req: Request, res: Response): Promise<void> {
  const validated = createSkillSchema.parse(req.body);

  const skill = await prisma.skill.create({
    data: {
      domainId: validated.domainId,
      code: validated.code,
      name: validated.name,
      description: validated.description,
      category: validated.category
    }
  });

  res.status(201).json(skill);
}

export async function updateSkill(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const validated = createSkillSchema.partial().parse(req.body);

  const skill = await prisma.skill.update({
    where: { id },
    data: validated
  });

  res.json(skill);
}

export async function deleteSkill(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await prisma.skill.delete({ where: { id } });
  res.json({ message: 'Skill deleted successfully' });
}

export async function createRole(req: Request, res: Response): Promise<void> {
  const validated = createRoleSchema.parse(req.body);

  const role = await prisma.role.create({
    data: {
      code: validated.code,
      title: validated.title,
      description: validated.description,
      industryDemand: validated.industryDemand,
      skillsRequired: {
        create: validated.skills.map((s) => ({
          skillId: s.skillId,
          requiredProficiency: s.requiredProficiency,
          priority: s.priority as any,
          weight: s.weight
        }))
      }
    },
    include: {
      skillsRequired: { include: { skill: true } }
    }
  });

  res.status(201).json(role);
}

export async function updateRole(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { code, title, description, industryDemand, skills } = req.body;

  const role = await prisma.role.update({
    where: { id },
    data: {
      ...(code ? { code } : {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(industryDemand ? { industryDemand } : {})
    }
  });

  if (skills && Array.isArray(skills)) {
    await prisma.roleSkillRequirement.deleteMany({ where: { roleId: id } });
    for (const s of skills) {
      await prisma.roleSkillRequirement.create({
        data: {
          roleId: id,
          skillId: s.skillId,
          requiredProficiency: s.requiredProficiency,
          priority: s.priority as any,
          weight: s.weight || 1.0
        }
      });
    }
  }

  res.json({ message: 'Role updated successfully', role });
}

export async function deleteRole(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await prisma.role.delete({ where: { id } });
  res.json({ message: 'Role deleted successfully' });
}
