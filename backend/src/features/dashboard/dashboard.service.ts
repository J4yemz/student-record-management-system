import { db } from '../../shared/db/memory-db.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { DashboardStats } from './dashboard.types.js';

export class DashboardService {
  public async getStats(): Promise<DashboardStats> {
    if (isSupabaseConnected() && supabase) {
      const [
        { data: students },
        { count: coursesCount },
        { count: enrollmentsCount },
        { data: grades }
      ] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('grades').select('remarks')
      ]);

      const studentList = (students || []).map((s: any) => ({
        id: s.id,
        studentId: s.student_id,
        firstName: s.first_name,
        lastName: s.last_name,
        email: s.email,
        phone: s.phone,
        dateOfBirth: s.date_of_birth,
        gender: s.gender,
        department: s.department,
        program: s.program,
        yearLevel: s.year_level,
        enrollmentDate: s.enrollment_date,
        status: s.status,
        gpa: Number(s.gpa || 0),
        avatarUrl: s.avatar_url
      }));

      const totalStudents = studentList.length;
      const totalCourses = coursesCount || 0;
      const totalEnrollments = enrollmentsCount || 0;

      // Active GPA calculation
      const activeStudents = studentList.filter((s) => s.status === 'Active');
      const totalGpa = activeStudents.reduce((acc, s) => acc + s.gpa, 0);
      const averageGpa = activeStudents.length > 0 ? Math.round((totalGpa / activeStudents.length) * 100) / 100 : 0;

      // Passing rate
      const allGrades = grades || [];
      const evaluated = allGrades.filter((g) => g.remarks !== 'Incomplete');
      const passed = evaluated.filter((g) => g.remarks === 'Passed');
      const passingRate = evaluated.length > 0 ? Math.round((passed.length / evaluated.length) * 100) : 100;

      // Distributions
      const deptMap: Record<string, number> = {};
      studentList.forEach((s) => {
        deptMap[s.department] = (deptMap[s.department] || 0) + 1;
      });
      const departmentDistribution = Object.entries(deptMap).map(([department, count]) => ({
        department,
        count
      }));

      const yearMap: Record<string, number> = {};
      studentList.forEach((s) => {
        yearMap[s.yearLevel] = (yearMap[s.yearLevel] || 0) + 1;
      });
      const yearLevelDistribution = Object.entries(yearMap).map(([yearLevel, count]) => ({
        yearLevel,
        count
      }));

      const statusMap: Record<string, number> = {};
      studentList.forEach((s) => {
        statusMap[s.status] = (statusMap[s.status] || 0) + 1;
      });
      const statusDistribution = Object.entries(statusMap).map(([status, count]) => ({
        status,
        count
      }));

      const recentStudents = [...studentList]
        .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
        .slice(0, 5);

      const topStudents = [...studentList]
        .sort((a, b) => b.gpa - a.gpa)
        .slice(0, 5);

      return {
        totalStudents,
        totalCourses,
        totalEnrollments,
        averageGpa,
        passingRate,
        departmentDistribution,
        yearLevelDistribution,
        statusDistribution,
        recentStudents,
        topStudents
      };
    }

    // Fallback on in-memory store
    const students = db.students;
    const courses = db.courses;
    const enrollments = db.enrollments;
    const grades = db.grades;

    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalEnrollments = enrollments.length;

    const activeStudents = students.filter((s) => s.status === 'Active');
    const totalGpa = activeStudents.reduce((acc, s) => acc + s.gpa, 0);
    const averageGpa = activeStudents.length > 0 ? Math.round((totalGpa / activeStudents.length) * 100) / 100 : 0;

    const gradedGrades = grades.filter((g) => g.remarks !== 'Incomplete');
    const passedGrades = gradedGrades.filter((g) => g.remarks === 'Passed');
    const passingRate = gradedGrades.length > 0
      ? Math.round((passedGrades.length / gradedGrades.length) * 100)
      : 100;

    const deptMap: Record<string, number> = {};
    students.forEach((s) => {
      deptMap[s.department] = (deptMap[s.department] || 0) + 1;
    });
    const departmentDistribution = Object.entries(deptMap).map(([department, count]) => ({
      department,
      count
    }));

    const yearMap: Record<string, number> = {};
    students.forEach((s) => {
      yearMap[s.yearLevel] = (yearMap[s.yearLevel] || 0) + 1;
    });
    const yearLevelDistribution = Object.entries(yearMap).map(([yearLevel, count]) => ({
      yearLevel,
      count
    }));

    const statusMap: Record<string, number> = {};
    students.forEach((s) => {
      statusMap[s.status] = (statusMap[s.status] || 0) + 1;
    });
    const statusDistribution = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count
    }));

    const recentStudents = [...students]
      .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
      .slice(0, 5);

    const topStudents = [...students]
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, 5);

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      averageGpa,
      passingRate,
      departmentDistribution,
      yearLevelDistribution,
      statusDistribution,
      recentStudents,
      topStudents
    };
  }
}

export const dashboardService = new DashboardService();
