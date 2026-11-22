import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.get('/demo-accounts', authController.getDemoAccounts);

export const authRoutes = router;
