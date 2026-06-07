import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AxiosError } from 'axios';
import './styles/index.css';
import App from './App.tsx';
import { httpClient } from './services/api/httpClient';
import { useAuthStore } from './features/auth/store/useAuthStore';
import type { ApiErrorResponse } from './services/api/api.types';

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
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);