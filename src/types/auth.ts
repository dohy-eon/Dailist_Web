export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  provider: 'google' | 'github' | 'email';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SocialLoginOptions {
  provider: 'google' | 'github';
  accessToken: string;
}
