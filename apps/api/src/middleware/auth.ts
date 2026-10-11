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

  // Automated test mock tokens
  if (config.env === 'test' || process.env.VITEST === 'true') {
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
    const isInitialAdmin = email.toLowerCase() === config.initialAdminEmail.toLowerCase();

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
      // Upgrade initial admin if email matches
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { role: 'admin' }
      });
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as UserRole
    };

    next();
  } catch (err: any) {
    console.error('Authentication middleware error:', err.message);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication verification failed'
    });
  }
}
