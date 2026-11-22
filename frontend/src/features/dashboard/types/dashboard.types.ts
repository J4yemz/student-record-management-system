export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  averageGpa: number;
  passingRate: number;
  departmentDistribution: { department: string; count: number }[];
  yearLevelDistribution: { yearLevel: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  recentStudents: any[];
  topStudents: any[];
}
