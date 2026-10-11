import { Router } from 'express';
import { getProfile, submitOnboarding, updateProfile } from '../../controllers/profileController';
import { authenticate } from '../../middleware/auth';
import { validateBody } from '../../middleware/validation';
import { onboardingSchema, profileUpdateSchema } from '@skill-setu/shared';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.post('/onboarding', validateBody(onboardingSchema), submitOnboarding);
router.put('/', validateBody(profileUpdateSchema), updateProfile);

export default router;
