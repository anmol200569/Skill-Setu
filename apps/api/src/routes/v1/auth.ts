import { Router } from 'express';
import { getCurrentUser } from '../../controllers/authController';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Current user profile & role
router.get('/me', authenticate, getCurrentUser);

export default router;
