export interface StudentRecord {
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

export interface CourseRecord {
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

export interface EnrollmentRecord {
  id: string;
  studentId: string;
  courseId: string;
  academicYear: string;
  semester: string;
  enrolledDate: string;
  status: 'Enrolled' | 'Completed' | 'Dropped';
}

export interface GradeRecord {
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
}
