import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productsApi';
import type { Product } from '../types';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};