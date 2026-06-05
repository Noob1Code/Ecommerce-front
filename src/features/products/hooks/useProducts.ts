import { useQuery } from '@tanstack/react-query';
import { fetchProductsFromApi } from '../api/productsApi';
import { mapApiToProduct } from '../domain/product.mapper';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import type { BackendProdutoResponseDTO, Product } from '../domain/product.types';

export const useProducts = () => {
  const { data, isLoading, error } = useQuery<Product[], Error>({
    queryKey: PRODUCTS_QUERY_KEYS.list(),
    queryFn: async () => {
      const rawPayloadList = await fetchProductsFromApi();
      
      return rawPayloadList.map((rawProduct) => 
        mapApiToProduct(
          rawProduct as unknown as BackendProdutoResponseDTO, 
          rawProduct.variacoes
        )
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