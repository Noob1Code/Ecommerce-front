import { httpClient, ENDPOINTS } from '../../../services/api';
import type { ApiProductDTO } from '../domain/product.types';
import { mockProducts } from '../../catalog/api/mockData';

const USE_MOCKS = true;
const DELAY_MS = 800;

export const fetchProductById = async (id: string): Promise<ApiProductDTO> => {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === id);
        if (product) {
          resolve(product as ApiProductDTO);
        } else {
          reject(new Error('Product not found'));
        }
      }, DELAY_MS);
    });
  }

  const response = await httpClient.get<ApiProductDTO>(ENDPOINTS.products.detail(id));
  return response.data;
};