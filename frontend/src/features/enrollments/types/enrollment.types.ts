import { Student } from '../../students/types/student.types';
import { Course } from '../../courses/types/course.types';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  academicYear: string;
  semester: string;
  enrolledDate: string;
  status: 'Enrolled' | 'Completed' | 'Dropped';
  student?: Student;
  course?: Course;
  grade?: any;
}

export interface CreateEnrollmentInput {
  studentId: string;
  courseId: string;
  academicYear?: string;
  semester?: string;
  status?: 'Enrolled' | 'Completed' | 'Dropped';
}

export interface EnrollmentFilterParams {
  studentId?: string;
  courseId?: string;
  semester?: string;
  academicYear?: string;
  status?: string;
}
