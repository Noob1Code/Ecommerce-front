import { httpClient } from '../../../services/api';
import { CART_ENDPOINTS } from './cartEndpoints';

const USAR_MOCKS = false;
const TEMPO_ESPERA_MS = 400;

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
    if (USAR_MOCKS) {
      return new Promise<void>((resolve) => setTimeout(resolve, TEMPO_ESPERA_MS));
    }

    const payload: BackendItemCarrinhoRequestDTO = {
      variacaoId,
      quantidade: quantity
    };

    await httpClient.post<void>(CART_ENDPOINTS.addItems, payload);
  },

  atualizarQuantidadeNoCarrinho: async (variacaoId: string, quantity: number): Promise<void> => {
    if (USAR_MOCKS) {
      return new Promise<void>((resolve) => setTimeout(resolve, TEMPO_ESPERA_MS));
    }

    const payload: BackendItemCarrinhoRequestDTO = {
      variacaoId,
      quantidade: quantity
    };

    await httpClient.put<void>(CART_ENDPOINTS.addItems, payload);
  },

  obterCarrinhoDoServidor: async (): Promise<BackendCarrinhoResponseDTO> => {
    if (USAR_MOCKS) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'mock-carrinho-id',
            atualizadoEm: new Date().toISOString(),
            itens: []
          });
        }, TEMPO_ESPERA_MS);
      });
    }

    const response = await httpClient.get<BackendCarrinhoResponseDTO>(CART_ENDPOINTS.base);
    return response.data;
  },

  removerItemDoCarrinho: async (variacaoId: string): Promise<void> => {
    if (USAR_MOCKS) {
      return new Promise<void>((resolve) => setTimeout(resolve, TEMPO_ESPERA_MS));
    }

    await httpClient.delete<void>(CART_ENDPOINTS.removeItem(variacaoId));
  },

  limparCarrinhoNoServidor: async (): Promise<void> => {
    if (USAR_MOCKS) {
      return new Promise<void>((resolve) => setTimeout(resolve, TEMPO_ESPERA_MS));
    }

    await httpClient.delete<void>(CART_ENDPOINTS.base);
  }
};