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

const mapRawUserToCurrentUser = (rawUser: any): CurrentUser => {
  if (!rawUser) {
    return {
      userId: '',
      name: '',
      role: 'SUPER_ADMIN',
      permissions: []
    };
  }
  return {
    userId: rawUser.userId || rawUser.id || '',
    name: rawUser.name || '',
    role: rawUser.role || 'SUPER_ADMIN',
    permissions: rawUser.permissions || []
  };
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: { user: any; accessToken: string; refreshToken: string } }>('/auth/login', { email, password });
    return {
      user: mapRawUserToCurrentUser(response.data?.user),
      accessToken: response.data?.accessToken || '',
      refreshToken: response.data?.refreshToken || ''
    };
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post<{ data: RefreshResponse }>('/auth/refresh', { refreshToken });
    return response.data;
  },

  async getMe(): Promise<CurrentUser> {
    const response = await apiClient.get<{ data: { user: any } }>('/auth/me');
    return mapRawUserToCurrentUser(response.data?.user);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      console.warn('Logout API failed, ignoring locally');
    }
  }
};
