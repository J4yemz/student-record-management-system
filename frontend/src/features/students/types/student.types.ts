export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  program: string;
  yearLevel: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  enrollmentDate: string;
  status: 'Active' | 'Graduated' | 'Inactive' | 'Suspended';
  gpa: number;
  avatarUrl?: string;
}

export type CreateStudentInput = Omit<Student, 'id' | 'gpa'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;

export interface StudentFilterParams {
  search?: string;
  department?: string;
  yearLevel?: string;
  status?: string;
  sortBy?: 'name' | 'studentId' | 'gpa' | 'enrollmentDate';
  sortOrder?: 'asc' | 'desc';
}
