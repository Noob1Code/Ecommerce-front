import { httpClient } from '../../../services/api';
import { CHECKOUT_ENDPOINTS } from './checkoutEndpoints';

const TEMPO_ESPERA_MS = 1000;

export interface BackendItemPedidoRequestDTO {
  variacaoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface BackendPedidoRequestDTO {
  clienteId: string;
  metodoPagamento: string;
  parcelas: number;
  itens: BackendItemPedidoRequestDTO[];
}

export interface BackendItemPedidoCriadoResponseDTO {
  id: string;
  variacaoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface BackendPedidoCriadoResponseDTO {
  id: string;
  clienteId: string;
  status: string;
  valorTotal: number;
  criadoEm: string;
  itens: BackendItemPedidoCriadoResponseDTO[];
}

export interface BackendCheckoutResponseDTO {
  pedido: BackendPedidoCriadoResponseDTO;
  processadoSincronamente: boolean;
  statusCobranca: string;
  mensagem: string;
  pixCopiaECola: string | null;
  linhaDigitavel: string | null;
}

export const createOrderApi = async (payload: BackendPedidoRequestDTO): Promise<BackendCheckoutResponseDTO> => {
  const response = await httpClient.post<BackendCheckoutResponseDTO>(CHECKOUT_ENDPOINTS.base, payload);
  return response.data;
};