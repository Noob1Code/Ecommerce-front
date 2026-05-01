import axios from 'axios';

// The baseURL is prepared for your future Spring Boot application
// We use import.meta.env to allow overriding via .env files in the future
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // TODO: In the future, we will inject the JWT token here from Zustand global state
    // Example: 
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling logic can be placed here
    // Example: If 401, dispatch a logout action and redirect to /login
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access. Redirecting to login...');
    }
    return Promise.reject(error);
  }
);