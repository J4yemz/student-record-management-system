import { CourseRecord } from '../../shared/db/seed-data.js';

export type Course = CourseRecord;

export interface CreateCourseDTO {
  code: string;
  name: string;
  department: string;
  credits: number;
  instructor: string;
  schedule: string;
  room: string;
  capacity: number;
  semester: string;
  description: string;
}

export type UpdateCourseDTO = Partial<CreateCourseDTO>;

export interface CourseFilterQuery {
  search?: string;
  department?: string;
  semester?: string;
}
