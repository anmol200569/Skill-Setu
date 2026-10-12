import express, { Application, Request, Response, NextFunction } from 'express';
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
  const isProduction = config.env === 'production' || process.env.NODE_ENV === 'production';
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? (process.env.VERCEL_PROJECT_PRODUCTION_URL.startsWith('http')
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : 'https://skill-setu.vercel.app';

  const productionOrigins = Array.from(
    new Set([config.corsOrigin, vercelProdUrl].filter(Boolean))
  );

  const corsMiddleware = cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isProduction) {
        if (productionOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked: Origin ${origin} is not allowed in production`));
        }
      } else {
        // Development/test: allow all origins
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    corsMiddleware(req, res, (err) => {
      if (err) {
        res.status(403).json({ error: 'Forbidden origin' });
        return;
      }
      next();
    });
  });

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
          me: 'GET /api/v1/auth/me'
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
