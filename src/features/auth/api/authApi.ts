import { httpClient } from '../../../services/api';
import type { AuthUser } from '../store/useAuthStore';

// Toggle this to false once your friend turns on the Java backend module
const USE_MOCKS = true;
const DELAY_MS = 800;

export interface BackendRegisterRequestDTO {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
}

export interface BackendRegisterResponseDTO {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  roles: string[];
}

export interface BackendLoginRequestDTO {
  username: string;
  password: string;
}

export interface BackendTokenResponseDTO {
  token: string;
  id: string;
  nome: string;
  roles: string[];
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  cpf?: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export const registerCustomerApi = async (input: RegisterInput): Promise<AuthUser> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock-generated-customer-id',
          name: input.name,
          email: input.email,
          roles: ['ROLE_CLIENTE'],
        });
      }, DELAY_MS);
    });
  }

  const dto: BackendRegisterRequestDTO = {
    nome: input.name,
    email: input.email,
    senha: input.password,
    cpf: input.cpf,
    telefone: input.phone,
  };

  const response = await httpClient.post<BackendRegisterResponseDTO>(
    '/auth/register', 
    dto
  );

  return {
    id: response.data.id,
    name: response.data.nome,
    email: response.data.email,
    roles: response.data.roles as any[],
  };
};

export const loginUserApi = async (input: LoginInput): Promise<LoginResult> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple client-side mock validation shortcut
        if (input.email.includes('admin')) {
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_admin_token',
            user: {
              id: 'mock-admin-id',
              name: 'Administrator Master',
              email: input.email,
              roles: ['ROLE_ADMIN'],
            }
          });
        } else if (input.email.includes('vendedor') || input.email.includes('estoque')) {
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_staff_token',
            user: {
              id: 'mock-staff-id',
              name: 'Operador de Estoque',
              email: input.email,
              roles: ['ROLE_ESTOQUE'],
            }
          });
        } else {
          // Default fallthrough resolves as standard buyer customer profile
          resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_customer_token',
            user: {
              id: 'mock-customer-id',
              name: 'John Customer Doe',
              email: input.email,
              roles: ['ROLE_CLIENTE'],
            }
          });
        }
      }, DELAY_MS);
    });
  }

  const dto: BackendLoginRequestDTO = {
    username: input.email,
    password: input.password,
  };

  const response = await httpClient.post<BackendTokenResponseDTO>(
    '/auth/login',
    dto
  );

  return {
    token: response.data.token,
    user: {
      id: response.data.id,
      name: response.data.nome,
      email: input.email,
      roles: response.data.roles as any[],
    },
  };
};