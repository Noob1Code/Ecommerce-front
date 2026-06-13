import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth';
import { useCartStore } from '../../cart';
import { useProducts } from '../../products';
import type { Product, ProductSku } from '../../products/domain/product.types';
import { createOrderApi, type BackendCheckoutResponseDTO } from '../api/checkoutApi';
import { mapCheckoutToApi } from '../domain/checkout.mapper';

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
  const user = useAuthStore((state) => state.usuario);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('PIX');
  const [parcelas, setParcelas] = useState<number>(1);
  const [sucessoCheckout, setSucessoCheckout] = useState<BackendCheckoutResponseDTO | null>(null);

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

  const isEmpty = enrichedItems.length === 0 && !sucessoCheckout;

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
    onSuccess: (dadosRetorno) => {
      clearCart();
      setSucessoCheckout(dadosRetorno);
    },
    onError: () => {
      alert('Ocorreu uma falha ao tentar transmitir a intenção de compra ao servidor.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Sessão expirada ou inválida. Por favor, efetue o login antes de fechar a compra.');
      navigate('/login');
      return;
    }

    const payloadMapeado = mapCheckoutToApi(
      user.id,
      metodoPagamento,
      parcelas,
      enrichedItems.map(i => ({ skuId: i.skuId, quantity: i.quantity, price: i.selectedSku.price }))
    );

    placeOrder(payloadMapeado);
  };

  const concluirFluxo = () => {
    setSucessoCheckout(null);
    navigate('/meus-pedidos');
  };

  return {
    items: enrichedItems,
    user,
    isEmpty,
    formattedTotal,
    isPending,
    metodoPagamento,
    parcelas,
    sucessoCheckout,
    setMetodoPagamento,
    setParcelas,
    handleSubmit,
    concluirFluxo
  };
};