import { api } from '../../../shared/api/client';
import { DashboardStats } from '../types/dashboard.types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },
};
