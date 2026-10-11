import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { onboardingSchema, profileUpdateSchema } from '@skill-setu/shared';

export async function getProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      targetRole: {
        include: {
          skillsRequired: {
            include: { skill: true }
          }
        }
      }
    }
  });

  const userSkills = await prisma.userSkill.findMany({
    where: { userId },
    include: { skill: true }
  });

  res.json({
    profile,
    userSkills: userSkills.map((s) => ({
      id: s.id,
      userId: s.userId,
      skillId: s.skillId,
      skillName: s.skill.name,
      selfAssessedLevel: s.selfAssessedLevel,
      verifiedScore: s.verifiedScore,
      effectiveScore: s.effectiveScore,
      confidenceLevel: s.confidenceLevel,
      lastAssessedAt: s.lastAssessedAt
    }))
  });
}

export async function submitOnboarding(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const validated = onboardingSchema.parse(req.body);

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {
      fullName: validated.fullName,
      education: validated.education,
      experienceYears: validated.experienceYears,
      currentStatus: validated.currentStatus as any,
      currentRole: validated.currentRole,
      targetRoleId: validated.targetRoleId,
      careerGoals: validated.careerGoals,
      preferredLanguage: validated.preferredLanguage,
      weeklyStudyHours: validated.weeklyStudyHours,
      learningPreferences: validated.learningPreferences,
      isOnboarded: true
    },
    create: {
      userId,
      fullName: validated.fullName,
      education: validated.education,
      experienceYears: validated.experienceYears,
      currentStatus: validated.currentStatus as any,
      currentRole: validated.currentRole,
      targetRoleId: validated.targetRoleId,
      careerGoals: validated.careerGoals,
      preferredLanguage: validated.preferredLanguage,
      weeklyStudyHours: validated.weeklyStudyHours,
      learningPreferences: validated.learningPreferences,
      isOnboarded: true
    }
  });

  // Save initial self-assessed skills
  if (validated.initialSkills && validated.initialSkills.length > 0) {
    for (const item of validated.initialSkills) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId: item.skillId
          }
        },
        update: {
          selfAssessedLevel: item.selfAssessedLevel,
          effectiveScore: item.selfAssessedLevel
        },
        create: {
          userId,
          skillId: item.skillId,
          selfAssessedLevel: item.selfAssessedLevel,
          effectiveScore: item.selfAssessedLevel
        }
      });
    }
  }

  res.status(200).json({
    message: 'Onboarding completed successfully',
    profile
  });
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const validated = profileUpdateSchema.parse(req.body);

  const profile = await prisma.profile.update({
    where: { userId },
    data: {
      ...(validated.fullName ? { fullName: validated.fullName } : {}),
      ...(validated.education ? { education: validated.education } : {}),
      ...(validated.experienceYears !== undefined ? { experienceYears: validated.experienceYears } : {}),
      ...(validated.currentStatus ? { currentStatus: validated.currentStatus as any } : {}),
      ...(validated.currentRole !== undefined ? { currentRole: validated.currentRole } : {}),
      ...(validated.targetRoleId ? { targetRoleId: validated.targetRoleId } : {}),
      ...(validated.careerGoals !== undefined ? { careerGoals: validated.careerGoals } : {}),
      ...(validated.preferredLanguage ? { preferredLanguage: validated.preferredLanguage } : {}),
      ...(validated.weeklyStudyHours !== undefined ? { weeklyStudyHours: validated.weeklyStudyHours } : {}),
      ...(validated.learningPreferences ? { learningPreferences: validated.learningPreferences } : {})
    }
  });

  res.json({
    message: 'Profile updated successfully',
    profile
  });
}
