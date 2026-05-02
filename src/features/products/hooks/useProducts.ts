import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productsApi';
import { mapApiToProductList } from '../domain/product.mapper';
import type { Product } from '../domain/product.types';
import { QUERY_KEYS } from '../../../services/api';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: QUERY_KEYS.products.all,
    queryFn: async () => {
      // Busca os dados da API e aplica a Camada de Domínio (Mapper)
      const rawData = await fetchProducts();
      return mapApiToProductList(rawData);
    },
  });
};