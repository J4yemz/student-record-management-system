import { Request, Response, NextFunction } from 'express';
import { enrollmentService } from './enrollment.service.js';

export class EnrollmentController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await enrollmentService.getAllEnrollments({
        studentId: req.query.studentId as string,
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
      const enrollment = await enrollmentService.getEnrollmentById(id);
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
