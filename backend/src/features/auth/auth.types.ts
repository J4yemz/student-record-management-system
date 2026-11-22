export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  studentId?: string;
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string;
  studentId?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
