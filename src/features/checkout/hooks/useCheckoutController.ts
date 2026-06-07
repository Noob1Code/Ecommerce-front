import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../cart';
import { useAuthStore } from '../../auth';
import { createOrderApi, type BackendPedidoRequestDTO } from '../api/checkoutApi';

export const useCheckoutController = () => {
  const navigate = useNavigate();
  
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const isEmpty = items.length === 0;

  const cartTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  }, [items]);

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

    const orderPayload: BackendPedidoRequestDTO = {
      clienteId: user.id,
      itens: items.map((item) => ({
        variacaoId: item.skuId,
        quantidade: item.quantity,
      })),
    };

    placeOrder(orderPayload);
  };

  return {
    items,
    user,
    isEmpty,
    formattedTotal,
    isPending,
    handleSubmit,
  };
};