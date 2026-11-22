import { db } from '../../shared/db/memory-db.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { Student, CreateStudentDTO, UpdateStudentDTO, StudentFilterQuery } from './student.types.js';

function mapFromDb(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    department: row.department,
    program: row.program,
    yearLevel: row.year_level,
    enrollmentDate: row.enrollment_date,
    status: row.status,
    gpa: Number(row.gpa || 0),
    avatarUrl: row.avatar_url
  };
}

function mapToDb(dto: Partial<Student>): any {
  const row: any = {};
  if (dto.id !== undefined) row.id = dto.id;
  if (dto.studentId !== undefined) row.student_id = dto.studentId;
  if (dto.firstName !== undefined) row.first_name = dto.firstName;
  if (dto.lastName !== undefined) row.last_name = dto.lastName;
  if (dto.email !== undefined) row.email = dto.email;
  if (dto.phone !== undefined) row.phone = dto.phone;
  if (dto.dateOfBirth !== undefined) row.date_of_birth = dto.dateOfBirth;
  if (dto.gender !== undefined) row.gender = dto.gender;
  if (dto.department !== undefined) row.department = dto.department;
  if (dto.program !== undefined) row.program = dto.program;
  if (dto.yearLevel !== undefined) row.year_level = dto.yearLevel;
  if (dto.enrollmentDate !== undefined) row.enrollment_date = dto.enrollmentDate;
  if (dto.status !== undefined) row.status = dto.status;
  if (dto.gpa !== undefined) row.gpa = dto.gpa;
  if (dto.avatarUrl !== undefined) row.avatar_url = dto.avatarUrl;
  return row;
}

export class StudentRepository {
  public async findAll(filters?: StudentFilterQuery): Promise<{ data: Student[]; total: number }> {
    if (isSupabaseConnected() && supabase) {
      let query = supabase.from('students').select('*', { count: 'exact' });

      if (filters?.search) {
        const q = filters.search.trim();
        query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,student_id.ilike.%${q}%,email.ilike.%${q}%,department.ilike.%${q}%`);
      }
      if (filters?.department && filters.department !== 'All') {
        query = query.eq('department', filters.department);
      }
      if (filters?.yearLevel && filters.yearLevel !== 'All') {
        query = query.eq('year_level', filters.yearLevel);
      }
      if (filters?.status && filters.status !== 'All') {
        query = query.eq('status', filters.status);
      }

      const sortBy = filters?.sortBy === 'name' ? 'last_name' : filters?.sortBy === 'gpa' ? 'gpa' : 'student_id';
      query = query.order(sortBy, { ascending: filters?.sortOrder !== 'desc' });

      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const start = (page - 1) * limit;
      query = query.range(start, start + limit - 1);

      const { data, count, error } = await query;
      if (error) {
        console.error('Supabase students query error:', error);
      }
      return {
        data: (data || []).map(mapFromDb),
        total: count || 0
      };
    }

    // Fallback in-memory
    let list = [...db.students];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((s) =>
        s.studentId.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    if (filters?.department && filters.department !== 'All') {
      list = list.filter((s) => s.department.toLowerCase() === filters.department?.toLowerCase());
    }
    if (filters?.yearLevel && filters.yearLevel !== 'All') {
      list = list.filter((s) => s.yearLevel === filters.yearLevel);
    }
    if (filters?.status && filters.status !== 'All') {
      list = list.filter((s) => s.status.toLowerCase() === filters.status?.toLowerCase());
    }

    const total = list.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const startIndex = (page - 1) * limit;
    return { data: list.slice(startIndex, startIndex + limit), total };
  }

  public async findById(id: string): Promise<Student | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .or(`id.eq.${id},student_id.eq.${id}`)
        .maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.students.find((s) => s.id === id || s.studentId === id);
  }

  public async findByEmail(email: string): Promise<Student | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .ilike('email', email)
        .maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.students.find((s) => s.email.toLowerCase() === email.toLowerCase());
  }

  public async findByStudentId(studentId: string): Promise<Student | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .ilike('student_id', studentId)
        .maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.students.find((s) => s.studentId.toLowerCase() === studentId.toLowerCase());
  }

  public async create(dto: CreateStudentDTO): Promise<Student> {
    const newId = `std-${Date.now().toString(36)}`;
    const studentId = dto.studentId || `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent: Student = {
      id: newId,
      studentId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      department: dto.department,
      program: dto.program,
      yearLevel: dto.yearLevel,
      enrollmentDate: dto.enrollmentDate || new Date().toISOString().split('T')[0],
      status: dto.status || 'Active',
      gpa: 0.0,
      avatarUrl: dto.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}`
    };

    if (isSupabaseConnected() && supabase) {
      const row = mapToDb(newStudent);
      const { data, error } = await supabase.from('students').insert(row).select().single();
      if (error) throw new Error(error.message);
      return mapFromDb(data);
    }

    db.setStudents([...db.students, newStudent]);
    return newStudent;
  }

  public async update(id: string, dto: UpdateStudentDTO): Promise<Student | undefined> {
    if (isSupabaseConnected() && supabase) {
      const row = mapToDb(dto as any);
      delete row.id;
      const { data, error } = await supabase
        .from('students')
        .update(row)
        .or(`id.eq.${id},student_id.eq.${id}`)
        .select()
        .single();
      if (error) return undefined;
      return mapFromDb(data);
    }

    const list = [...db.students];
    const index = list.findIndex((s) => s.id === id || s.studentId === id);
    if (index === -1) return undefined;
    list[index] = { ...list[index], ...dto };
    db.setStudents(list);
    return list[index];
  }

  public async updateGpa(id: string, newGpa: number): Promise<void> {
    const rounded = Math.round(newGpa * 100) / 100;
    if (isSupabaseConnected() && supabase) {
      await supabase
        .from('students')
        .update({ gpa: rounded })
        .or(`id.eq.${id},student_id.eq.${id}`);
      return;
    }
    const list = [...db.students];
    const index = list.findIndex((s) => s.id === id || s.studentId === id);
    if (index !== -1) {
      list[index].gpa = rounded;
      db.setStudents(list);
    }
  }

  public async delete(id: string): Promise<boolean> {
    if (isSupabaseConnected() && supabase) {
      const { error } = await supabase
        .from('students')
        .delete()
        .or(`id.eq.${id},student_id.eq.${id}`);
      return !error;
    }
    const filtered = db.students.filter((s) => s.id !== id && s.studentId !== id);
    if (filtered.length === db.students.length) return false;
    db.setStudents(filtered);
    return true;
  }
}

export const studentRepository = new StudentRepository();
