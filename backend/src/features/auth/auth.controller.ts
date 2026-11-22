import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';

export class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json({
        success: true,
        message: 'Authentication successful',
        data: result
      });
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({
        success: true,
        data: req.user
      });
    } catch (err) {
      next(err);
    }
  };

  public getDemoAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accounts = await authService.getDemoAccounts();
      res.json({ success: true, data: accounts });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
