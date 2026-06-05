import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../services/api/queryKeys';
import { fetchProductsFromApi } from '../api/productsApi';
import { mapApiToProduct } from '../domain/product.mapper';
import type { BackendProdutoResponseDTO, Product } from '../domain/product.types';

export const useProducts = () => {
  const { data, isLoading, error } = useQuery<Product[], Error>({
    queryKey: QUERY_KEYS.products.list(),
    queryFn: async () => {
      const rawPayloadList = await fetchProductsFromApi();
      
      // Converte a lista crua vinda da API aplicando as regras de entidade e tradução idiomática
      return rawPayloadList.map((rawProduct) => 
        mapApiToProduct(
          rawProduct as unknown as BackendProdutoResponseDTO, 
          rawProduct.variacoes
        )
      );
    },
    staleTime: 1000 * 60 * 5, // Cache conservador de 5 minutos para dados de catálogo
  });

  return {
    products: data || [],
    isLoading,
    error: error ? error.message : null,
  };
};