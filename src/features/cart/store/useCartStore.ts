import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductSku } from '../../products/domain/product.types';

export interface CartItem {
  id: string;
  product: Product;
  skuId: string;
  selectedSku: ProductSku;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, skuId: string) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, skuId: string) => {
        const selectedSku = product.skus.find((s) => s.id === skuId);
        if (!selectedSku) return;

        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex((item) => item.skuId === skuId);

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const targetItem = updatedItems[existingItemIndex];
          
          if (targetItem.quantity >= selectedSku.stock) {
            return;
          }

          targetItem.quantity += 1;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: skuId,
                product,
                skuId,
                selectedSku,
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

      updateQuantity: (skuId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(skuId);
          return;
        }

        const updatedItems = get().items.map((item) => {
          if (item.skuId === skuId) {
            if (quantity > item.selectedSku.stock) {
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
      name: 'mercado-preso-cart-storage',
    }
  )
);