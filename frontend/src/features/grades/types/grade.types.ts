import { Student } from '../../students/types/student.types';
import { Course } from '../../courses/types/course.types';
import { Enrollment } from '../../enrollments/types/enrollment.types';

export interface Grade {
  id: string;
  enrollmentId: string;
  studentId: string;
  courseId: string;
  prelimGrade?: number;
  midtermGrade?: number;
  finalGrade?: number;
  totalGrade?: number;
  letterGrade?: string;
  gradePoint?: number;
  remarks: 'Passed' | 'Failed' | 'Incomplete';
  updatedAt: string;
  student?: Student;
  course?: Course;
  enrollment?: Enrollment;
}

export interface UpdateGradeInput {
  prelimGrade?: number;
  midtermGrade?: number;
  finalGrade?: number;
}

export interface GradeFilterParams {
  studentId?: string;
  courseId?: string;
  remarks?: string;
  letterGrade?: string;
}
