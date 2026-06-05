import { httpClient } from '../../../services/api';
import type { BackendProdutoResponseDTO } from '../domain/product.types';
import { mockBackendProducts, type BackendProdutoDetalhadoPayload } from './mockData';

/**
 * Architecture Governance Flag
 * Set to 'true' for standalone mock development mode.
 * Toggle to 'false' to immediately route traffic to your friend's live Spring Boot backend.
 */
const USE_MOCKS = true;
const DELAY_MS = 500;

/**
 * Fetches all active product containers from the catalog domain.
 * Production Route: GET /api/produto
 */
export const fetchProductsFromApi = async (): Promise<BackendProdutoDetalhadoPayload[]> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBackendProducts), DELAY_MS);
    });
  }

  const response = await httpClient.get<BackendProdutoDetalhadoPayload[]>('/api/produto');
  return response.data;
};

/**
 * Fetches a single product container with its embedded configuration variants by ID.
 * Production Route: GET /api/produto/{id}
 */
export const fetchProductByIdFromApi = async (id: string): Promise<BackendProdutoDetalhadoPayload> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockBackendProducts.find((p) => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product container not found'));
        }
      }, DELAY_MS);
    });
  }

  const response = await httpClient.get<BackendProdutoDetalhadoPayload>(`/api/produto/${id}`);
  return response.data;
};

/**
 * Updates a product container's core metadata properties (Name and Description).
 * Maps directly to the backend's ProdutoRequestDTO contract structure.
 * Production Route: PUT /api/produto/{id}
 */
export const updateProductMetadataInApi = async (id: string, name: string, description: string): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockBackendProducts.find((p) => p.id === id);
        if (product) {
          product.nome = name;
          product.descricao = description;
          resolve();
        } else {
          reject(new Error('Product container not found for metadata update'));
        }
      }, 300);
    });
  }

  await httpClient.put(`/api/produto/${id}`, {
    nome: name,
    descricao: description,
    atributosIds: []
  });
};

/**
 * Updates a specific variation SKU inventory quantity factor.
 * Maps directly to the backend's ProdutoVariacaoRequestDTO contract structure.
 * Production Route: PUT /api/produto/variacao/{id}
 */
export const updateSkuStockInApi = async (skuId: string, newStock: number): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let isUpdated = false;
        mockBackendProducts.forEach((product) => {
          const skuMatch = product.variacoes.find((v) => v.id === skuId);
          if (skuMatch) {
            skuMatch.estoque = newStock;
            isUpdated = true;
          }
        });

        if (isUpdated) {
          resolve();
        } else {
          reject(new Error('SKU identifier reference not found inside mock storage'));
        }
      }, 200);
    });
  }

  await httpClient.put(`/api/produto/variacao/${skuId}`, { estoque: newStock });
};

/**
 * Performs a logical soft delete / inactivation on a parent product container.
 * Production Route: PATCH /api/produto/{id}/delete
 */
export const deleteProductInApi = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockBackendProducts.findIndex((p) => p.id === id);
        if (index !== -1) {
          mockBackendProducts[index].ativo = false;
        }
        resolve();
      }, 300);
    });
  }

  await httpClient.patch(`/api/produto/${id}/delete`);
};

/**
 * Performs a physical hard delete / permanent erasure on a specific SKU variation row item.
 * Production Route: DELETE /api/produto/variacao/{id}
 */
export const deleteSkuInApi = async (skuId: string): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let isDeleted = false;
        mockBackendProducts.forEach((product) => {
          const variantIndex = product.variacoes.findIndex((v) => v.id === skuId);
          if (variantIndex !== -1) {
            product.variacoes.splice(variantIndex, 1);
            isDeleted = true;
          }
        });

        if (isDeleted) {
          resolve();
        } else {
          reject(new Error('SKU identifier not found for physical erasure'));
        }
      }, 250);
    });
  }

  await httpClient.delete(`/api/produto/variacao/${skuId}`);
};