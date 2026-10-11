import { Router } from 'express';
import { getLearnerDashboardStats, getAdminAnalytics } from '../../controllers/analyticsController';
import { authenticate } from '../../middleware/auth';
import { requireTrainerOrAdmin } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);

// Learner dashboard metrics
router.get('/learner', getLearnerDashboardStats);

// Admin / Trainer organization-level analytics
router.get('/admin', requireTrainerOrAdmin, getAdminAnalytics);

export default router;
