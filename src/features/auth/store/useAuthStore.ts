import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Explicit User Roles matching the backend modular monolith Role enum contracts
 */
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
    }
  )
);