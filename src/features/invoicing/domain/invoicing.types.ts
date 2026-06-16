
export interface BackendPedidoUsuarioDTO {
  id: string;
  nome: string;
  email: string;
  documento: string;
  tipoUsuario: string;
  ativo: boolean;
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
  cliente: BackendPedidoUsuarioDTO;
  status: string;
  valorTotal: number;
  criadoEm: string; 
  itens: BackendItemPedidoDetalhadoResponseDTO[];
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'UNKNOWN';

export interface Customer {
  id: string;
  name: string;
  email: string;
  document: string;
  userType: string;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  skuId: string;
  productName: string;
  skuCode: string;
  details: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customer: Customer;
  status: OrderStatus;
  createdAt: string;
  totalValue: number;
  items: OrderItem[];
}