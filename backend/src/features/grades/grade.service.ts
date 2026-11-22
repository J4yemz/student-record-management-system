import { gradeRepository } from './grade.repository.js';
import { UpdateGradeDTO, GradeFilterQuery, EnrichedGrade } from './grade.types.js';
import { studentRepository } from '../students/student.repository.js';
import { courseRepository } from '../courses/course.repository.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { db } from '../../shared/db/memory-db.js';

export class GradeService {
  public async getAllGrades(filters?: GradeFilterQuery): Promise<EnrichedGrade[]> {
    if (isSupabaseConnected() && supabase) {
      let query = supabase.from('grades').select(`
        *,
        students (*),
        courses (*),
        enrollments (*)
      `);

      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.courseId) query = query.eq('course_id', filters.courseId);
      if (filters?.remarks && filters.remarks !== 'All') query = query.eq('remarks', filters.remarks);
      if (filters?.letterGrade && filters.letterGrade !== 'All') query = query.eq('letter_grade', filters.letterGrade);
      query = query.order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) console.error('Supabase getAllGrades error:', error);

      return (data || []).map((g: any) => ({
        id: g.id,
        enrollmentId: g.enrollment_id,
        studentId: g.student_id,
        courseId: g.course_id,
        prelimGrade: g.prelim_grade !== null ? Number(g.prelim_grade) : undefined,
        midtermGrade: g.midterm_grade !== null ? Number(g.midterm_grade) : undefined,
        finalGrade: g.final_grade !== null ? Number(g.final_grade) : undefined,
        totalGrade: g.total_grade !== null ? Number(g.total_grade) : undefined,
        letterGrade: g.letter_grade || undefined,
        gradePoint: g.grade_point !== null ? Number(g.grade_point) : undefined,
        remarks: g.remarks,
        updatedAt: g.updated_at,
        student: g.students ? {
          id: g.students.id,
          studentId: g.students.student_id,
          firstName: g.students.first_name,
          lastName: g.students.last_name,
          email: g.students.email
        } as any : undefined,
        course: g.courses ? {
          id: g.courses.id,
          code: g.courses.code,
          name: g.courses.name,
          credits: g.courses.credits,
          instructor: g.courses.instructor
        } as any : undefined
      }));
    }

    const grades = await gradeRepository.findAll(filters);
    return grades.map((g) => ({
      ...g,
      student: db.students.find((s) => s.id === g.studentId),
      course: db.courses.find((c) => c.id === g.courseId),
      enrollment: db.enrollments.find((e) => e.id === g.enrollmentId)
    }));
  }

  public async getGradeById(id: string): Promise<EnrichedGrade> {
    const grade = await gradeRepository.findById(id);
    if (!grade) {
      throw new AppError(`Grade record "${id}" was not found`, 404);
    }
    const student = await studentRepository.findById(grade.studentId);
    const course = await courseRepository.findById(grade.courseId);

    return {
      ...grade,
      student,
      course
    };
  }

  public async updateGrade(id: string, dto: UpdateGradeDTO): Promise<EnrichedGrade> {
    const existing = await gradeRepository.findById(id);
    if (!existing) {
      throw new AppError(`Grade record "${id}" was not found`, 404);
    }

    const updated = await gradeRepository.update(id, dto);
    if (!updated) {
      throw new AppError('Failed to update grade', 500);
    }

    // Recompute cumulative GPA for the student in Supabase
    await this.recalculateStudentGPA(existing.studentId);

    const student = await studentRepository.findById(updated.studentId);
    const course = await courseRepository.findById(updated.courseId);

    return {
      ...updated,
      student,
      course
    };
  }

  public async recalculateStudentGPA(studentId: string): Promise<number> {
    if (isSupabaseConnected() && supabase) {
      const { data: studentGrades } = await supabase
        .from('grades')
        .select(`
          grade_point, remarks,
          courses (credits)
        `)
        .eq('student_id', studentId)
        .neq('remarks', 'Incomplete');

      if (!studentGrades || studentGrades.length === 0) {
        await studentRepository.updateGpa(studentId, 0.0);
        return 0.0;
      }

      let totalPoints = 0;
      let totalCredits = 0;

      for (const g of studentGrades) {
        if (g.grade_point !== null) {
          const credits = (g.courses as any)?.credits || 3;
          totalPoints += Number(g.grade_point) * credits;
          totalCredits += credits;
        }
      }

      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0.0;
      const rounded = Math.round(gpa * 100) / 100;
      await studentRepository.updateGpa(studentId, rounded);
      return rounded;
    }

    const studentGrades = db.grades.filter(
      (g) => g.studentId === studentId && g.gradePoint !== undefined && g.remarks !== 'Incomplete'
    );

    if (studentGrades.length === 0) return 0.0;

    let totalPoints = 0;
    let totalCredits = 0;

    for (const g of studentGrades) {
      const course = db.courses.find((c) => c.id === g.courseId);
      const credits = course ? course.credits : 3;
      totalPoints += (g.gradePoint || 0) * credits;
      totalCredits += credits;
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    await studentRepository.updateGpa(studentId, gpa);
    return Math.round(gpa * 100) / 100;
  }
}

export const gradeService = new GradeService();
