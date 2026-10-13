import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../lib/supabase';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { UserRole } from '@skill-setu/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Short-lived in-memory auth cache to avoid hitting Supabase + Prisma on every request
const authCache = new Map<string, { user: AuthenticatedUser; expiresAt: number }>();
const AUTH_CACHE_TTL_MS = 60_000; // 60 seconds

function getCachedUser(token: string): AuthenticatedUser | null {
  const entry = authCache.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    authCache.delete(token);
    return null;
  }
  return entry.user;
}

function setCachedUser(token: string, user: AuthenticatedUser): void {
  // Cap cache size to prevent memory leaks in long-running processes
  if (authCache.size > 500) {
    const now = Date.now();
    for (const [key, val] of authCache) {
      if (now > val.expiresAt) authCache.delete(key);
    }
    // If still too large, clear oldest half
    if (authCache.size > 400) {
      const keys = Array.from(authCache.keys());
      for (let i = 0; i < keys.length / 2; i++) {
        authCache.delete(keys[i]);
      }
    }
  }
  authCache.set(token, { user, expiresAt: Date.now() + AUTH_CACHE_TTL_MS });
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header with Bearer token'
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Automated test mock tokens (active ONLY when NODE_ENV === 'test', never in production)
  if (process.env.NODE_ENV === 'test' && config.env !== 'production') {
    if (token === 'test-admin-token') {
      req.user = { id: 'test-admin-uuid', email: 'admin@skillsetu.dev', role: 'admin' };
      next();
      return;
    }
    if (token === 'test-trainer-token') {
      req.user = { id: 'test-trainer-uuid', email: 'trainer@skillsetu.dev', role: 'trainer' };
      next();
      return;
    }
    if (token === 'test-learner-token') {
      req.user = { id: 'test-learner-uuid', email: 'learner@skillsetu.dev', role: 'learner' };
      next();
      return;
    }
    if (token === 'test-populated-token') {
      req.user = { id: 'eb99b4ac-fa46-4776-852b-ebc87fea2f49', email: 'anmolsingh12jbp7@gmail.com', role: 'learner' };
      next();
      return;
    }
    if (token === 'test-empty-token') {
      req.user = { id: 'test-empty-uuid', email: 'newbie@skillsetu.dev', role: 'learner' };
      next();
      return;
    }
    if (token === 'test-partial-token') {
      req.user = { id: 'test-partial-uuid', email: 'partial@skillsetu.dev', role: 'learner' };
      next();
      return;
    }
  }

  // Check in-memory cache first — avoids Supabase + Prisma network calls
  const cached = getCachedUser(token);
  if (cached) {
    req.user = cached;
    next();
    return;
  }

  try {
    // Verify user JWT with Supabase Auth SDK using anon client
    const { data: { user: supabaseUser }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !supabaseUser) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired authentication session'
      });
      return;
    }

    const email = supabaseUser.email || '';
    const isEmailConfirmed = Boolean(supabaseUser.email_confirmed_at);
    const isInitialAdmin = isEmailConfirmed && email.toLowerCase() === config.initialAdminEmail.toLowerCase();

    // Find or create local user record
    let dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id }
    });

    if (!dbUser) {
      // Sync from Supabase Auth
      const assignedRole: UserRole = isInitialAdmin
        ? 'admin'
        : (supabaseUser.user_metadata?.role === 'trainer' ? 'trainer' : 'learner');

      dbUser = await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: email,
          role: assignedRole as any
        }
      });
    } else if (isInitialAdmin && dbUser.role !== 'admin') {
      // Upgrade initial admin only if email is confirmed and matches initialAdminEmail
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { role: 'admin' }
      });
    }

    const authenticatedUser: AuthenticatedUser = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as UserRole
    };

    // Cache to speed up subsequent requests within the same session
    setCachedUser(token, authenticatedUser);

    req.user = authenticatedUser;

    next();
  } catch (err: any) {
    console.error('Authentication middleware error:', err.message);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication verification failed'
    });
  }
}

