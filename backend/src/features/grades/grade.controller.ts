import { Request, Response, NextFunction } from 'express';
import { gradeService } from './grade.service.js';
import { resolveStudentIdForUser } from '../../shared/utils/student-lookup.js';
import { AppError } from '../../shared/middleware/error.middleware.js';

export class GradeController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      let targetStudentId = req.query.studentId as string;

      // Access Control: Students can ONLY query their own grades
      if (user?.role === 'student') {
        const studentId = await resolveStudentIdForUser(user);
        if (!studentId) {
          res.json({ success: true, data: [] });
          return;
        }
        targetStudentId = studentId;
      }

      const list = await gradeService.getAllGrades({
        studentId: targetStudentId,
        courseId: req.query.courseId as string,
        remarks: req.query.remarks as string,
        letterGrade: req.query.letterGrade as string
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
      const grade = await gradeService.getGradeById(id);

      // Access Control: A student cannot view someone else's grade
      if (user?.role === 'student') {
        const studentId = await resolveStudentIdForUser(user);
        if (!grade || (studentId && grade.studentId !== studentId)) {
          throw new AppError('Forbidden. Students are strictly restricted to their own grades.', 403);
        }
      }

      res.json({ success: true, data: grade });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await gradeService.updateGrade(id, req.body);
      res.json({
        success: true,
        message: 'Grade recorded and student GPA updated',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };
}

export const gradeController = new GradeController();
