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
