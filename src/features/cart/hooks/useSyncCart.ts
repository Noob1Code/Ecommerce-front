import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '../../auth';
import { cartApi } from '../api/cartApi';
import { CartMapper } from '../domain/cart.mapper';
import { useCartStore } from '../store/useCartStore';

export const useSyncCart = () => {
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const usuario = useAuthStore((state) => state.usuario);
  const setItems = useCartStore((state) => state.setItems);

  const possuiPermissaoCompra = usuario?.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  const { data: carrinhoServidor } = useQuery({
    queryKey: ['cart', 'server-state', usuario?.id] as const,
    queryFn: cartApi.obterCarrinhoDoServidor,
    enabled: estaAutenticado && !!usuario?.id && !!possuiPermissaoCompra,
    staleTime: 0, 
  });
  useEffect(() => {
    if (estaAutenticado && carrinhoServidor) {
      const itensMapeados = CartMapper.toCartStoreItems(carrinhoServidor);
      setItems(itensMapeados);
    }
  }, [carrinhoServidor, estaAutenticado, setItems]);
};