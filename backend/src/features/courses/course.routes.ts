import { Router } from 'express';
import { courseController } from './course.controller.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Read operations:
router.get('/', authenticate, courseController.getAll);
router.get('/:id', authenticate, courseController.getById);
// Class roster: restricted to Admin and Faculty only (students cannot see other students in the class)
router.get('/:id/roster', authenticate, authorize('admin', 'faculty'), courseController.getRoster);

// Write operations: strictly Admin only
router.post('/', authenticate, authorize('admin'), courseController.create);
router.put('/:id', authenticate, authorize('admin'), courseController.update);
router.delete('/:id', authenticate, authorize('admin'), courseController.delete);

export const courseRoutes = router;
