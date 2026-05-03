import { httpClient, ENDPOINTS } from '../../../services/api';
import type { ApiProductDTO } from '../../product/domain/product.types';
import { mockProducts } from './mockData';
import type { CatalogFilters } from '../domain/catalog.types';

const USE_MOCKS = true;
const DELAY_MS = 600; // Um pouco mais rápido para a busca parecer responsiva

export const fetchCatalog = async (filters?: CatalogFilters): Promise<ApiProductDTO[]> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockProducts];

        // Simula a filtragem de busca (search) no backend
        if (filters?.search) {
          const lowerQuery = filters.search.toLowerCase();
          results = results.filter(
            (p) =>
              p.name.toLowerCase().includes(lowerQuery) ||
              p.description.toLowerCase().includes(lowerQuery)
          );
        }

        // Simula a filtragem de categoria no backend
        if (filters?.category) {
           results = results.filter((p: any) => p.category === filters.category);
        }

        resolve(results as ApiProductDTO[]);
      }, DELAY_MS);
    });
  }

  // Implementação da API Real: O Axios converte automaticamente o objeto em parâmetros de URL
  // ex: /api/products?search=fone&category=electronics
  const response = await httpClient.get<ApiProductDTO[]>(ENDPOINTS.products.base, {
    params: filters,
  });
  
  return response.data;
};