import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.get('/stats', authenticate, dashboardController.getStats);

export const dashboardRoutes = router;
