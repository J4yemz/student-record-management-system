import { Router } from 'express';
import { gradeController } from './grade.controller.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';

const router = Router();

// Read operations: authenticated users
router.get('/', authenticate, gradeController.getAll);
router.get('/:id', authenticate, gradeController.getById);

// Grading updates: allowed for Admin and Faculty instructors only
router.put('/:id', authenticate, authorize('admin', 'faculty'), gradeController.update);

export const gradeRoutes = router;
