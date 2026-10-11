import { Router } from 'express';
import {
  getLearnerLearningPath,
  regenerateLearningPath,
  updateCourseProgress
} from '../../controllers/learningPathController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getLearnerLearningPath);
router.post('/regenerate', regenerateLearningPath);
router.post('/progress', updateCourseProgress);

export default router;
