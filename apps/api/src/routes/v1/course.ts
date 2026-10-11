import { Router } from 'express';
import {
  listCourses,
  getCourseById,
  getRecommendedCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '../../controllers/courseController';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/rbac';

const router = Router();

// Public / Learner routes
router.get('/', listCourses);
router.get('/recommendations', authenticate, getRecommendedCourses);
router.get('/:id', getCourseById);

// Admin routes
router.post('/', authenticate, requireAdmin, createCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

export default router;
