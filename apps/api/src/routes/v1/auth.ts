import { Router } from 'express';
import { getCurrentUser, bootstrapAdmin } from '../../controllers/authController';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Current user profile & role
router.get('/me', authenticate, getCurrentUser);

// Secure administrator bootstrap
router.post('/bootstrap-admin', bootstrapAdmin);

export default router;
