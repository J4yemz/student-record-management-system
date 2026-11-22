import { db } from '../../shared/db/memory-db.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { Grade, UpdateGradeDTO, GradeFilterQuery } from './grade.types.js';
import { calculateGradePoint } from '../../shared/utils/gpa-calculator.js';

function mapFromDb(row: any): Grade {
  return {
    id: row.id,
    enrollmentId: row.enrollment_id,
    studentId: row.student_id,
    courseId: row.course_id,
    prelimGrade: row.prelim_grade !== null ? Number(row.prelim_grade) : undefined,
    midtermGrade: row.midterm_grade !== null ? Number(row.midterm_grade) : undefined,
    finalGrade: row.final_grade !== null ? Number(row.final_grade) : undefined,
    totalGrade: row.total_grade !== null ? Number(row.total_grade) : undefined,
    letterGrade: row.letter_grade || undefined,
    gradePoint: row.grade_point !== null ? Number(row.grade_point) : undefined,
    remarks: row.remarks || 'Incomplete',
    updatedAt: row.updated_at
  };
}

export class GradeRepository {
  public async findAll(filters?: GradeFilterQuery): Promise<Grade[]> {
    if (isSupabaseConnected() && supabase) {
      let query = supabase.from('grades').select('*');
      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.courseId) query = query.eq('course_id', filters.courseId);
      if (filters?.remarks && filters.remarks !== 'All') query = query.eq('remarks', filters.remarks);
      if (filters?.letterGrade && filters.letterGrade !== 'All') query = query.eq('letter_grade', filters.letterGrade);
      query = query.order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) console.error('Supabase grades error:', error);
      return (data || []).map(mapFromDb);
    }

    let list = [...db.grades];
    if (filters?.studentId) list = list.filter((g) => g.studentId === filters.studentId);
    if (filters?.courseId) list = list.filter((g) => g.courseId === filters.courseId);
    if (filters?.remarks && filters.remarks !== 'All') list = list.filter((g) => g.remarks.toLowerCase() === filters.remarks?.toLowerCase());
    return list;
  }

  public async findById(id: string): Promise<Grade | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase.from('grades').select('*').eq('id', id).maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.grades.find((g) => g.id === id);
  }

  public async findByEnrollmentId(enrollmentId: string): Promise<Grade | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase.from('grades').select('*').eq('enrollment_id', enrollmentId).maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.grades.find((g) => g.enrollmentId === enrollmentId);
  }

  public async createInitial(enrollmentId: string, studentId: string, courseId: string): Promise<Grade> {
    const initial: Grade = {
      id: `grd-${Date.now().toString(36)}`,
      enrollmentId,
      studentId,
      courseId,
      remarks: 'Incomplete',
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConnected() && supabase) {
      const row = {
        id: initial.id,
        enrollment_id: initial.enrollmentId,
        student_id: initial.studentId,
        course_id: initial.courseId,
        remarks: initial.remarks
      };
      const { data, error } = await supabase.from('grades').insert(row).select().single();
      if (error) console.error('Supabase createInitial grade error:', error);
      return data ? mapFromDb(data) : initial;
    }

    db.setGrades([...db.grades, initial]);
    return initial;
  }

  public async update(id: string, dto: UpdateGradeDTO): Promise<Grade | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const prelim = dto.prelimGrade !== undefined ? Number(dto.prelimGrade) : existing.prelimGrade;
    const midterm = dto.midtermGrade !== undefined ? Number(dto.midtermGrade) : existing.midtermGrade;
    const final = dto.finalGrade !== undefined ? Number(dto.finalGrade) : existing.finalGrade;

    const computed = calculateGradePoint(prelim, midterm, final);

    if (isSupabaseConnected() && supabase) {
      const updateData = {
        prelim_grade: prelim,
        midterm_grade: midterm,
        final_grade: final,
        total_grade: computed.totalGrade,
        letter_grade: computed.letterGrade,
        grade_point: computed.gradePoint,
        remarks: computed.remarks,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('grades')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase grade update error:', error);
        return undefined;
      }
      return mapFromDb(data);
    }

    const list = [...db.grades];
    const index = list.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    const updated: Grade = {
      ...existing,
      prelimGrade: prelim,
      midtermGrade: midterm,
      finalGrade: final,
      totalGrade: computed.totalGrade,
      letterGrade: computed.letterGrade,
      gradePoint: computed.gradePoint,
      remarks: computed.remarks,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    db.setGrades(list);
    return updated;
  }
}

export const gradeRepository = new GradeRepository();
