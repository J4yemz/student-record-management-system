export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type ViewTab = 'dashboard' | 'students' | 'courses' | 'enrollments' | 'grades';
