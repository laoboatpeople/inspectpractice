import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from './auth';

type AllowedRole = JwtPayload['role'];

export function requireRoles(...allowed: AllowedRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
