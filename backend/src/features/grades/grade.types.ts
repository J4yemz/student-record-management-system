import { GradeRecord, StudentRecord, CourseRecord, EnrollmentRecord } from '../../shared/db/seed-data.js';

export type Grade = GradeRecord;

export interface EnrichedGrade extends Grade {
  student?: StudentRecord;
  course?: CourseRecord;
  enrollment?: EnrollmentRecord;
}

export interface UpdateGradeDTO {
  prelimGrade?: number;
  midtermGrade?: number;
  finalGrade?: number;
}

export interface GradeFilterQuery {
  studentId?: string;
  courseId?: string;
  remarks?: string;
  letterGrade?: string;
}
