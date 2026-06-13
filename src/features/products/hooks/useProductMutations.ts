import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAttributeInApi,
  createProductInApi,
  createSkuVariationInApi,
  deleteAttributeInApi,
  updateAttributeInApi,
  type AttributeRequestDTO,
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

  const createAttributeMutation = useMutation({
    mutationFn: async (payload: AttributeRequestDTO) => {
      return createAttributeInApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
    },
  });

  const updateAttributeMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: AttributeRequestDTO }) => {
      return updateAttributeInApi(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
    },
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteAttributeInApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
    },
  });

  return {
    createProductMutation,
    createSkuMutation,
    createAttributeMutation,
    updateAttributeMutation,
    deleteAttributeMutation,
  };
};