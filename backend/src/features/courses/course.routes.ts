import { Router } from 'express';
import { courseController } from './course.controller.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Read operations: authenticated users (Admin, Faculty, Student)
router.get('/', authenticate, courseController.getAll);
router.get('/:id', authenticate, courseController.getById);
router.get('/:id/roster', authenticate, courseController.getRoster);

// Write operations: strictly Admin only
router.post('/', authenticate, authorize('admin'), courseController.create);
router.put('/:id', authenticate, authorize('admin'), courseController.update);
router.delete('/:id', authenticate, authorize('admin'), courseController.delete);

export const courseRoutes = router;
