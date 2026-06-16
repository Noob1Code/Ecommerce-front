import { httpClient } from '../../../services/api';
import type { BackendCheckoutResponseDTO, BackendPedidoRequestDTO } from '../domain/checkout.types';
import { CHECKOUT_ENDPOINTS } from './checkoutEndpoints';

export const createOrderApi = async (payload: BackendPedidoRequestDTO): Promise<BackendCheckoutResponseDTO> => {
  const response = await httpClient.post<BackendCheckoutResponseDTO>(CHECKOUT_ENDPOINTS.base, payload);
  return response.data;
};