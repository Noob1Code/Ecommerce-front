import { useMemo } from 'react';
import { useCartStore } from '../../../app/store';
import type { CartItem } from '../../../app/store/useCartStore';

export interface CartPackage {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// NOVO: Adicionamos o parâmetro `onlySelected` (falso por padrão para não quebrar o Cart)
export const useCartPackages = (onlySelected: boolean = false) => {
  const items = useCartStore((state) => state.items);
  const selectedItemIds = useCartStore((state) => state.selectedItemIds);

  return useMemo(() => {
    // 1. Filtramos os itens ANTES de agrupar, se exigido (ex: no Checkout)
    const targetItems = onlySelected
      ? items.filter((item) => selectedItemIds.includes(item.id))
      : items;

    // 2. O reducer agora atua apenas sobre a lista alvo, mantendo a performance excelente
    const packagesMap = targetItems.reduce((acc, item) => {
      const sellerId = item.seller?.id || 'legacy-seller';
      const sellerName = item.seller?.name || 'Unknown Partner';

      if (!acc[sellerId]) {
        acc[sellerId] = {
          sellerId,
          sellerName,
          items: [],
          totalItems: 0,
          totalPrice: 0,
        };
      }

      acc[sellerId].items.push(item);
      acc[sellerId].totalItems += item.quantity;
      acc[sellerId].totalPrice += item.price * item.quantity;

      return acc;
    }, {} as Record<string, CartPackage>);

    return Object.values(packagesMap);
  }, [items, selectedItemIds, onlySelected]); // Dependências do useMemo atualizadas
};