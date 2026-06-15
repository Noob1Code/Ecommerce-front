import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { useAuthStore } from '../../auth';
import { cartApi } from '../api/cartApi';
import { CartMapper } from '../domain/cart.mapper';
import type { EnrichedCartItem } from '../domain/cart.types';
import { useCartStore } from '../store/useCartStore';
import { useCartMutations } from './useCartMutations';

export const useCartController = () => {
  const navigate = useNavigate();
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const usuario = useAuthStore((state) => state.usuario);
  const showError = useNotificationModalStore((state) => state.showError);
  const showConfirm = useNotificationModalStore((state) => state.showConfirm);

  const {
    addToCartMutation,
    incrementItemMutation,
    decrementItemMutation,
    removeFromCartMutation,
    clearCartMutation
  } = useCartMutations();

  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const possuiPermissaoCompra = usuario?.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  const { data: carrinhoServidor, isLoading: carregandoCarrinho, error: erroServidor } = useQuery({
    queryKey: ['cart', 'server-state', usuario?.id] as const,
    queryFn: cartApi.obterCarrinhoDoServidor,
    enabled: estaAutenticado && !!usuario?.id && !!possuiPermissaoCompra,
    staleTime: 0,
  });

  const enrichedItems = useMemo<EnrichedCartItem[]>(() => {
    return CartMapper.toEnrichedItemsFromServer(carrinhoServidor);
  }, [carrinhoServidor]);

  const isEmpty = enrichedItems.length === 0 && !carregandoCarrinho;

  const totalItemsCount = useMemo(() => {
    return enrichedItems.reduce((total, item) => total + item.quantity, 0);
  }, [enrichedItems]);

  const cartTotal = useMemo(() => {
    return enrichedItems.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  }, [enrichedItems]);

  const formattedCartTotal = useMemo(() => {
    return CartMapper.formatarMoeda(cartTotal);
  }, [cartTotal]);

  const handleAddToCart = (skuId: string, maxStock: number) => {
    if (maxStock <= 0) return;

    const itemExistente = enrichedItems.find((item) => item.skuId === skuId);
    const quantidadeAtual = itemExistente ? itemExistente.quantity : 0;

    if (quantidadeAtual + 1 > maxStock) {
      showError({
        title: 'Limite de Estoque',
        message: `Não foi possível adicionar mais unidades deste item. O teto físico disponível no estoque é de ${maxStock} unidades.`
      });
      return;
    }

    addItem(skuId, maxStock);
    addToCartMutation.mutate({ variationId: skuId, quantity: 1 });
  };

  const handleIncrement = (skuId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity >= maxStock) {
      showError({
        title: 'Quantidade Indisponível',
        message: `Não é possível incrementar o item. O volume em estoque atingiu o teto máximo de ${maxStock} unidades.`
      });
      return;
    }
    const targetQuantity = currentQuantity + 1;
    updateQuantity(skuId, targetQuantity, maxStock);
    incrementItemMutation.mutate(skuId);
  };

  const handleDecrement = (skuId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      handleRemove(skuId);
      return;
    }

    let maxStock = 999999;
    const match = enrichedItems.find((i) => i.skuId === skuId);
    if (match) {
      maxStock = match.selectedSku.stock;
    }

    const targetQuantity = currentQuantity - 1;
    updateQuantity(skuId, targetQuantity, maxStock);
    decrementItemMutation.mutate(skuId);
  };

  const handleRemove = (skuId: string) => {
    removeItem(skuId);
    removeFromCartMutation.mutate(skuId);
  };

  const handleClear = () => {
    showConfirm({
      title: 'Esvaziar Carrinho',
      message: 'Tem certeza de que deseja remover permanentemente todos os produtos selecionados da sua sacola?',
      onConfirm: () => {
        clearCart();
        clearCartMutation.mutate();
      }
    });
  };

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  return {
    items: enrichedItems,
    isEmpty,
    isLoading: carregandoCarrinho ||
      addToCartMutation.isPending ||
      incrementItemMutation.isPending ||
      decrementItemMutation.isPending ||
      removeFromCartMutation.isPending ||
      clearCartMutation.isPending,
    error: erroServidor ? 'Não foi possível ler os itens da sua sacola de compras.' : null,
    totalItemsCount,
    cartTotal,
    formattedCartTotal,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleClear,
    handleCheckoutRedirect,
  };
};