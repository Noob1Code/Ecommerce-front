import { httpClient } from '../../../services/api';
import type { ClienteResponseDTO, FuncionarioResponseDTO } from '../../auth';

const USAR_MOCKS = false;
const TEMPO_ESPERA_MS = 500;

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

const historicoPedidosMock: BackendPedidoDetalhadoResponseDTO[] = [
  {
    id: 'b812f205-8888-4663-9999-7da391b10620',
    status: 'Entregue',
    valorTotal: 449.90,
    criadoEm: '2026-06-01T14:30:00Z',
    cliente: { id: 'c1', nome: 'Kayque Cliente', cpf: '123.456.789-00' },
    itens: [
      {
        id: 'item-det-1',
        quantidade: 1,
        precoUnitario: 449.90,
        subtotal: 449.90,
        variacao: {
          id: 'v1',
          nomeProduto: 'Teclado Mecânico Premium RGB',
          sku: 'TEC-RGB-BLK-RED',
          detalhes: 'Cor: Preto | Switch: Red'
        }
      }
    ]
  },
  {
    id: 'a9954f10-7777-4112-8888-9cb523f20740',
    status: 'Pendente',
    valorTotal: 599.00,
    criadoEm: '2026-06-07T10:15:00Z',
    cliente: { id: 'c1', nome: 'Kayque Cliente', cpf: '123.456.789-00' },
    itens: [
      {
        id: 'item-det-2',
        quantidade: 1,
        precoUnitario: 599.00,
        subtotal: 599.00,
        variacao: {
          id: 'v2',
          nomeProduto: 'Headset Gamer Wireless 7.1 Surround',
          sku: 'HDS-WRL-71',
          detalhes: 'Conectividade: Wireless'
        }
      }
    ]
  }
];

export const customerApi = {
  obterPerfil: async (usuarioId: string, ehCliente: boolean): Promise<any> => {
    if (USAR_MOCKS) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (ehCliente) {
            resolve({ nome: 'Kayque Cliente Mock', email: 'kayque@gmail.com', telefone: '(11) 99999-9999', cpf: '123.456.789-00' });
          } else {
            resolve({ nome: 'Operador de Estoque Mock', email: 'cacatua@gmail.com', matricula: 'MAT-2026-XYZ' });
          }
        }, TEMPO_ESPERA_MS);
      });
    }
    if (ehCliente) {
      const resposta = await httpClient.get<ClienteResponseDTO>(`/api/iam/cliente/${usuarioId}`);
      return { nome: resposta.data.nome, email: resposta.data.email, telefone: resposta.data.telefone, cpf: resposta.data.cpf };
    } else {
      const resposta = await httpClient.get<FuncionarioResponseDTO>(`/api/iam/funcionario/${usuarioId}`);
      return { nome: resposta.data.nome, email: resposta.data.email, matricula: resposta.data.matricula };
    }
  },

  atualizarPerfil: async (usuarioId: string, dados: any): Promise<void> => {
    if (USAR_MOCKS) return new Promise<void>((resolve) => setTimeout(resolve, TEMPO_ESPERA_MS));
    const senhaSubmissao = dados.senha || 'Mudar@123';
    if ('matricula' in dados) {
      const payload = { nome: dados.nome, email: dados.email, senha: senhaSubmissao, matricula: dados.matricula, roles: dados.perfis };
      await httpClient.put(`/api/iam/funcionario/${usuarioId}`, payload);
    } else {
      const payload = { nome: dados.nome, email: dados.email, telefone: dados.telefone || '', senha: senhaSubmissao, cpf: dados.cpf || '' };
      await httpClient.put(`/api/iam/cliente/${usuarioId}`, payload);
    }
  },

  obterMeusPedidos: async (): Promise<BackendPedidoDetalhadoResponseDTO[]> => {
    if (USAR_MOCKS) {
      return new Promise((resolve) => setTimeout(() => resolve(historicoPedidosMock), TEMPO_ESPERA_MS));
    }
    const response = await httpClient.get<BackendPedidoDetalhadoResponseDTO[]>('/api/pedido/meus-pedidos');
    return response.data;
  }
};