import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 
  | 'ROLE_CLIENTE'
  | 'ROLE_ADMIN'
  | 'ROLE_ESTOQUE'
  | 'ROLE_ENTREGA'
  | 'ROLE_FATURAMENTO';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const base64ObfuscatedStorage = {
  getItem: (name: string): string | null => {
    const obfuscatedValue = localStorage.getItem(name);
    if (!obfuscatedValue) return null;
    
    try {
      return atob(obfuscatedValue);
    } catch {
      return null;
    }
  },
  
  setItem: (name: string, value: string): void => {
    const obfuscatedValue = btoa(value);
    localStorage.setItem(name, obfuscatedValue);
  },
  
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'ecommerce-auth-storage',
      storage: {
        getItem: (name) => {
          const stateStr = base64ObfuscatedStorage.getItem(name);
          return stateStr ? JSON.parse(stateStr) : null;
        },
        setItem: (name, value) => {
          base64ObfuscatedStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => base64ObfuscatedStorage.removeItem(name),
      },
    }
  )
);