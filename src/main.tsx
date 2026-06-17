import { AxiosError } from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { useAuthStore } from './features/auth/store/useAuthStore';
import type { ApiErrorResponse } from './services/api/api.types';
import { httpClient } from './services/api/httpClient';
import './styles/index.css';

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
        console.warn('Sessão expirada ou não autorizada. Limpando credenciais...');
        useAuthStore.getState().fazerLogout();
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