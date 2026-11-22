import { api } from '../../../shared/api/client';
import { Enrollment, CreateEnrollmentInput, EnrollmentFilterParams } from '../types/enrollment.types';

export const enrollmentApi = {
  getAll: async (params?: EnrollmentFilterParams): Promise<Enrollment[]> => {
    const query = new URLSearchParams();
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.courseId) query.append('courseId', params.courseId);
    if (params?.semester) query.append('semester', params.semester);
    if (params?.academicYear) query.append('academicYear', params.academicYear);
    if (params?.status) query.append('status', params.status);

    const qs = query.toString();
    const endpoint = `/enrollments${qs ? `?${qs}` : ''}`;
    const res = await api.get<Enrollment[]>(endpoint);
    return res.data;
  },

  create: async (data: CreateEnrollmentInput): Promise<Enrollment> => {
    const res = await api.post<Enrollment>('/enrollments', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateEnrollmentInput>): Promise<Enrollment> => {
    const res = await api.put<Enrollment>(`/enrollments/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/enrollments/${id}`);
  },
};
