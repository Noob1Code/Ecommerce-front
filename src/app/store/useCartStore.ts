import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../../features/products';

export interface CartItem {
  id: string; // SKU ID (Identificador único comprável)
  productId: string; // Referência ao container do produto
  name: string; // Nome combinado (Produto + Variantes)
  skuCode: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  formattedPrice: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, skuId: string) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, skuId) => {
        const targetSku = product.skus.find((s) => s.id === skuId);
        if (!targetSku) return;

        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === skuId);

        if (existingItem) {
          // REGRA DE NEGÓCIO: Impede de adicionar se já atingiu o limite do estoque do SKU
          if (existingItem.quantity >= targetSku.stock) {
            return; 
          }
          
          set({
            items: currentItems.map((item) =>
              item.id === skuId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // REGRA DE NEGÓCIO: Impede adição se o SKU estiver esgotado
          if (targetSku.stock <= 0) return;

          // Monta o nome descritivo amigável para o carrinho combinando o nome e as opções do SKU
          const optionDetails = targetSku.options.map(o => o.value).join(' / ');
          const fullItemName = optionDetails ? `${product.name} (${optionDetails})` : product.name;
          const skuImage = targetSku.images.length > 0 ? targetSku.images[0].imageUrl : '/fallback-image.jpg';

          const newItem: CartItem = {
            id: targetSku.id,
            productId: product.id,
            name: fullItemName,
            skuCode: targetSku.skuCode,
            price: targetSku.price,
            imageUrl: skuImage,
            quantity: 1,
            stock: targetSku.stock,
            formattedPrice: targetSku.formattedPrice
          };

          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (skuId) => {
        set({ items: get().items.filter((item) => item.id !== skuId) });
      },

      updateQuantity: (skuId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.id === skuId);
        if (!item || quantity <= 0 || quantity > item.stock) return;

        set({
          items: currentItems.map((item) =>
            item.id === skuId ? { ...item, quantity } : item
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