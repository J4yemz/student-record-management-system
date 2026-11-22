import { enrollmentRepository } from './enrollment.repository.js';
import { CreateEnrollmentDTO, UpdateEnrollmentDTO, EnrollmentFilterQuery, EnrichedEnrollment } from './enrollment.types.js';
import { studentRepository } from '../students/student.repository.js';
import { courseRepository } from '../courses/course.repository.js';
import { gradeRepository } from '../grades/grade.repository.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { db } from '../../shared/db/memory-db.js';

export class EnrollmentService {
  public async getAllEnrollments(filters?: EnrollmentFilterQuery): Promise<EnrichedEnrollment[]> {
    if (isSupabaseConnected() && supabase) {
      let query = supabase.from('enrollments').select(`
        id, student_id, course_id, academic_year, semester, enrolled_date, status,
        students (*),
        courses (*),
        grades (*)
      `);

      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.courseId) query = query.eq('course_id', filters.courseId);
      if (filters?.status && filters.status !== 'All') query = query.eq('status', filters.status);
      if (filters?.semester && filters.semester !== 'All') query = query.eq('semester', filters.semester);
      query = query.order('enrolled_date', { ascending: false });

      const { data, error } = await query;
      if (error) console.error('Supabase get enrollments error:', error);

      return (data || []).map((e: any) => ({
        id: e.id,
        studentId: e.student_id,
        courseId: e.course_id,
        academicYear: e.academic_year,
        semester: e.semester,
        enrolledDate: e.enrolled_date,
        status: e.status,
        student: e.students ? {
          id: e.students.id,
          studentId: e.students.student_id,
          firstName: e.students.first_name,
          lastName: e.students.last_name,
          email: e.students.email,
          phone: e.students.phone,
          department: e.students.department,
          program: e.students.program,
          yearLevel: e.students.year_level,
          status: e.students.status,
          gpa: e.students.gpa
        } as any : undefined,
        course: e.courses ? {
          id: e.courses.id,
          code: e.courses.code,
          name: e.courses.name,
          department: e.courses.department,
          credits: e.courses.credits,
          instructor: e.courses.instructor,
          room: e.courses.room
        } as any : undefined,
        grade: e.grades && e.grades[0] ? {
          id: e.grades[0].id,
          totalGrade: e.grades[0].total_grade,
          letterGrade: e.grades[0].letter_grade,
          gradePoint: e.grades[0].grade_point,
          remarks: e.grades[0].remarks
        } as any : undefined
      }));
    }

    const list = await enrollmentRepository.findAll(filters);
    return list.map((e) => ({
      ...e,
      student: db.students.find((s) => s.id === e.studentId),
      course: db.courses.find((c) => c.id === e.courseId),
      grade: db.grades.find((g) => g.enrollmentId === e.id)
    }));
  }

  public async getEnrollmentById(id: string): Promise<EnrichedEnrollment> {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new AppError(`Enrollment with ID "${id}" was not found`, 404);
    }
    const student = await studentRepository.findById(enrollment.studentId);
    const course = await courseRepository.findById(enrollment.courseId);
    const grade = await gradeRepository.findByEnrollmentId(enrollment.id);

    return {
      ...enrollment,
      student,
      course,
      grade
    };
  }

  public async createEnrollment(dto: CreateEnrollmentDTO): Promise<EnrichedEnrollment> {
    const student = await studentRepository.findById(dto.studentId);
    if (!student) {
      throw new AppError(`Student "${dto.studentId}" not found`, 404);
    }

    const course = await courseRepository.findById(dto.courseId);
    if (!course) {
      throw new AppError(`Course "${dto.courseId}" not found`, 404);
    }

    const existing = await enrollmentRepository.findByStudentAndCourse(dto.studentId, dto.courseId);
    if (existing) {
      throw new AppError(`Student is already actively enrolled in course ${course.code}`, 400);
    }

    const activeCount = await enrollmentRepository.countActiveByCourse(course.id);
    if (activeCount >= course.capacity) {
      throw new AppError(`Course "${course.name}" (${course.code}) is already at full capacity (${course.capacity})`, 400);
    }

    const created = await enrollmentRepository.create(dto);

    // Initialize blank grade record in Supabase or local store
    const grade = await gradeRepository.createInitial(created.id, created.studentId, created.courseId);

    return {
      ...created,
      student,
      course,
      grade
    };
  }

  public async updateEnrollment(id: string, dto: UpdateEnrollmentDTO) {
    const existing = await enrollmentRepository.findById(id);
    if (!existing) {
      throw new AppError(`Enrollment "${id}" not found`, 404);
    }
    return await enrollmentRepository.update(id, dto);
  }

  public async deleteEnrollment(id: string): Promise<void> {
    const existing = await enrollmentRepository.findById(id);
    if (!existing) {
      throw new AppError(`Enrollment "${id}" not found`, 404);
    }
    await enrollmentRepository.delete(id);
  }
}

export const enrollmentService = new EnrollmentService();
