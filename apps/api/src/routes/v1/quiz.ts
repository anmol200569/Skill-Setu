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
  deleteQuiz,
  publishQuiz,
  getQuizHistory,
  getQuizResultById
} from '../../controllers/quizController';
import { authenticate } from '../../middleware/auth';
import { aiRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Multer memory storage with 4MB limit (below Vercel serverless request body limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }
});

router.use(authenticate);

// Document upload & text extraction with Multer error handling
router.post(
  '/upload',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'UploadError',
            message: 'File size exceeds the 4 MB upload limit. Please upload a smaller document.'
          });
        }
        return res.status(400).json({
          error: 'UploadError',
          message: err.message || 'File upload failed'
        });
      }
      next();
    });
  },
  uploadStudyMaterial
);

// Generate quiz via Gemini backend
router.post('/generate', aiRateLimiter, generateQuiz);

// Quiz listing & attempt
router.get('/', listQuizzes);
router.get('/:id', getQuizById);
router.post('/submit', submitQuiz);
router.get('/:id/export-pdf', exportQuizPdfEndpoint);

// Quiz ownership actions (owner only: update, publish, delete, history, results)
router.put('/:id', updateQuiz);
router.patch('/:id/publish', publishQuiz);
router.delete('/:id', deleteQuiz);
router.get('/:id/history', getQuizHistory);
router.get('/:id/attempts', getQuizHistory);
router.get('/:id/results/:attemptId', getQuizResultById);

export default router;
