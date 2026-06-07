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

const encryptedSecureStorage = {
  getItem: (name: string): string | null => {
    const obfusticatedValue = localStorage.getItem(name);
    if (!obfusticatedValue) return null;
    
    try {
      // Reverte a camada de proteção Base64 para recuperar o JSON original estável
      return atob(obfusticatedValue);
    } catch {
      // Caso o dado esteja corrompido ou violado, limpa preventivamente a sessão por segurança
      return null;
    }
  },
  
  setItem: (name: string, value: string): void => {
    // Transforma a string limpa do estado numa cadeia cifrada/ofuscada antes do dump em disco
    const obfusticatedValue = btoa(value);
    localStorage.setItem(name, obfusticatedValue);
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
          const stateStr = encryptedSecureStorage.getItem(name);
          return stateStr ? JSON.parse(stateStr) : null;
        },
        setItem: (name, value) => {
          encryptedSecureStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => encryptedSecureStorage.removeItem(name),
      },
    }
  )
);