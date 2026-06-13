import { httpClient } from '../../../services/api';
import { CART_ENDPOINTS } from './cartEndpoints';

export interface BackendItemCarrinhoRequestDTO {
  variacaoId: string;
  quantidade: number;
}

export interface BackendItemCarrinhoResponseDTO {
  id: string;
  quantidade: number;
}

export interface BackendCarrinhoResponseDTO {
  id: string;
  atualizadoEm: string;
  itens: BackendItemCarrinhoResponseDTO[];
}

export const cartApi = {
  adicionarItemAoCarrinho: async (variacaoId: string, quantity: number): Promise<void> => {
    const payload: BackendItemCarrinhoRequestDTO = {
      variacaoId,
      quantidade: quantity
    };

    await httpClient.post<void>(CART_ENDPOINTS.addItems, payload);
  },

  incrementarItemNoCarrinho: async (variacaoId: string): Promise<void> => {
    await httpClient.post<void>(CART_ENDPOINTS.incrementItem(variacaoId));
  },

  decrementarItemNoCarrinho: async (variacaoId: string): Promise<void> => {
    await httpClient.post<void>(CART_ENDPOINTS.decrementItem(variacaoId));
  },

  obterCarrinhoDoServidor: async (): Promise<BackendCarrinhoResponseDTO> => {
    const response = await httpClient.get<BackendCarrinhoResponseDTO>(CART_ENDPOINTS.base);
    return response.data;
  },

  removerItemDoCarrinho: async (variacaoId: string): Promise<void> => {
    await httpClient.delete<void>(CART_ENDPOINTS.removeItem(variacaoId));
  },

  limparCarrinhoNoServidor: async (): Promise<void> => {
    await httpClient.delete<void>(CART_ENDPOINTS.base);
  }
};