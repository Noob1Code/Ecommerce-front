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
          
          // Inventory boundary protection check before incrementing cart item count
          if (targetItem.quantity >= selectedSku.stock) {
            alert(`Cannot accommodate request. Max available inventory capacity reached for this configuration.`);
            return;
          }

          targetItem.quantity += 1;
          set({ items: updatedItems });
        } else {
          // Initialize fresh cart item reference row entry snapshot
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
            // Validate incoming parameter value bounds against active SKU server stock capacity
            if (quantity > item.selectedSku.stock) {
              alert(`Requested amount exceeds active inventory stock levels.`);
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
      name: 'mercado-preso-cart-storage', // Key placeholder target for LocalStorage persistence
    }
  )
);