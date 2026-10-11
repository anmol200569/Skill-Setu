import { Router } from 'express';
import { getSkillGapAnalysis } from '../../controllers/gapAnalysisController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSkillGapAnalysis);

export default router;
