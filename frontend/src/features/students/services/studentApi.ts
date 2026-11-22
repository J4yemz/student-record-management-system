import { api } from '../../../shared/api/client';
import { Student, CreateStudentInput, UpdateStudentInput, StudentFilterParams } from '../types/student.types';

export const studentApi = {
  getAll: async (params?: StudentFilterParams): Promise<Student[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.department) query.append('department', params.department);
    if (params?.yearLevel) query.append('yearLevel', params.yearLevel);
    if (params?.status) query.append('status', params.status);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const qs = query.toString();
    const endpoint = `/students${qs ? `?${qs}` : ''}`;
    const res = await api.get<Student[]>(endpoint);
    return res.data;
  },

  getById: async (id: string): Promise<Student> => {
    const res = await api.get<Student>(`/students/${id}`);
    return res.data;
  },

  getDetails: async (id: string): Promise<{ student: Student; enrollments: any[] }> => {
    const res = await api.get<{ student: Student; enrollments: any[] }>(`/students/${id}/details`);
    return res.data;
  },

  create: async (data: CreateStudentInput): Promise<Student> => {
    const res = await api.post<Student>('/students', data);
    return res.data;
  },

  update: async (id: string, data: UpdateStudentInput): Promise<Student> => {
    const res = await api.put<Student>(`/students/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};
