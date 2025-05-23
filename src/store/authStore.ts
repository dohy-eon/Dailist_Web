import { create } from 'zustand';
import { AuthState, LoginCredentials, SocialLoginOptions, User } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  socialLogin: (options: SocialLoginOptions) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        username: credentials.email.split('@')[0],
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: '로그인에 실패했습니다.', isLoading: false });
    }
  },

  socialLogin: async (options) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        username: 'social_user',
        provider: options.provider,
        createdAt: new Date().toISOString(),
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: '소셜 로그인에 실패했습니다.', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
