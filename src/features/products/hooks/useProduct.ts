import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api/productsApi';
import type { Product } from '../types';

export const useProduct = (id: string) => {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, 
  });
};