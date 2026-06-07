import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../cart';
import { useAuthStore } from '../../auth';
import { useProducts } from '../../products';
import { createOrderApi } from '../api/checkoutApi';
import { mapCheckoutToApi } from '../domain/checkout.mapper';
import type { Product, ProductSku } from '../../products/domain/product.types';

interface EnrichedCheckoutItem {
  skuId: string;
  quantity: number;
  product: Product;
  selectedSku: ProductSku;
}

export const useCheckoutController = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const rawItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const enrichedItems = useMemo<EnrichedCheckoutItem[]>(() => {
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
          skuId: rawItem.skuId,
          quantity: rawItem.quantity,
          product: foundProduct,
          selectedSku: foundSku,
        };
      })
      .filter((item): item is EnrichedCheckoutItem => item !== null);
  }, [rawItems, products]);

  const isEmpty = enrichedItems.length === 0;

  const cartTotal = useMemo(() => {
    return enrichedItems.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  }, [enrichedItems]);

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(cartTotal);
  }, [cartTotal]);

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      clearCart();
      alert('Order placed successfully matching modular sales guidelines! Thank you.');
      navigate('/');
    },
    onError: () => {
      alert('An error occurred while communicating order fulfillment details to the backend.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Authentication required. Please sign in before finalizing transaction protocols.');
      navigate('/login');
      return;
    }

    const orderPayload = mapCheckoutToApi(user.id, enrichedItems);

    placeOrder(orderPayload);
  };

  return {
    items: enrichedItems,
    user,
    isEmpty,
    formattedTotal,
    isPending,
    handleSubmit,
  };
};