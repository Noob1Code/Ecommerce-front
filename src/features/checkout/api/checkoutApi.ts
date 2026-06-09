import { httpClient } from '../../../services/api';
import { CHECKOUT_ENDPOINTS } from './checkoutEndpoints';

const USAR_MOCKS = true;
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
  if (USAR_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          pedido: {
            id: 'mock-pedido-' + Math.floor(Math.random() * 90000 + 10000),
            clienteId: payload.clienteId,
            status: 'Pendente',
            valorTotal: payload.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0),
            criadoEm: new Date().toISOString(),
            itens: payload.itens.map((item, idx) => ({
              id: 'mock-item-' + idx,
              variacaoId: item.variacaoId,
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
              subtotal: item.precoUnitario * item.quantidade
            }))
          },
          processadoSincronamente: true,
          statusCobranca: 'AGUARDANDO_PAGAMENTO',
          mensagem: 'Pedido gerado com sucesso no ecossistema modular.',
          pixCopiaECola: payload.metodoPagamento === 'PIX' ? '00020101021226830014br.gov.bcb.pix2561mock-pix-copia-e-cola-modular-store-token-key-2026' : null,
          linhaDigitavel: payload.metodoPagamento === 'BOLETO' ? '34191.79001 01043.513184 91020.150008 7 98760000035000' : null
        });
      }, TEMPO_ESPERA_MS);
    });
  }

  const response = await httpClient.post<BackendCheckoutResponseDTO>(CHECKOUT_ENDPOINTS.createOrder, payload);
  return response.data;
};