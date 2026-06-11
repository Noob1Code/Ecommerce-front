import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createProductInApi, 
  createSkuVariationInApi, 
  type ProductRequestDTO, 
  type ProductVariationRequestDTO 
} from '../api/productsApi';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';

export const useProductMutations = () => {
  const queryClient = useQueryClient();
  const createProductMutation = useMutation({
    mutationFn: async (payload: ProductRequestDTO) => {
      return createProductInApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
    },
  });

  const createSkuMutation = useMutation({
    mutationFn: async ({ productId, payload }: { productId: string; payload: ProductVariationRequestDTO }) => {
      return createSkuVariationInApi(productId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
    },
  });

  return {
    createProductMutation,
    createSkuMutation,
  };
};