export interface Course {
  id: string;
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

export type CreateCourseInput = Omit<Course, 'id'>;
export type UpdateCourseInput = Partial<CreateCourseInput>;

export interface CourseFilterParams {
  search?: string;
  department?: string;
  semester?: string;
}
