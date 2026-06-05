import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../services/api/queryKeys';
import { fetchProductByIdFromApi } from '../api/productsApi';
import { mapApiToProduct } from '../domain/product.mapper';
import type { BackendProdutoResponseDTO, Product } from '../domain/product.types';

export const useProduct = (id: string | undefined) => {
  const { data, isLoading, error } = useQuery<Product | null, Error>({
    queryKey: QUERY_KEYS.products.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const rawProductPayload = await fetchProductByIdFromApi(id);
      
      // Executa o mapeamento passando as variações embutidas no mesmo objeto
      return mapApiToProduct(
        rawProductPayload as unknown as BackendProdutoResponseDTO, 
        rawProductPayload.variacoes
      );
    },
    enabled: !!id, // Previne disparar requisições se o ID for indefinido
    staleTime: 1000 * 60 * 5,
  });

  return {
    product: data,
    isLoading,
    error: error ? error.message : null,
  };
};