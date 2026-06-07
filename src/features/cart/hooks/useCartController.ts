import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const useCartController = () => {
  const navigate = useNavigate();
  
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const isEmpty = items.length === 0;

  const totalItemsCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const cartTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  }, [items]);

  const formattedCartTotal = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cartTotal);
  }, [cartTotal]);

  const handleIncrement = (skuId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity >= maxStock) {
      alert(`Action Aborted: Selected variation stock ceiling reached. Maximum units available: ${maxStock}`);
      return;
    }
    updateQuantity(skuId, currentQuantity + 1);
  };

  const handleDecrement = (skuId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      removeItem(skuId);
      return;
    }
    updateQuantity(skuId, currentQuantity - 1);
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
    items,
    isEmpty,
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