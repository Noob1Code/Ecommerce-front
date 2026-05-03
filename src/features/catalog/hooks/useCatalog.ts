import { useQuery } from '@tanstack/react-query';
import { fetchCatalog } from '../api/catalogApi';
import { mapApiToProductList } from '../../product/domain/product.mapper';
import type { Product } from '../../product/domain/product.types';
import { QUERY_KEYS } from '../../../services/api';
import type { CatalogFilters } from '../domain/catalog.types';

export const useCatalog = (filters?: CatalogFilters) => {
  return useQuery<Product[], Error>({
    // Agora o React Query usa o cache correto e isolado para o Catálogo!
    queryKey: QUERY_KEYS.catalog.list(filters),
    queryFn: async () => {
      const rawData = await fetchCatalog(filters);
      return mapApiToProductList(rawData);
    },
  });
};