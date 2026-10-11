import { Router } from 'express';
import multer from 'multer';
import {
  uploadStudyMaterial,
  generateQuiz,
  listQuizzes,
  getQuizById,
  submitQuiz,
  exportQuizPdfEndpoint,
  updateQuiz,
  deleteQuiz
} from '../../controllers/quizController';
import { authenticate } from '../../middleware/auth';
import { requireTrainerOrAdmin } from '../../middleware/rbac';
import { aiRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Multer memory storage with 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(authenticate);

// Document upload & text extraction
router.post('/upload', upload.single('file'), uploadStudyMaterial);

// Generate quiz via Gemini backend
router.post('/generate', aiRateLimiter, generateQuiz);

// Quiz listing & attempt
router.get('/', listQuizzes);
router.get('/:id', getQuizById);
router.post('/submit', submitQuiz);
router.get('/:id/export-pdf', exportQuizPdfEndpoint);

// Trainer / Admin management
router.put('/:id', requireTrainerOrAdmin, updateQuiz);
router.delete('/:id', requireTrainerOrAdmin, deleteQuiz);

export default router;
