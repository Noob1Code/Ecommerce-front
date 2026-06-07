import { httpClient } from '../../../services/api';
import { AUTH_ENDPOINTS } from './authEndpoints';
import type { UsuarioAutenticado, PerfilUsuario } from '../store/useAuthStore';

const USAR_MOCKS = true;
const TEMPO_ESPERA_MS = 800;

export interface ClienteRequestDTO {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
}

export interface ClienteResponseDTO {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  roles: string[];
  cpf?: string;
  telefone?: string;
}

export interface FuncionarioRequestDTO {
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  roles: string[];
}

export interface FuncionarioResponseDTO {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  roles: string[];
  matricula: string;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface TokenResponseDTO {
  token: string;
  id: string;
  nome: string;
  roles: string[];
}

export interface EntradaCadastroCliente {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
}

export interface EntradaCadastroFuncionario {
  nome: string;
  email: string;
  senha: string;
  matricula: string;
  perfis: PerfilUsuario[];
}

export interface EntradaLogin {
  email: string;
  senha: string;
}

export interface ResultadoAutenticacao {
  token: string;
  usuario: UsuarioAutenticado;
}

export const cadastrarClienteApi = async (entrada: EntradaCadastroCliente): Promise<UsuarioAutenticado> => {
  if (USAR_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock-id-cliente-gerado',
          nome: entrada.nome,
          email: entrada.email,
          perfis: ['ROLE_CLIENTE'],
          cpf: entrada.cpf,
        });
      }, TEMPO_ESPERA_MS);
    });
  }

  const dto: ClienteRequestDTO = {
    nome: entrada.nome,
    email: entrada.email,
    senha: entrada.senha,
    cpf: entrada.cpf,
    telefone: entrada.telefone,
  };

  const resposta = await httpClient.post<ClienteResponseDTO>(
    AUTH_ENDPOINTS.register, 
    dto
  );

  return {
    id: resposta.data.id,
    nome: resposta.data.nome,
    email: resposta.data.email,
    perfis: resposta.data.roles as PerfilUsuario[],
    cpf: resposta.data.cpf,
  };
};

export const cadastrarFuncionarioApi = async (entrada: EntradaCadastroFuncionario): Promise<UsuarioAutenticado> => {
  if (USAR_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock-id-funcionario-gerado',
          nome: entrada.nome,
          email: entrada.email,
          perfis: entrada.perfis,
          matricula: entrada.matricula,
        });
      }, TEMPO_ESPERA_MS);
    });
  }

  const dto: FuncionarioRequestDTO = {
    nome: entrada.nome,
    email: entrada.email,
    senha: entrada.senha,
    matricula: entrada.matricula,
    roles: entrada.perfis,
  };

  const resposta = await httpClient.post<FuncionarioResponseDTO>(
    '/api/funcionarios',
    dto
  );

  return {
    id: resposta.data.id,
    nome: resposta.data.nome,
    email: resposta.data.email,
    perfis: resposta.data.roles as PerfilUsuario[],
    matricula: resposta.data.matricula,
  };
};

export const logarUsuarioApi = async (entrada: EntradaLogin): Promise<ResultadoAutenticacao> => {
  if (USAR_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (entrada.email.includes('admin')) {
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_admin_token',
            usuario: {
              id: 'mock-admin-id',
              nome: 'Administrador Master',
              email: entrada.email,
              perfis: ['ROLE_ADMIN'],
            }
          });
        } else if (entrada.email.includes('vendedor') || entrada.email.includes('estoque')) {
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_staff_token',
            usuario: {
              id: 'mock-staff-id',
              nome: 'Operador de Estoque',
              email: entrada.email,
              perfis: ['ROLE_ESTOQUE'],
            }
          });
        } else {
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_customer_token',
            usuario: {
              id: 'mock-customer-id',
              nome: 'Fulano Cliente da Silva',
              email: entrada.email,
              perfis: ['ROLE_CLIENTE'],
            }
          });
        }
      }, TEMPO_ESPERA_MS);
    });
  }

  const dto: LoginRequestDTO = {
    username: entrada.email,
    password: entrada.senha,
  };

  const resposta = await httpClient.post<TokenResponseDTO>(
    AUTH_ENDPOINTS.login,
    dto
  );

  return {
    token: resposta.data.token,
    usuario: {
      id: resposta.data.id,
      nome: resposta.data.nome,
      email: entrada.email,
      perfis: resposta.data.roles as PerfilUsuario[],
    },
  };
};