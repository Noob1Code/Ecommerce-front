import { httpClient, ENDPOINTS } from '../../../services/api';
import type { BackendProdutoResponseDTO } from '../domain/product.types';
import { mockBackendProducts, type BackendProdutoDetalhadoPayload } from './mockData';

const USE_MOCKS = true;
const DELAY_MS = 600;

export const fetchProductsFromApi = async (): Promise<BackendProdutoDetalhadoPayload[]> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBackendProducts), DELAY_MS);
    });
  }

  const response = await httpClient.get<BackendProdutoDetalhadoPayload[]>(
    `${ENDPOINTS.products.base}?embed=variacoes`
  );
  return response.data;
};

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

  const response = await httpClient.get<BackendProdutoDetalhadoPayload>(
    `${ENDPOINTS.products.detail(id)}?embed=variacoes`
  );
  return response.data;
};

/**
 * Persistently updates a SKU stock quantity matching the Java @PutMapping("/{id}") controller
 */
export const updateSkuStockInApi = async (skuId: string, newStock: number): Promise<void> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let isUpdated = false;
        
        // Mutates the underlying simulated database source fields directly
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
          reject(new Error('SKU reference identifier not found inside mock storage'));
        }
      }, 300);
    });
  }

  // Real HTTP execution targeting your friend's exact route endpoint: /api/produto/variacao/{id}
  await httpClient.put(`/api/produto/variacao/${skuId}`, { estoque: newStock });
};