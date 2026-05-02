import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api/productsApi';
import { mapApiToProduct } from '../domain/product.mapper';
import type { Product } from '../domain/product.types';
import { QUERY_KEYS } from '../../../services/api';

export const useProduct = (productId: string) => {
  return useQuery<Product, Error>({
    queryKey: QUERY_KEYS.products.detail(productId),
    queryFn: async () => {
      // Busca os dados da API e aplica a Camada de Domínio (Mapper)
      const rawData = await fetchProductById(productId);
      return mapApiToProduct(rawData);
    },
    enabled: !!productId,
  });
};