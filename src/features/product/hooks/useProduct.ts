import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api/productApi';
import { mapApiToProduct } from '../domain/product.mapper';
import type { Product } from '../domain/product.types';
import { QUERY_KEYS } from '../../../services/api';

export const useProduct = (productId: string) => {
  return useQuery<Product, Error>({
    queryKey: QUERY_KEYS.products.detail(productId),
    queryFn: async () => {
      const rawData = await fetchProductById(productId);
      return mapApiToProduct(rawData);
    },
    enabled: !!productId,
  });
};