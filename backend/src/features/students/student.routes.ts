import { Router } from 'express';
import { studentController } from './student.controller.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Read operations: authenticated users
router.get('/', authenticate, studentController.getAll);
router.get('/:id', authenticate, studentController.getById);
router.get('/:id/details', authenticate, studentController.getDetails);

// Write operations: strictly Admin only
router.post('/', authenticate, authorize('admin'), studentController.create);
router.put('/:id', authenticate, authorize('admin'), studentController.update);
router.delete('/:id', authenticate, authorize('admin'), studentController.delete);

export const studentRoutes = router;
