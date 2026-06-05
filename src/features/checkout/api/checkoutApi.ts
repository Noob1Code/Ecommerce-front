import { httpClient } from '../../../services/api';
import { CHECKOUT_ENDPOINTS } from './checkoutEndpoints';

const USE_MOCKS = true;

export interface BackendItemPedidoRequestDTO {
  variacaoId: string;
  quantidade: number;
}

export interface BackendPedidoRequestDTO {
  clienteId: string;
  itens: BackendItemPedidoRequestDTO[];
}

export const createOrderApi = async (payload: BackendPedidoRequestDTO): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }

  await httpClient.post(CHECKOUT_ENDPOINTS.createOrder, payload);
};