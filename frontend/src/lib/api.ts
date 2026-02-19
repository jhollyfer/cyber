import axios from 'axios';
import { env } from '@/env';
import { useAuthStore } from '@/stores/authentication';

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/ranking'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!PUBLIC_PATHS.includes(currentPath)) {
          useAuthStore.getState().clear();
          window.location.href = '/sign-in';
        }
      }
    }
    return Promise.reject(error);
  },
);
