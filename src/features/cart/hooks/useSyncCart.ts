import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { cartApi } from '../api/cartApi';
import { useCartStore } from '../store/useCartStore';

export const useSyncCart = () => {
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const setItems = useCartStore((state) => state.setItems);

  const { data: carrinhoServidor } = useQuery({
    queryKey: ['cart', 'server-state'] as const,
    queryFn: cartApi.obterCarrinhoDoServidor,
    enabled: estaAutenticado,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (estaAutenticado && carrinhoServidor?.itens) {
      const itensMapeados = carrinhoServidor.itens.map((item) => ({
        skuId: item.produto?.variacaoId || item.id,
        quantity: item.quantidade,
      }));
      
      setItems(itensMapeados);
    }
  }, [carrinhoServidor, estaAutenticado, setItems]);
};