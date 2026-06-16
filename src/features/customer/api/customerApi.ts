import { httpClient } from '../../../services/api';
import type { ClienteResponseDTO, FuncionarioResponseDTO } from '../../auth';
import { CustomerMapper } from '../domain/customer.mapper';
import type {
  BackendPedidoDetalhadoResponseDTO,
  ClienteAdminRequestDTO,
  DadosAtualizacaoPerfil,
  FuncionarioAdminRequestDTO,
  PerfilExibicao
} from '../domain/customer.types';
import { CUSTOMER_ENDPOINTS } from './customerEndpoints';

export const customerApi = {
  obterPerfil: async (usuarioId: string, ehCliente: boolean): Promise<PerfilExibicao> => {
    if (ehCliente) {
      const resposta = await httpClient.get<ClienteResponseDTO>(`${CUSTOMER_ENDPOINTS.cliente}/${usuarioId}`);
      return { nome: resposta.data.nome, email: resposta.data.email, telefone: resposta.data.telefone, cpf: resposta.data.cpf };
    } else {
      const resposta = await httpClient.get<FuncionarioResponseDTO>(`${CUSTOMER_ENDPOINTS.funcionario}/${usuarioId}`);
      return { nome: resposta.data.nome, email: resposta.data.email, matricula: resposta.data.matricula };
    }
  },

  atualizarPerfil: async (usuarioId: string, dados: DadosAtualizacaoPerfil): Promise<void> => {
    if ('matricula' in dados && dados.matricula) {
      const payload = CustomerMapper.toFuncionarioUpdatePayload(dados);
      await httpClient.put(`${CUSTOMER_ENDPOINTS.funcionario}/${usuarioId}`, payload);
    } else {
      const payload = CustomerMapper.toClienteUpdatePayload(dados);
      await httpClient.put(`${CUSTOMER_ENDPOINTS.cliente}/${usuarioId}`, payload);
    }
  },

  obterMeusPedidos: async (): Promise<BackendPedidoDetalhadoResponseDTO[]> => {
    const response = await httpClient.get<BackendPedidoDetalhadoResponseDTO[]>(CUSTOMER_ENDPOINTS.orders);
    return response.data;
  },

  obterTodosPedidos: async (): Promise<BackendPedidoDetalhadoResponseDTO[]> => {
    const response = await httpClient.get<BackendPedidoDetalhadoResponseDTO[]>(CUSTOMER_ENDPOINTS.allOrders);
    return response.data;
  },

  listarClientesParaAdmin: async (): Promise<ClienteResponseDTO[]> => {
    const response = await httpClient.get<ClienteResponseDTO[]>(CUSTOMER_ENDPOINTS.cliente);
    return response.data;
  },

  atualizarClientePorAdmin: async (id: string, payload: ClienteAdminRequestDTO): Promise<ClienteResponseDTO> => {
    const response = await httpClient.put<ClienteResponseDTO>(`${CUSTOMER_ENDPOINTS.cliente}/${id}`, payload);
    return response.data;
  },

  alterarStatusClientePorAdmin: async (id: string): Promise<void> => {
    await httpClient.patch<void>(`${CUSTOMER_ENDPOINTS.cliente}/${id}/delete`);
  },

  listarFuncionariosParaAdmin: async (): Promise<FuncionarioResponseDTO[]> => {
    const response = await httpClient.get<FuncionarioResponseDTO[]>(CUSTOMER_ENDPOINTS.funcionario);
    return response.data;
  },

  criarFuncionarioPorAdmin: async (payload: FuncionarioAdminRequestDTO): Promise<FuncionarioResponseDTO> => {
    const response = await httpClient.post<FuncionarioResponseDTO>(CUSTOMER_ENDPOINTS.funcionario, payload);
    return response.data;
  },

  atualizarFuncionarioPorAdmin: async (id: string, payload: FuncionarioAdminRequestDTO): Promise<FuncionarioResponseDTO> => {
    const response = await httpClient.put<FuncionarioResponseDTO>(`${CUSTOMER_ENDPOINTS.funcionario}/${id}`, payload);
    return response.data;
  },

  alterarStatusFuncionarioPorAdmin: async (id: string): Promise<void> => {
    await httpClient.patch<void>(`${CUSTOMER_ENDPOINTS.funcionario}/${id}/delete`);
  }
};

export type { BackendPedidoDetalhadoResponseDTO, ClienteAdminRequestDTO, FuncionarioAdminRequestDTO };