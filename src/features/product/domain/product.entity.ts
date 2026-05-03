import type { Product } from './product.types';

export const createProductEntity = (data: Partial<Product>): Product => {
  const normalizedPrice = Math.max(0, data.price || 0);
  const normalizedStock = Math.max(0, data.stock || 0); // Regra: estoque nunca pode ser negativo

  return {
    id: data.id || 'unknown',
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    price: normalizedPrice,
    imageUrl: data.imageUrl || '/fallback-image.jpg',
    stock: normalizedStock, // <-- Adicionado
    formattedPrice: `$${normalizedPrice.toFixed(2)}`,
  };
};