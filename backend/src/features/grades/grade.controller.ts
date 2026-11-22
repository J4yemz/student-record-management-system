import { Request, Response, NextFunction } from 'express';
import { gradeService } from './grade.service.js';

export class GradeController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await gradeService.getAllGrades({
        studentId: req.query.studentId as string,
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
      const grade = await gradeService.getGradeById(id);
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
