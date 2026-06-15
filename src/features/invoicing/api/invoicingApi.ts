import { httpClient } from '../../../services/api/httpClient'; //
import type { BackendPedidoDetalhadoResponseDTO } from '../domain/invoicing.types';
import { ORDERS_ENDPOINTS } from './invoicingEndpoints';

export const ordersApi = {
  obterTodosPedidos: async (): Promise<BackendPedidoDetalhadoResponseDTO[]> => {
    const response = await httpClient.get<BackendPedidoDetalhadoResponseDTO[]>(ORDERS_ENDPOINTS.allOrders);
    return response.data;
  },
};

export type { BackendPedidoDetalhadoResponseDTO };