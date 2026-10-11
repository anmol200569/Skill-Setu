import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { config } from '../config';

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      profile: {
        include: { targetRole: true }
      }
    }
  });

  if (!user) {
    res.status(404).json({ error: 'NotFound', message: 'User record not found' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    profile: user.profile
  });
}

/**
 * Bootstraps the first administrator securely.
 * Allowed only if no admin currently exists or if requested by configured bootstrap email.
 */
export async function bootstrapAdmin(req: Request, res: Response): Promise<void> {
  const { secretKey } = req.body;
  const targetEmail = req.user?.email || req.body.email;

  if (!targetEmail) {
    res.status(400).json({ error: 'BadRequest', message: 'User email is required' });
    return;
  }

  const existingAdminCount = await prisma.user.count({
    where: { role: 'admin' }
  });

  // If admins already exist, only matching config.initialAdminEmail or valid service key can promote
  const isInitialConfigEmail = targetEmail.toLowerCase() === config.initialAdminEmail.toLowerCase();
  const isValidServiceKey = secretKey && secretKey === config.supabase.serviceRoleKey;

  if (existingAdminCount > 0 && !isInitialConfigEmail && !isValidServiceKey) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Platform already has registered administrators. Contact an existing administrator for role promotion.'
    });
    return;
  }

  const user = await prisma.user.upsert({
    where: { email: targetEmail },
    update: { role: 'admin' },
    create: {
      id: req.user?.id || 'admin-' + Date.now(),
      email: targetEmail,
      role: 'admin'
    }
  });

  res.json({
    message: `Administrator privileges granted to ${targetEmail}`,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
}
