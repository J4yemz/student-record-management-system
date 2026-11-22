import { EnrollmentRecord, StudentRecord, CourseRecord, GradeRecord } from '../../shared/db/seed-data.js';

export type Enrollment = EnrollmentRecord;

export interface EnrichedEnrollment extends Enrollment {
  student?: StudentRecord;
  course?: CourseRecord;
  grade?: GradeRecord;
}

export interface CreateEnrollmentDTO {
  studentId: string;
  courseId: string;
  academicYear?: string;
  semester?: string;
  status?: 'Enrolled' | 'Completed' | 'Dropped';
}

export interface UpdateEnrollmentDTO {
  status?: 'Enrolled' | 'Completed' | 'Dropped';
  semester?: string;
  academicYear?: string;
}

export interface EnrollmentFilterQuery {
  studentId?: string;
  courseId?: string;
  semester?: string;
  academicYear?: string;
  status?: string;
}
