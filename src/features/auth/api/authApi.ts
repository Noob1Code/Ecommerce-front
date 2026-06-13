import { httpClient } from '../../../services/api';
import type { PerfilUsuario, UsuarioAutenticado } from '../store/useAuthStore';
import { AUTH_ENDPOINTS } from './authEndpoints';

export interface ClienteRequestDTO {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  cpf: string;
}

export interface ClienteResponseDTO {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  roles: string[];
  cpf: string;
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

export const cadastrarClienteApi = async (entrada: EntradaCadastroCliente): Promise<ResultadoAutenticacao> => {

  const dto: ClienteRequestDTO = {
    nome: entrada.nome,
    email: entrada.email,
    senha: entrada.senha,
    telefone: entrada.telefone || '',
    cpf: entrada.cpf || '',
  };

  await httpClient.post<ClienteResponseDTO>(AUTH_ENDPOINTS.registerCliente, dto);
  const resultadoLogin = await logarUsuarioApi({
    email: entrada.email,
    senha: entrada.senha
  });

  return resultadoLogin;
};

export const cadastrarFuncionarioApi = async (entrada: EntradaCadastroFuncionario): Promise<UsuarioAutenticado> => {

  const dto: FuncionarioRequestDTO = {
    nome: entrada.nome,
    email: entrada.email,
    senha: entrada.senha,
    matricula: entrada.matricula,
    roles: entrada.perfis,
  };

  const resposta = await httpClient.post<FuncionarioResponseDTO>(AUTH_ENDPOINTS.registerFuncionario, dto);

  return {
    id: resposta.data.id,
    nome: resposta.data.nome,
    email: resposta.data.email,
    perfis: resposta.data.roles as PerfilUsuario[],
    matricula: resposta.data.matricula,
  };
};

export const logarUsuarioApi = async (entrada: EntradaLogin): Promise<ResultadoAutenticacao> => {

  const dto: LoginRequestDTO = {
    username: entrada.email,
    password: entrada.senha,
  };

  const resposta = await httpClient.post<TokenResponseDTO>(AUTH_ENDPOINTS.login, dto);

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