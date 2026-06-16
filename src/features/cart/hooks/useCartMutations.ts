import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';

export interface CartQuantityPayload {
  variationId: string;
  quantity: number;
}

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async ({ variationId, quantity }: CartQuantityPayload) => {
      return cartApi.adicionarItemAoCarrinho(variationId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const incrementItemMutation = useMutation({
    mutationFn: async (variationId: string) => {
      return cartApi.incrementarItemNoCarrinho(variationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const decrementItemMutation = useMutation({
    mutationFn: async (variationId: string) => {
      return cartApi.decrementarItemNoCarrinho(variationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (variationId: string) => {
      return cartApi.removerItemDoCarrinho(variationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return cartApi.limparCarrinhoNoServidor();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    addToCartMutation,
    incrementItemMutation,
    decrementItemMutation,
    removeFromCartMutation,
    clearCartMutation,
  };
};