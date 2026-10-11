import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { analyzeLearnerSkillGaps } from '../services/gapAnalysisEngine';
import { getPersonalizedRecommendations } from '../services/recommendationEngine';

export async function listCourses(req: Request, res: Response): Promise<void> {
  const {
    search,
    difficulty,
    language,
    isFree,
    provider,
    page = '1',
    limit = '20'
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const whereClause: any = {};

  if (search) {
    const s = String(search);
    whereClause.OR = [
      { title: { contains: s, mode: 'insensitive' } },
      { description: { contains: s, mode: 'insensitive' } },
      { provider: { contains: s, mode: 'insensitive' } }
    ];
  }

  if (difficulty) {
    whereClause.difficulty = String(difficulty);
  }

  if (language) {
    whereClause.language = String(language);
  }

  if (isFree !== undefined) {
    whereClause.isFree = isFree === 'true';
  }

  if (provider) {
    whereClause.provider = String(provider);
  }

  const [total, courses] = await Promise.all([
    prisma.course.count({ where: whereClause }),
    prisma.course.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: { rating: 'desc' }
    })
  ]);

  res.json({
    data: courses,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
}

export async function getCourseById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      courseSkills: {
        include: { skill: true }
      }
    }
  });

  if (!course) {
    res.status(404).json({ error: 'NotFound', message: 'Course not found' });
    return;
  }

  res.json(course);
}

export async function getRecommendedCourses(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const limit = parseInt((req.query.limit as string) || '6', 10);

  try {
    const gapResult = await analyzeLearnerSkillGaps(userId);
    const recommendations = await getPersonalizedRecommendations(userId, gapResult.gaps, limit);
    res.json({
      targetRoleTitle: gapResult.targetRoleTitle,
      readinessScore: gapResult.overallReadinessScore,
      recommendations
    });
  } catch (err: any) {
    res.status(500).json({ error: 'RecommendationError', message: err.message });
  }
}

// ---------------- Admin Course Management ----------------

export async function createCourse(req: Request, res: Response): Promise<void> {
  const {
    title,
    provider,
    destinationUrl,
    skillsCovered,
    difficulty,
    estimatedHours,
    language,
    isFree,
    rating,
    ratingSource,
    description
  } = req.body;

  const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 36);

  const course = await prisma.course.create({
    data: {
      id,
      title,
      provider,
      destinationUrl,
      skillsCovered: skillsCovered || [],
      difficulty: difficulty || 'Beginner',
      estimatedHours: estimatedHours || 10,
      language: language || 'English',
      isFree: isFree !== undefined ? isFree : true,
      rating: rating || null,
      ratingSource: ratingSource || null,
      description: description || ''
    }
  });

  res.status(201).json(course);
}

export async function updateCourse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = req.body;

  const course = await prisma.course.update({
    where: { id },
    data
  });

  res.json(course);
}

export async function deleteCourse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await prisma.course.delete({ where: { id } });
  res.json({ message: 'Course deleted successfully' });
}
