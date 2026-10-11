import { Router } from 'express';
import {
  getSkillAssessmentQuestions,
  submitAssessment,
  getAssessmentHistory
} from '../../controllers/assessmentController';
import { authenticate } from '../../middleware/auth';
import { validateBody } from '../../middleware/validation';
import { submitAssessmentSchema } from '@skill-setu/shared';

const router = Router();

router.use(authenticate);

router.get('/questions/:skillId', getSkillAssessmentQuestions);
router.post('/submit', validateBody(submitAssessmentSchema), submitAssessment);
router.get('/history', getAssessmentHistory);

export default router;
