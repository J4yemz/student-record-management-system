import { api } from '../../../shared/api/client';
import { Grade, UpdateGradeInput, GradeFilterParams } from '../types/grade.types';

export const gradeApi = {
  getAll: async (params?: GradeFilterParams): Promise<Grade[]> => {
    const query = new URLSearchParams();
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.courseId) query.append('courseId', params.courseId);
    if (params?.remarks) query.append('remarks', params.remarks);
    if (params?.letterGrade) query.append('letterGrade', params.letterGrade);

    const qs = query.toString();
    const endpoint = `/grades${qs ? `?${qs}` : ''}`;
    const res = await api.get<Grade[]>(endpoint);
    return res.data;
  },

  getById: async (id: string): Promise<Grade> => {
    const res = await api.get<Grade>(`/grades/${id}`);
    return res.data;
  },

  update: async (id: string, data: UpdateGradeInput): Promise<Grade> => {
    const res = await api.put<Grade>(`/grades/${id}`, data);
    return res.data;
  },
};
