import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import type { ApiErrorResponse } from './api.types';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.warn('Session expired or unauthorized. Logging out...');
        useAuthStore.getState().logout();
        window.location.replace('/login');
      }

      if (data && data.message) {
        return Promise.reject(new Error(data.message));
      }
    }
    
    // Fallback error
    return Promise.reject(error);
  }
);