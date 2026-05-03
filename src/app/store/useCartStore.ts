import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
  seller?: {
    id: string;
    name: string;
  };
}

export type AddCartItemDTO = Omit<CartItem, 'quantity'>;

interface CartState {
  items: CartItem[];
  selectedItemIds: string[];
  getSelectedTotal: () => number;

  addItem: (item: AddCartItemDTO) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Ações de Seleção
  toggleItemSelection: (itemId: string) => void;
  toggleSellerSelection: (itemIds: string[]) => void; // Ação para selecionar pacote inteiro
  isItemSelected: (itemId: string) => boolean;
  selectAll: () => void;
  unselectAll: () => void;
  getSelectedItems: () => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItemIds: [],

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          if (existingItem.quantity >= newItem.stock) return;

          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          if (newItem.stock <= 0) return;

          const itemToAdd: CartItem = {
            ...newItem,
            productId: newItem.productId || newItem.id,
            quantity: 1
          };

          set({
            items: [...currentItems, itemToAdd],
            selectedItemIds: [...get().selectedItemIds, itemToAdd.id]
          });
        }
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
          selectedItemIds: get().selectedItemIds.filter(id => id !== itemId)
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) return;

        const currentItems = get().items;
        const itemToUpdate = currentItems.find(i => i.id === itemId);
        if (itemToUpdate && quantity > itemToUpdate.stock) return;

        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], selectedItemIds: [] }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getSelectedTotal: () => {
        const state = get();
        return state.items
          .filter(item => state.selectedItemIds.includes(item.id))
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      toggleItemSelection: (itemId) => {
        const currentSelected = get().selectedItemIds;
        set({
          selectedItemIds: currentSelected.includes(itemId)
            ? currentSelected.filter((id) => id !== itemId)
            : [...currentSelected, itemId]
        });
      },

      // Nova implementação para selecionar o grupo do vendedor
      toggleSellerSelection: (itemIds) => {
        const currentSelected = get().selectedItemIds;
        const allSelected = itemIds.every(id => currentSelected.includes(id));

        if (allSelected) {
          set({
            selectedItemIds: currentSelected.filter(id => !itemIds.includes(id))
          });
        } else {
          const newSelected = Array.from(new Set([...currentSelected, ...itemIds]));
          set({ selectedItemIds: newSelected });
        }
      },

      isItemSelected: (itemId) => get().selectedItemIds.includes(itemId),

      selectAll: () => {
        set({ selectedItemIds: get().items.map(item => item.id) });
      },

      unselectAll: () => {
        set({ selectedItemIds: [] });
      },

      getSelectedItems: () => {
        const state = get();
        return state.items.filter(item => state.selectedItemIds.includes(item.id));
      }
    }),
    {
      name: 'ecommerce-cart-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 && persistedState.items) {
          persistedState.items = persistedState.items.map((item: any) => ({
            ...item,
            productId: item.productId || item.id,
            seller: item.seller || undefined,
          }));
          persistedState.selectedItemIds = persistedState.items.map((i: any) => i.id);
        }
        return persistedState as CartState;
      },
    }
  )
);