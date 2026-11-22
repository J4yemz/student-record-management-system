import { Request, Response, NextFunction } from 'express';
import { enrollmentService } from './enrollment.service.js';
import { resolveStudentIdForUser } from '../../shared/utils/student-lookup.js';
import { AppError } from '../../shared/middleware/error.middleware.js';

export class EnrollmentController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      let targetStudentId = req.query.studentId as string;

      // Access Control: Students can ONLY query their own enrollments
      if (user?.role === 'student') {
        const studentId = await resolveStudentIdForUser(user);
        if (!studentId) {
          res.json({ success: true, data: [] });
          return;
        }
        targetStudentId = studentId;
      }

      const list = await enrollmentService.getAllEnrollments({
        studentId: targetStudentId,
        courseId: req.query.courseId as string,
        semester: req.query.semester as string,
        academicYear: req.query.academicYear as string,
        status: req.query.status as string
      });
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = req.user;
      const enrollment = await enrollmentService.getEnrollmentById(id);

      // Access Control: A student cannot view someone else's enrollment
      if (user?.role === 'student') {
        const studentId = await resolveStudentIdForUser(user);
        if (!enrollment || (studentId && enrollment.studentId !== studentId)) {
          throw new AppError('Forbidden. Students are strictly restricted to their own enrollments.', 403);
        }
      }

      res.json({ success: true, data: enrollment });
    } catch (err) {
      next(err);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await enrollmentService.createEnrollment(req.body);
      res.status(201).json({
        success: true,
        message: 'Student enrolled successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await enrollmentService.updateEnrollment(id, req.body);
      res.json({
        success: true,
        message: 'Enrollment updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await enrollmentService.deleteEnrollment(id);
      res.json({
        success: true,
        message: 'Enrollment deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  };
}

export const enrollmentController = new EnrollmentController();
