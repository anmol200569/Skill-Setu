import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@skill-setu/shared';

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole(['admin']);
export const requireTrainerOrAdmin = requireRole(['admin', 'trainer']);
