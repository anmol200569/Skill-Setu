import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './profile';
import competencyRoutes from './competency';
import assessmentRoutes from './assessment';
import gapAnalysisRoutes from './gapAnalysis';
import courseRoutes from './course';
import learningPathRoutes from './learningPath';
import quizRoutes from './quiz';
import assistantRoutes from './assistant';
import analyticsRoutes from './analytics';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/competency', competencyRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/gap-analysis', gapAnalysisRoutes);
router.use('/courses', courseRoutes);
router.use('/learning-paths', learningPathRoutes);
router.use('/quizzes', quizRoutes);
router.use('/assistant', assistantRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
