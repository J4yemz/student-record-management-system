import { api } from '../../../shared/api/client';
import { Course, CreateCourseInput, UpdateCourseInput, CourseFilterParams } from '../types/course.types';

export const courseApi = {
  getAll: async (params?: CourseFilterParams): Promise<Course[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.department) query.append('department', params.department);
    if (params?.semester) query.append('semester', params.semester);

    const qs = query.toString();
    const endpoint = `/courses${qs ? `?${qs}` : ''}`;
    const res = await api.get<Course[]>(endpoint);
    return res.data;
  },

  getById: async (id: string): Promise<Course> => {
    const res = await api.get<Course>(`/courses/${id}`);
    return res.data;
  },

  getRoster: async (id: string): Promise<{ course: Course; totalEnrolled: number; roster: any[] }> => {
    const res = await api.get<{ course: Course; totalEnrolled: number; roster: any[] }>(`/courses/${id}/roster`);
    return res.data;
  },

  create: async (data: CreateCourseInput): Promise<Course> => {
    const res = await api.post<Course>('/courses', data);
    return res.data;
  },

  update: async (id: string, data: UpdateCourseInput): Promise<Course> => {
    const res = await api.put<Course>(`/courses/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};
