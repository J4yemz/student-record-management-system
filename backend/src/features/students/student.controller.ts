import { Request, Response, NextFunction } from 'express';
import { studentService } from './student.service.js';
import { StudentFilterQuery } from './student.types.js';

export class StudentController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: StudentFilterQuery = {
        search: req.query.search as string,
        department: req.query.department as string,
        yearLevel: req.query.yearLevel as string,
        status: req.query.status as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50
      };

      const result = await studentService.getAllStudents(filters);
      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: filters.page || 1,
          limit: filters.limit || 50,
          totalPages: Math.ceil(result.total / (filters.limit || 50))
        }
      });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const student = await studentService.getStudentById(id);
      res.json({ success: true, data: student });
    } catch (err) {
      next(err);
    }
  };

  public getDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const details = await studentService.getStudentDetails(id);
      res.json({ success: true, data: details });
    } catch (err) {
      next(err);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await studentService.updateStudent(id, req.body);
      res.json({
        success: true,
        message: 'Student updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await studentService.deleteStudent(id);
      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  };
}

export const studentController = new StudentController();
