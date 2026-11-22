import { Router } from 'express';
import { enrollmentController } from './enrollment.controller.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Read operations: authenticated users
router.get('/', authenticate, enrollmentController.getAll);
router.get('/:id', authenticate, enrollmentController.getById);

// Write operations: strictly Admin only
router.post('/', authenticate, authorize('admin'), enrollmentController.create);
router.put('/:id', authenticate, authorize('admin'), enrollmentController.update);
router.delete('/:id', authenticate, authorize('admin'), enrollmentController.delete);

export const enrollmentRoutes = router;
