import { courseRepository } from './course.repository.js';
import { CreateCourseDTO, UpdateCourseDTO, CourseFilterQuery, Course } from './course.types.js';
import { AppError } from '../../shared/middleware/error.middleware.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { db } from '../../shared/db/memory-db.js';

export class CourseService {
  public async getAllCourses(filters?: CourseFilterQuery): Promise<Course[]> {
    return await courseRepository.findAll(filters);
  }

  public async getCourseById(id: string): Promise<Course> {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new AppError(`Course with ID or code "${id}" was not found`, 404);
    }
    return course;
  }

  public async getCourseRoster(courseId: string) {
    const course = await this.getCourseById(courseId);

    if (isSupabaseConnected() && supabase) {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id, enrolled_date, status,
          students (*),
          grades (*)
        `)
        .eq('course_id', course.id);

      const roster = (enrollments || []).map((e: any) => ({
        enrollmentId: e.id,
        enrolledDate: e.enrolled_date,
        status: e.status,
        student: e.students ? {
          id: e.students.id,
          studentId: e.students.student_id,
          firstName: e.students.first_name,
          lastName: e.students.last_name,
          email: e.students.email
        } : undefined,
        grade: e.grades && e.grades[0] ? {
          id: e.grades[0].id,
          totalGrade: e.grades[0].total_grade,
          letterGrade: e.grades[0].letter_grade,
          remarks: e.grades[0].remarks
        } : undefined
      }));

      return {
        course,
        totalEnrolled: roster.length,
        roster
      };
    }

    const enrollments = db.enrollments.filter((e) => e.courseId === course.id);
    const roster = enrollments.map((enr) => ({
      enrollmentId: enr.id,
      enrolledDate: enr.enrolledDate,
      status: enr.status,
      student: db.students.find((s) => s.id === enr.studentId),
      grade: db.grades.find((g) => g.enrollmentId === enr.id)
    }));

    return {
      course,
      totalEnrolled: roster.length,
      roster
    };
  }

  public async createCourse(dto: CreateCourseDTO): Promise<Course> {
    const existing = await courseRepository.findByCode(dto.code);
    if (existing) {
      throw new AppError(`Course with code "${dto.code}" already exists`, 400);
    }
    return await courseRepository.create(dto);
  }

  public async updateCourse(id: string, dto: UpdateCourseDTO): Promise<Course> {
    const existing = await courseRepository.findById(id);
    if (!existing) {
      throw new AppError(`Course "${id}" was not found`, 404);
    }

    if (dto.code && dto.code.toUpperCase() !== existing.code) {
      const conflict = await courseRepository.findByCode(dto.code);
      if (conflict) {
        throw new AppError(`Course code "${dto.code}" is already in use`, 400);
      }
    }

    const updated = await courseRepository.update(id, dto);
    if (!updated) {
      throw new AppError('Failed to update course', 500);
    }
    return updated;
  }

  public async deleteCourse(id: string): Promise<void> {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new AppError(`Course "${id}" was not found`, 404);
    }
    await courseRepository.delete(course.id);
  }
}

export const courseService = new CourseService();
