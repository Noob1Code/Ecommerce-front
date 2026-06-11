import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartStoreItem {
  skuId: string;
  quantity: number;
}

interface CartState {
  items: CartStoreItem[];
  addItem: (skuId: string, maxStock: number) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number, maxStock: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (skuId: string, maxStock: number) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex((item) => item.skuId === skuId);

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const targetItem = updatedItems[existingItemIndex];
          
          if (targetItem.quantity >= maxStock) {
            return;
          }

          targetItem.quantity += 1;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...currentItems,
              {
                skuId,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (skuId: string) => {
        set({
          items: get().items.filter((item) => item.skuId !== skuId),
        });
      },

      updateQuantity: (skuId: string, quantity: number, maxStock: number) => {
        if (quantity <= 0) {
          get().removeItem(skuId);
          return;
        }

        const updatedItems = get().items.map((item) => {
          if (item.skuId === skuId) {
            if (quantity > maxStock) {
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'ecommerce-cart-storage',
      version: 1, // Definição da versão de schema estável para o vetor de SKUs do carrinho
      migrate: (persistedState: unknown, version: number): any => {
        // Abordagem defensiva: caso os metadados gravados localmente pertençam a um contrato
        // obsoleto ou inválido, limpa o carrinho para proteger as telas de checkout contra propriedades nulas.
        if (version < 1) {
          return {
            items: [],
          };
        }
        return persistedState;
      },
    }
  )
);