import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. O carrinho agora guarda apenas o resumo necessário para o checkout,
// e não o objeto de Domínio de Produto inteiro com todos os vendedores.
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
}

// Tipo auxiliar para o que vem da tela de catálogo (tudo menos a quantidade que começa no 1)
export type AddCartItemDTO = Omit<CartItem, 'quantity'>;

interface CartState {
  items: CartItem[];
  addItem: (item: AddCartItemDTO) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          // REGRA DE NEGÓCIO: Impede de adicionar se já atingiu o limite do estoque
          if (existingItem.quantity >= newItem.stock) {
            return; 
          }
          
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // REGRA DE NEGÓCIO: Impede adição de produtos sem estoque
          if (newItem.stock <= 0) return;

          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) return;
        
        // Regra extra: garantir que não atualiza para um valor maior que o stock
        const currentItems = get().items;
        const itemToUpdate = currentItems.find(i => i.id === itemId);
        if (itemToUpdate && quantity > itemToUpdate.stock) return;

        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'ecommerce-cart-storage',
    }
  )
);