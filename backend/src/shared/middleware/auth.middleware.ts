import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.js';
import { AuthTokenPayload, UserRole } from '../../features/auth/auth.types.js';
import { AppError } from './error.middleware.js';

// Extend Express Request object with authenticated user information
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * Verifies JWT token from Authorization header (Bearer <token>)
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Missing Bearer token.', 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    throw new AppError('Invalid or expired authentication token. Please log in again.', 401);
  }

  req.user = payload;
  next();
};

/**
 * Restricts access to specific role(s)
 * e.g. authorize('admin'), authorize('admin', 'faculty')
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Forbidden. Access restricted to [${allowedRoles.join(', ')}] roles. Your current role is '${req.user.role}'.`,
        403
      );
    }

    next();
  };
};
