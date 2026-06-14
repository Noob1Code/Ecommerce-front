import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { useAuthStore } from '../../auth';
import { useProducts } from '../../products';
import type { Product, ProductSku } from '../../products/domain/product.types';
import { cartApi } from '../api/cartApi';
import { useCartStore } from '../store/useCartStore';
import { useCartMutations } from './useCartMutations';

export interface EnrichedCartItem {
  id: string;
  skuId: string;
  quantity: number;
  product: Product;
  selectedSku: ProductSku;
}

export const useCartController = () => {
  const navigate = useNavigate();
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const usuario = useAuthStore((state) => state.usuario);
  const { products, isLoading: isLoadingProducts, error: errorProducts } = useProducts();
  const showError = useNotificationModalStore((state) => state.showError);
  const showConfirm = useNotificationModalStore((state) => state.showConfirm);

  const {
    addToCartMutation,
    incrementItemMutation,
    decrementItemMutation,
    removeFromCartMutation,
    clearCartMutation
  } = useCartMutations();

  const rawItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const possuiPermissaoCompra = usuario?.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  const { isFetching: isFetchingServerCart } = useQuery({
    queryKey: ['cart', 'server-state', usuario?.id] as const,
    queryFn: cartApi.obterCarrinhoDoServidor,
    enabled: estaAutenticado && !!usuario?.id && !!possuiPermissaoCompra,
    staleTime: 1000 * 60 * 5,
  });

  const enrichedItems = useMemo<EnrichedCartItem[]>(() => {
    if (!products || products.length === 0) return [];

    return rawItems
      .map((rawItem) => {
        let foundProduct: Product | null = null;
        let foundSku: ProductSku | null = null;

        for (const p of products) {
          const matchSku = p.skus.find((s) => s.id === rawItem.skuId);
          if (matchSku) {
            foundProduct = p;
            foundSku = matchSku;
            break;
          }
        }

        if (!foundProduct || !foundSku) return null;

        return {
          id: rawItem.skuId,
          skuId: rawItem.skuId,
          quantity: rawItem.quantity,
          product: foundProduct,
          selectedSku: foundSku,
        };
      })
      .filter((item): item is EnrichedCartItem => item !== null);
  }, [rawItems, products]);

  const isEmpty = enrichedItems.length === 0 && !isFetchingServerCart;

  const totalItemsCount = useMemo(() => {
    return enrichedItems.reduce((total, item) => total + item.quantity, 0);
  }, [enrichedItems]);

  const cartTotal = useMemo(() => {
    return enrichedItems.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  }, [enrichedItems]);

  const formattedCartTotal = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cartTotal);
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
    isLoading: isLoadingProducts ||
      (isFetchingServerCart && possuiPermissaoCompra) ||
      addToCartMutation.isPending ||
      incrementItemMutation.isPending ||
      decrementItemMutation.isPending ||
      removeFromCartMutation.isPending ||
      clearCartMutation.isPending,
    error: errorProducts,
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