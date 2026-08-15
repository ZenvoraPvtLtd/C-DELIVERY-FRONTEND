import { apiClient } from '@/lib/api/apiClient';
import { CurrentUser } from '@/types/auth';

export interface AuthResponse {
  user: CurrentUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', { email, password });
    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post<{ data: RefreshResponse }>('/auth/refresh', { refreshToken });
    return response.data;
  },

  async getMe(): Promise<CurrentUser> {
    const response = await apiClient.get<{ data: { user: CurrentUser } }>('/auth/me');
    return response.data.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      console.warn('Logout API failed, ignoring locally');
    }
  }
};
