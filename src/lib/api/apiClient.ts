import { env } from '@/config/env';
import { ApiError, ApiErrorCategory } from './ApiError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

const mapStatusToCategory = (status: number): ApiErrorCategory => {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 400 || status === 422) return 'VALIDATION_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN_ERROR';
};

const getAuthHeaders = (): HeadersInit => {
  // Frontend implementation for auth goes here later
  return {};
};

export const apiClient = {
  async request<T>(endpoint: string, method: HttpMethod, data?: any, options?: RequestOptions): Promise<T> {
    if (env.dataMode === 'mock') {
      console.warn(`[apiClient] Called in mock mode for ${endpoint}. This shouldn't happen if repositories are configured correctly.`);
    }

    const url = `${env.apiBaseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...getAuthHeaders(),
      ...(options?.headers || {})
    };

    const config: RequestInit = {
      method,
      headers,
      ...options
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const timeout = options?.timeoutMs || 15000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(id);

      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }

        const category = mapStatusToCategory(response.status);
        const message = errorData?.error?.message || errorData?.message || 'An unexpected error occurred';
        throw new ApiError(response.status, message, category, errorData?.error?.details || errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json() as T;

    } catch (error: any) {
      clearTimeout(id);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timed out. Please check your connection and try again.', 'NETWORK_ERROR');
      }

      throw new ApiError(0, 'Unable to connect to the server. Please verify your network connection.', 'NETWORK_ERROR');
    }
  },

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, 'GET', undefined, options);
  },

  post<T>(endpoint: string, data: any, options?: RequestOptions) {
    return this.request<T>(endpoint, 'POST', data, options);
  },

  put<T>(endpoint: string, data: any, options?: RequestOptions) {
    return this.request<T>(endpoint, 'PUT', data, options);
  },

  patch<T>(endpoint: string, data: any, options?: RequestOptions) {
    return this.request<T>(endpoint, 'PATCH', data, options);
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
};
