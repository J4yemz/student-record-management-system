import { api } from '../../../shared/api/client';
import { User, LoginCredentials, AuthResponse } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  getDemoAccounts: async (): Promise<User[]> => {
    const res = await api.get<User[]>('/auth/demo-accounts');
    return res.data;
  },
};
