import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { useAuthStore } from '../../auth';
import { cartApi, useCartStore } from '../../cart';
import { createOrderApi } from '../api/checkoutApi';
import { CheckoutMapper } from '../domain/checkout.mapper';
import type { BackendCheckoutResponseDTO, EnrichedCheckoutItem } from '../domain/checkout.types';

export const useCheckoutController = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.usuario);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const showSuccess = useNotificationModalStore((state) => state.showSuccess);
  const showError = useNotificationModalStore((state) => state.showError);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('PIX');
  const [parcelas, setParcelas] = useState<number>(1);
  const [sucessoCheckout, setSucessoCheckout] = useState<BackendCheckoutResponseDTO | null>(null);

  const possuiPermissaoCompra = user?.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  const { data: carrinhoServidor } = useQuery({
    queryKey: ['cart', 'server-state', user?.id] as const,
    queryFn: cartApi.obterCarrinhoDoServidor,
    enabled: estaAutenticado && !!user?.id && !!possuiPermissaoCompra,
    staleTime: 0,
  });

  const enrichedItems = useMemo<EnrichedCheckoutItem[]>(() => {
    if (!carrinhoServidor || !carrinhoServidor.itens) return [];

    return carrinhoServidor.itens
      .filter((item) => item.produto !== null)
      .map((item) => ({
        skuId: item.produto!.variacaoId,
        quantity: item.quantidade,
        product: {
          name: item.produto!.nomeProduto,
        },
        selectedSku: {
          skuCode: item.produto!.sku,
          price: item.produto!.preco,
        }
      }));
  }, [carrinhoServidor]);

  const isEmpty = enrichedItems.length === 0 && !sucessoCheckout;

  const cartTotal = useMemo(() => {
    return enrichedItems.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  }, [enrichedItems]);

  const formattedTotal = useMemo(() => {
    return CheckoutMapper.formatarMoeda(cartTotal);
  }, [cartTotal]);

  const opcoesParcelamento = useMemo(() => {
    return CheckoutMapper.gerarOpcoesParcelamento(cartTotal);
  }, [cartTotal]);

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (dadosRetorno) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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

    if (!possuiPermissaoCompra) {
      showError({
        title: 'Operação Negada',
        message: 'Usuários autenticados sob contas funcionais corporativas não possuem autorização para fechar pedidos.'
      });
      return;
    }

    const payloadMapeado = CheckoutMapper.mapCheckoutToApi(
      user.id,
      metodoPagamento,
      parcelas,
      enrichedItems
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
    opcoesParcelamento,
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