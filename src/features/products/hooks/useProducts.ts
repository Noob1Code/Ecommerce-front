import { useQuery } from '@tanstack/react-query';
import { fetchProductsFromApi } from '../api/productsApi';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import { mapApiToProduct } from '../domain/product.mapper';
import type { BackendProdutoResponseDTO, Product } from '../domain/product.types';

export const useProducts = () => {
  const { data, isLoading, error } = useQuery<Product[], Error>({
    queryKey: PRODUCTS_QUERY_KEYS.list(),
    queryFn: async () => {
      const rawPayloadList = await fetchProductsFromApi();

      return (rawPayloadList as unknown as BackendProdutoResponseDTO[]).map((rawProduct) =>
        mapApiToProduct(rawProduct)
      );
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: data || [],
    isLoading,
    error: error ? error.message : null,
  };
};