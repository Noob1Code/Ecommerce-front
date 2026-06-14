import { httpClient } from '../../../services/api';
import type { ClienteResponseDTO, FuncionarioResponseDTO } from '../../auth';
import { CUSTOMER_ENDPOINTS } from './customerEndpoints';

export interface PerfilExibicao {
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  matricula?: string;
}

export interface DadosAtualizacaoPerfil {
  nome: string;
  email: string;
  senha?: string;
  matricula?: string;
  perfis?: string[];
  telefone?: string;
  cpf?: string;
}

export interface BackendPedidoClienteExibicaoDTO {
  id: string;
  nome: string;
  cpf: string;
}

export interface BackendPedidoVariacaoExibicaoDTO {
  id: string;
  nomeProduto: string;
  sku: string;
  detalhes: string;
}

export interface BackendItemPedidoDetalhadoResponseDTO {
  id: string;
  variacao: BackendPedidoVariacaoExibicaoDTO;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface BackendPedidoDetalhadoResponseDTO {
  id: string;
  cliente: BackendPedidoClienteExibicaoDTO;
  status: string;
  valorTotal: number;
  criadoEm: string;
  itens: BackendItemPedidoDetalhadoResponseDTO[];
}

export interface ClienteAdminRequestDTO {
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
  cpf: string;
}

export interface FuncionarioAdminRequestDTO {
  nome: string;
  email: string;
  senha?: string;
  matricula: string;
  roles: string[];
}

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
    const senhaSubmissao = dados.senha || 'Mudar@123';

    if ('matricula' in dados && dados.matricula) {
      const payload = { nome: dados.nome, email: dados.email, senha: senhaSubmissao, matricula: dados.matricula, roles: dados.perfis };
      await httpClient.put(`${CUSTOMER_ENDPOINTS.funcionario}/${usuarioId}`, payload);
    } else {
      const payload = { nome: dados.nome, email: dados.email, telefone: dados.telefone || '', senha: senhaSubmissao, cpf: dados.cpf || '' };
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