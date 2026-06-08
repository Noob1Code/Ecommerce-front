import { useAuthStore } from '../../auth/store/useAuthStore';

export interface PedidoItemPayload {
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  imagemUrl: string;
}

export interface PedidoResponseDTO {
  id: string;
  data: string;
  valorTotal: number;
  status: 'Pendente' | 'Pago' | 'Em Separação' | 'Faturado' | 'Em Entrega' | 'Entregue' | 'Cancelado';
  itens: PedidoItemPayload[];
}

const historicoPedidosMock: PedidoResponseDTO[] = [
  {
    id: 'PED-2026-8812',
    data: '2026-06-01T14:30:00Z',
    valorTotal: 349.90,
    status: 'Entregue',
    itens: [
      { produtoId: 'p1', nome: 'Teclado Mecânico RGB Modular', quantidade: 1, precoUnitario: 249.90, imagemUrl: '/fallback-image.jpg' },
      { produtoId: 'p2', nome: 'Mouse Pad Speed Extended', quantidade: 1, precoUnitario: 100.00, imagemUrl: '/fallback-image.jpg' }
    ]
  },
  {
    id: 'PED-2026-9954',
    data: '2026-06-07T10:15:00Z',
    valorTotal: 599.00,
    status: 'Em Entrega',
    itens: [
      { produtoId: 'p3', nome: 'Headset Gamer Wireless 7.1', quantidade: 1, precoUnitario: 599.00, imagemUrl: '/fallback-image.jpg' }
    ]
  }
];

export const customerApi = {
  obterPerfil: async (usuarioId: string) => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  atualizarPerfil: async (usuarioId: string, dados: { nome: string; email: string; telefone?: string; cpf?: string }) => {
    return new Promise<void>((resolve) => setTimeout(resolve, 400));
  },

  obterMeusPedidos: async (): Promise<PedidoResponseDTO[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(historicoPedidosMock), 400);
    });
  }
};