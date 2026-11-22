import { Request, Response, NextFunction } from 'express';
import { courseService } from './course.service.js';

export class CourseController {
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await courseService.getAllCourses({
        search: req.query.search as string,
        department: req.query.department as string,
        semester: req.query.semester as string
      });
      res.json({ success: true, data: courses });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const course = await courseService.getCourseById(id);
      res.json({ success: true, data: course });
    } catch (err) {
      next(err);
    }
  };

  public getRoster = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const roster = await courseService.getCourseRoster(id);
      res.json({ success: true, data: roster });
    } catch (err) {
      next(err);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await courseService.createCourse(req.body);
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await courseService.updateCourse(id, req.body);
      res.json({
        success: true,
        message: 'Course updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await courseService.deleteCourse(id);
      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  };
}

export const courseController = new CourseController();
