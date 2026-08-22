export interface AuthUser {
  id?: number;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: AuthUser;
  status?: string;
  data?: {
    data?: string;
  };
}
