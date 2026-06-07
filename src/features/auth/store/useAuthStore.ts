import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PerfilUsuario = 
  | 'ROLE_CLIENTE'
  | 'ROLE_ADMIN'
  | 'ROLE_ESTOQUE'
  | 'ROLE_ENTREGA'
  | 'ROLE_FATURAMENTO';

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  perfis: PerfilUsuario[];
  matricula?: string;
  cpf?: string;
}

interface EstadoAutenticacao {
  token: string | null;
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  fazerLogin: (token: string, usuario: UsuarioAutenticado) => void;
  fazerLogout: () => void;
}

const armazenamentoOfuscadoBase64 = {
  getItem: (nome: string): string | null => {
    const valorOfuscado = localStorage.getItem(nome);
    if (!valorOfuscado) return null;
    
    try {
      return atob(valorOfuscado);
    } catch {
      return null;
    }
  },
  
  setItem: (nome: string, valor: string): void => {
    const valorOfuscado = btoa(valor);
    localStorage.setItem(nome, valorOfuscado);
  },
  
  removeItem: (nome: string): void => {
    localStorage.removeItem(nome);
  },
};

export const useAuthStore = create<EstadoAutenticacao>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      estaAutenticado: false,
      
      fazerLogin: (token, usuario) => set({ 
        token, 
        usuario, 
        estaAutenticado: true 
      }),
      
      fazerLogout: () => set({ 
        token: null, 
        usuario: null, 
        estaAutenticado: false 
      }),
    }),
    {
      name: 'ecommerce-auth-storage',
      storage: {
        getItem: (nome) => {
          const estadoStr = armazenamentoOfuscadoBase64.getItem(nome);
          return estadoStr ? JSON.parse(estadoStr) : null;
        },
        setItem: (nome, valor) => {
          armazenamentoOfuscadoBase64.setItem(nome, JSON.stringify(valor));
        },
        removeItem: (nome) => armazenamentoOfuscadoBase64.removeItem(nome),
      },
    }
  )
);