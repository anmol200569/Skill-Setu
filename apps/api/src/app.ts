import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import v1Router from './routes/v1';
import { generalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/error';

export function createApp(): Application {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    config.corsOrigin,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(null, true); // Dev flexible fallback
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Request Logging
  if (config.env !== 'test') {
    app.use(morgan('dev'));
  }

  // Request Body Parsers
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // General Rate Limiting
  app.use(generalRateLimiter);

  // Normalize paths for Vercel Serverless Function rewrites
  app.use((req, _res, next) => {
    const matchedPath = req.headers['x-matched-path'] as string;
    if (matchedPath && (req.url === '/' || req.url === '/api')) {
      req.url = matchedPath;
    }
    next();
  });

  // Health Check
  app.get(['/health', '/api/health', '/api/v1/health'], (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'Skill Setu API',
      timestamp: new Date().toISOString(),
      environment: config.env
    });
  });

  // API Documentation Overview
  app.get('/api/docs', (_req: Request, res: Response) => {
    res.json({
      title: 'Skill Setu API Documentation',
      version: '1.0.0',
      description: 'AI Skill Intelligence & Learning Platform REST API',
      endpoints: {
        health: 'GET /health',
        auth: {
          me: 'GET /api/v1/auth/me',
          bootstrapAdmin: 'POST /api/v1/auth/bootstrap-admin'
        },
        profile: {
          get: 'GET /api/v1/profile',
          onboarding: 'POST /api/v1/profile/onboarding',
          update: 'PUT /api/v1/profile'
        },
        competency: {
          domains: 'GET /api/v1/competency/domains',
          skills: 'GET /api/v1/competency/skills',
          roles: 'GET /api/v1/competency/roles'
        },
        assessments: {
          questions: 'GET /api/v1/assessment/questions/:skillId',
          submit: 'POST /api/v1/assessment/submit',
          history: 'GET /api/v1/assessment/history'
        },
        gapAnalysis: {
          analysis: 'GET /api/v1/gap-analysis?roleId=:roleId'
        },
        courses: {
          list: 'GET /api/v1/courses',
          recommendations: 'GET /api/v1/courses/recommendations',
          details: 'GET /api/v1/courses/:id'
        },
        learningPaths: {
          get: 'GET /api/v1/learning-paths',
          regenerate: 'POST /api/v1/learning-paths/regenerate',
          progress: 'POST /api/v1/learning-paths/progress'
        },
        quizzes: {
          upload: 'POST /api/v1/quizzes/upload',
          generate: 'POST /api/v1/quizzes/generate',
          list: 'GET /api/v1/quizzes',
          get: 'GET /api/v1/quizzes/:id',
          submit: 'POST /api/v1/quizzes/submit',
          exportPdf: 'GET /api/v1/quizzes/:id/export-pdf'
        },
        assistant: {
          chat: 'POST /api/v1/assistant/chat',
          history: 'GET /api/v1/assistant/history'
        },
        analytics: {
          learner: 'GET /api/v1/analytics/learner',
          admin: 'GET /api/v1/analytics/admin'
        }
      }
    });
  });

  // Mount Versioned API Routes
  app.use(config.apiPrefix, v1Router);
  if (config.apiPrefix !== '/v1') {
    app.use('/v1', v1Router);
  }

  // 404 Route Catch-All
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'NotFound',
      message: 'The requested API route was not found on this server'
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
