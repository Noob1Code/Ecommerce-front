import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useProducts } from '../../products';
import type { Product, ProductSku } from '../../products/domain/product.types';

export interface EnrichedCartItem {
  id: string;
  skuId: string;
  quantity: number;
  product: Product;
  selectedSku: ProductSku;
}

export const useCartController = () => {
  const navigate = useNavigate();
  const { products, isLoading, error } = useProducts();
  
  const rawItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

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

  const isEmpty = enrichedItems.length === 0;

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

  const handleIncrement = (skuId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity >= maxStock) {
      alert(`Action Aborted: Selected variation stock ceiling reached. Maximum units available: ${maxStock}`);
      return;
    }
    updateQuantity(skuId, currentQuantity + 1, maxStock);
  };

  const handleDecrement = (skuId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      removeItem(skuId);
      return;
    }
    let maxStock = 999999;
    const match = enrichedItems.find((i) => i.skuId === skuId);
    if (match) {
      maxStock = match.selectedSku.stock;
    }
    updateQuantity(skuId, currentQuantity - 1, maxStock);
  };

  const handleRemove = (skuId: string) => {
    removeItem(skuId);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to drop all selected items from your cart?')) {
      clearCart();
    }
  };

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  return {
    items: enrichedItems,
    isEmpty,
    isLoading,
    error,
    totalItemsCount,
    cartTotal,
    formattedCartTotal,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleClear,
    handleCheckoutRedirect,
  };
};