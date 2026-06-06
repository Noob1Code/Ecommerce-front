import { useQuery } from '@tanstack/react-query';
import { fetchProductByIdFromApi } from '../api/productsApi';
import { mapApiToProduct, type BackendProductDetailedPayload } from '../domain/product.mapper';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import type { Product } from '../domain/product.types';

export const useProduct = (id: string | undefined) => {
  const { data, isLoading, error } = useQuery<Product | null, Error>({
    queryKey: PRODUCTS_QUERY_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const rawProductPayload = await fetchProductByIdFromApi(id);
      
      return mapApiToProduct(rawProductPayload as unknown as BackendProductDetailedPayload);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    product: data,
    isLoading,
    error: error ? error.message : null,
  };
};