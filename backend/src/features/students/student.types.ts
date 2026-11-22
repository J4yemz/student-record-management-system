import { StudentRecord } from '../../shared/db/seed-data.js';

export type Student = StudentRecord;

export interface CreateStudentDTO {
  studentId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  program: string;
  yearLevel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  enrollmentDate?: string;
  status?: 'Active' | 'Graduated' | 'Inactive' | 'Suspended';
  avatarUrl?: string;
}

export type UpdateStudentDTO = Partial<CreateStudentDTO>;

export interface StudentFilterQuery {
  search?: string;
  department?: string;
  yearLevel?: string;
  status?: string;
  sortBy?: 'name' | 'studentId' | 'gpa' | 'enrollmentDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
