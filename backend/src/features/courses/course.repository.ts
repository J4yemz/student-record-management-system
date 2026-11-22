import { db } from '../../shared/db/memory-db.js';
import { supabase, isSupabaseConnected } from '../../shared/db/supabase.js';
import { Course, CreateCourseDTO, UpdateCourseDTO, CourseFilterQuery } from './course.types.js';

function mapFromDb(row: any): Course {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    department: row.department,
    credits: Number(row.credits || 3),
    instructor: row.instructor,
    schedule: row.schedule,
    room: row.room,
    capacity: Number(row.capacity || 40),
    semester: row.semester,
    description: row.description || ''
  };
}

function mapToDb(dto: Partial<Course>): any {
  const row: any = {};
  if (dto.id !== undefined) row.id = dto.id;
  if (dto.code !== undefined) row.code = dto.code;
  if (dto.name !== undefined) row.name = dto.name;
  if (dto.department !== undefined) row.department = dto.department;
  if (dto.credits !== undefined) row.credits = dto.credits;
  if (dto.instructor !== undefined) row.instructor = dto.instructor;
  if (dto.schedule !== undefined) row.schedule = dto.schedule;
  if (dto.room !== undefined) row.room = dto.room;
  if (dto.capacity !== undefined) row.capacity = dto.capacity;
  if (dto.semester !== undefined) row.semester = dto.semester;
  if (dto.description !== undefined) row.description = dto.description;
  return row;
}

export class CourseRepository {
  public async findAll(filters?: CourseFilterQuery): Promise<Course[]> {
    if (isSupabaseConnected() && supabase) {
      let query = supabase.from('courses').select('*');
      if (filters?.search) {
        const q = filters.search.trim();
        query = query.or(`code.ilike.%${q}%,name.ilike.%${q}%,instructor.ilike.%${q}%,department.ilike.%${q}%`);
      }
      if (filters?.department && filters.department !== 'All') {
        query = query.eq('department', filters.department);
      }
      if (filters?.semester && filters.semester !== 'All') {
        query = query.eq('semester', filters.semester);
      }
      query = query.order('code', { ascending: true });

      const { data, error } = await query;
      if (error) console.error('Supabase courses query error:', error);
      return (data || []).map(mapFromDb);
    }

    let list = [...db.courses];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
      );
    }
    if (filters?.department && filters.department !== 'All') {
      list = list.filter((c) => c.department.toLowerCase() === filters.department?.toLowerCase());
    }
    return list;
  }

  public async findById(id: string): Promise<Course | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .or(`id.eq.${id},code.ilike.${id}`)
        .maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.courses.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  }

  public async findByCode(code: string): Promise<Course | undefined> {
    if (isSupabaseConnected() && supabase) {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .ilike('code', code)
        .maybeSingle();
      return data ? mapFromDb(data) : undefined;
    }
    return db.courses.find((c) => c.code.toLowerCase() === code.toLowerCase());
  }

  public async create(dto: CreateCourseDTO): Promise<Course> {
    const newCourse: Course = {
      id: `crs-${Date.now().toString(36)}`,
      code: dto.code.toUpperCase(),
      name: dto.name,
      department: dto.department,
      credits: Number(dto.credits),
      instructor: dto.instructor,
      schedule: dto.schedule,
      room: dto.room,
      capacity: Number(dto.capacity),
      semester: dto.semester,
      description: dto.description
    };

    if (isSupabaseConnected() && supabase) {
      const row = mapToDb(newCourse);
      const { data, error } = await supabase.from('courses').insert(row).select().single();
      if (error) throw new Error(error.message);
      return mapFromDb(data);
    }

    db.setCourses([...db.courses, newCourse]);
    return newCourse;
  }

  public async update(id: string, dto: UpdateCourseDTO): Promise<Course | undefined> {
    if (isSupabaseConnected() && supabase) {
      const row = mapToDb(dto as any);
      delete row.id;
      const { data, error } = await supabase
        .from('courses')
        .update(row)
        .or(`id.eq.${id},code.ilike.${id}`)
        .select()
        .single();
      if (error) return undefined;
      return mapFromDb(data);
    }

    const list = [...db.courses];
    const index = list.findIndex((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
    if (index === -1) return undefined;
    list[index] = { ...list[index], ...dto };
    db.setCourses(list);
    return list[index];
  }

  public async delete(id: string): Promise<boolean> {
    if (isSupabaseConnected() && supabase) {
      const { error } = await supabase
        .from('courses')
        .delete()
        .or(`id.eq.${id},code.ilike.${id}`);
      return !error;
    }
    const filtered = db.courses.filter((c) => c.id !== id && c.code.toLowerCase() !== id.toLowerCase());
    if (filtered.length === db.courses.length) return false;
    db.setCourses(filtered);
    return true;
  }
}

export const courseRepository = new CourseRepository();
