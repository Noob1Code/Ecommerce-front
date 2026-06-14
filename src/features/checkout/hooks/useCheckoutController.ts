import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
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
  const showSuccess = useNotificationModalStore((state) => state.showSuccess);
  const showError = useNotificationModalStore((state) => state.showError);
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

      showSuccess({
        title: 'Pedido Confirmado',
        message: 'A transação foi recebida e processada com sucesso no Spring Boot.'
      });
    },
    onError: () => {
      showError({
        title: 'Erro na Transação',
        message: 'Ocorreu uma falha operacional ao tentar transmitir a intenção de compra ao servidor de faturamento.'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showError({
        title: 'Sessão Expirada',
        message: 'Sua sessão atual está inválida. Por favor, efetue o login na plataforma antes de fechar a compra.'
      });
      navigate('/login');
      return;
    }

    const possuiPermissaoCompra = user.perfis?.some((p) =>
      ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
    );

    if (!possuiPermissaoCompra) {
      showError({
        title: 'Operação Negada',
        message: 'Usuários autenticados sob contas funcionais corporativas (como Operadores de Estoque ou Faturamento) não possuem autorização para fechar pedidos.'
      });
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