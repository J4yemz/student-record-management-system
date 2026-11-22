import { db } from '../../shared/db/memory-db.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { Enrollment, CreateEnrollmentDTO, UpdateEnrollmentDTO, EnrollmentFilterQuery } from './enrollment.types.js';

function mapFromDb(row: any): Enrollment {
  return {
    id: row.id,
    studentId: row.student_id,
    courseId: row.course_id,
    academicYear: row.academic_year,
    semester: row.semester,
    enrolledDate: row.enrolled_date,
    status: row.status
  };
}

export class EnrollmentRepository {
  public async findAll(filters?: EnrollmentFilterQuery): Promise<Enrollment[]> {
    if (isSupabaseConnected() && supabase) {
      let query = supabase.from('enrollments').select('*');
      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.courseId) query = query.eq('course_id', filters.courseId);
      if (filters?.semester && filters.semester !== 'All') query = query.eq('semester', filters.semester);
      if (filters?.academicYear && filters.academicYear !== 'All') query = query.eq('academic_year', filters.academicYear);
      if (filters?.status && filters.status !== 'All') query = query.eq('status', filters.status);
      query = query.order('enrolled_date', { ascending: false });

      const { data, error } = await query;
      if (error) console.error('Supabase enrollments error:', error);
      return (data || []).map(mapFromDb);
    }

    let list = [...db.enrollments];
    if (filters?.studentId) list = list.filter((e) => e.studentId === filters.studentId);
    if (filters?.courseId) list = list.filter((e) => e.courseId === filters.courseId);
    if (filters?.status && filters.status !== 'All') list = list.filter((e) => e.status === filters.status);
    return list;
  }

  public async findById(id: string): Promise<Enrollment | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase.from('enrollments').select('*').eq('id', id).maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.enrollments.find((e) => e.id === id);
  }

  public async findByStudentAndCourse(studentId: string, courseId: string): Promise<Enrollment | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .neq('status', 'Dropped')
        .maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.enrollments.find((e) => e.studentId === studentId && e.courseId === courseId && e.status !== 'Dropped');
  }

  public async countActiveByCourse(courseId: string): Promise<number> {
    if (isSupabaseConnected() && supabase) {
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .eq('status', 'Enrolled');
      return count || 0;
    }
    return db.enrollments.filter((e) => e.courseId === courseId && e.status === 'Enrolled').length;
  }

  public async create(dto: CreateEnrollmentDTO): Promise<Enrollment> {
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now().toString(36)}`,
      studentId: dto.studentId,
      courseId: dto.courseId,
      academicYear: dto.academicYear || '2024-2025',
      semester: dto.semester || 'Fall 2024',
      enrolledDate: new Date().toISOString().split('T')[0],
      status: dto.status || 'Enrolled'
    };

    if (isSupabaseConnected() && supabase) {
      const row = {
        id: newEnrollment.id,
        student_id: newEnrollment.studentId,
        course_id: newEnrollment.courseId,
        academic_year: newEnrollment.academicYear,
        semester: newEnrollment.semester,
        enrolled_date: newEnrollment.enrolledDate,
        status: newEnrollment.status
      };
      const { data, error } = await supabase.from('enrollments').insert(row).select().single();
      if (error) throw new Error(error.message);
      return mapFromDb(data);
    }

    db.setEnrollments([...db.enrollments, newEnrollment]);
    return newEnrollment;
  }

  public async update(id: string, dto: UpdateEnrollmentDTO): Promise<Enrollment | undefined> {
    if (isSupabaseConnected() && supabase) {
      const updateData: any = {};
      if (dto.status !== undefined) updateData.status = dto.status;
      if (dto.semester !== undefined) updateData.semester = dto.semester;
      if (dto.academicYear !== undefined) updateData.academic_year = dto.academicYear;

      const { data, error } = await supabase
        .from('enrollments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return undefined;
      return mapFromDb(data);
    }

    const list = [...db.enrollments];
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) return undefined;
    list[index] = { ...list[index], ...dto };
    db.setEnrollments(list);
    return list[index];
  }

  public async delete(id: string): Promise<boolean> {
    if (isSupabaseConnected() && supabase) {
      const { error } = await supabase.from('enrollments').delete().eq('id', id);
      return !error;
    }
    const filtered = db.enrollments.filter((e) => e.id !== id);
    if (filtered.length === db.enrollments.length) return false;
    db.setEnrollments(filtered);
    return true;
  }
}

export const enrollmentRepository = new EnrollmentRepository();
