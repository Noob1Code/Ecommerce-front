import { httpClient } from '../../../services/api';
import type {
  ClienteRequestDTO,
  ClienteResponseDTO,
  EntradaCadastroCliente,
  EntradaCadastroFuncionario,
  EntradaLogin,
  FuncionarioRequestDTO,
  FuncionarioResponseDTO,
  LoginRequestDTO,
  ResultadoAutenticacao,
  TokenResponseDTO
} from '../domain/auth.types';
import type { PerfilUsuario, UsuarioAutenticado } from '../store/useAuthStore';
import { AUTH_ENDPOINTS } from './authEndpoints';

export const cadastrarClienteApi = async (entrada: EntradaCadastroCliente): Promise<ClienteResponseDTO> => {
  const dto: ClienteRequestDTO = {
    nome: entrada.nome,
    email: entrada.email,
    senha: entrada.senha,
    telefone: entrada.telefone || '',
    cpf: entrada.cpf || '',
  };

  const resposta = await httpClient.post<ClienteResponseDTO>(AUTH_ENDPOINTS.registerCliente, dto);
  return resposta.data;
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