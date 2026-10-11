import { Router } from 'express';
import { sendChatMessage, getChatHistory } from '../../controllers/assistantController';
import { authenticate } from '../../middleware/auth';
import { aiRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.post('/chat', aiRateLimiter, sendChatMessage);
router.get('/history', getChatHistory);

export default router;
