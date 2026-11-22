import { studentRepository } from './student.repository.js';
import { CreateStudentDTO, UpdateStudentDTO, StudentFilterQuery, Student } from './student.types.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { db } from '../../shared/db/memory-db.js';

export class StudentService {
  public async getAllStudents(filters?: StudentFilterQuery) {
    return await studentRepository.findAll(filters);
  }

  public async getStudentById(id: string): Promise<Student> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new AppError(`Student with ID "${id}" was not found`, 404);
    }
    return student;
  }

  public async getStudentDetails(id: string) {
    const student = await this.getStudentById(id);

    if (isSupabaseConnected() && supabase) {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id, student_id, course_id, academic_year, semester, enrolled_date, status,
          courses (*),
          grades (*)
        `)
        .eq('student_id', student.id);

      const mappedEnrollments = (enrollments || []).map((e: any) => ({
        id: e.id,
        studentId: e.student_id,
        courseId: e.course_id,
        academicYear: e.academic_year,
        semester: e.semester,
        enrolledDate: e.enrolled_date,
        status: e.status,
        course: e.courses ? {
          id: e.courses.id,
          code: e.courses.code,
          name: e.courses.name,
          department: e.courses.department,
          credits: e.courses.credits,
          instructor: e.courses.instructor,
          schedule: e.courses.schedule,
          room: e.courses.room
        } : undefined,
        grade: e.grades && e.grades[0] ? {
          id: e.grades[0].id,
          prelimGrade: e.grades[0].prelim_grade,
          midtermGrade: e.grades[0].midterm_grade,
          finalGrade: e.grades[0].final_grade,
          totalGrade: e.grades[0].total_grade,
          letterGrade: e.grades[0].letter_grade,
          gradePoint: e.grades[0].grade_point,
          remarks: e.grades[0].remarks
        } : undefined
      }));

      return {
        student,
        enrollments: mappedEnrollments
      };
    }

    const enrollments = db.enrollments.filter((e) => e.studentId === student.id);
    const enriched = enrollments.map((enr) => ({
      ...enr,
      course: db.courses.find((c) => c.id === enr.courseId),
      grade: db.grades.find((g) => g.enrollmentId === enr.id)
    }));

    return {
      student,
      enrollments: enriched
    };
  }

  public async createStudent(dto: CreateStudentDTO): Promise<Student> {
    const existing = await studentRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError(`A student with email "${dto.email}" already exists`, 400);
    }

    if (dto.studentId) {
      const existingId = await studentRepository.findByStudentId(dto.studentId);
      if (existingId) {
        throw new AppError(`Student ID "${dto.studentId}" is already taken`, 400);
      }
    }

    return await studentRepository.create(dto);
  }

  public async updateStudent(id: string, dto: UpdateStudentDTO): Promise<Student> {
    const existing = await studentRepository.findById(id);
    if (!existing) {
      throw new AppError(`Student with ID "${id}" was not found`, 404);
    }

    if (dto.email && dto.email.toLowerCase() !== existing.email.toLowerCase()) {
      const conflict = await studentRepository.findByEmail(dto.email);
      if (conflict) {
        throw new AppError(`A student with email "${dto.email}" already exists`, 400);
      }
    }

    const updated = await studentRepository.update(id, dto);
    if (!updated) {
      throw new AppError('Failed to update student', 500);
    }
    return updated;
  }

  public async deleteStudent(id: string): Promise<void> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new AppError(`Student with ID "${id}" was not found`, 404);
    }

    const deleted = await studentRepository.delete(student.id);
    if (!deleted) {
      throw new AppError('Failed to delete student', 500);
    }
  }
}

export const studentService = new StudentService();
