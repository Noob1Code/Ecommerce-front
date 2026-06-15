import type { Product, ProductSku } from './product.types';

export interface DisplayableSku extends ProductSku {
  formattedPrice: string;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const createDisplayableSku = (sku: ProductSku): DisplayableSku => {
  return {
    id: sku.id,
    skuCode: sku.skuCode,
    price: sku.price,
    stock: sku.stock,
    options: sku.options,
    images: sku.images,
    formattedPrice: formatCurrency(sku.price)
  };
};

export const isSkuInStock = (sku: ProductSku): boolean => {
  return sku.stock > 0;
};

export const getProductPriceRange = (product: Product): { minPrice: number; maxPrice: number; formattedMin: string; formattedMax: string } | null => {
  if (!product.skus || product.skus.length === 0) {
    return null;
  }

  const prices = product.skus.map((sku) => sku.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    minPrice,
    maxPrice,
    formattedMin: formatCurrency(minPrice),
    formattedMax: formatCurrency(maxPrice)
  };
};

export const validateSkuInventory = (sku: ProductSku, requestedQuantity: number): boolean => {
  return sku.stock >= requestedQuantity;
};