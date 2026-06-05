import type { Product, ProductSku, SkuOption, SkuImage, ProductAttribute } from './product.types';

export const createProductAttributeEntity = (data: Partial<ProductAttribute>): ProductAttribute => {
  return {
    id: data.id || 'unknown',
    attributeId: data.attributeId || 'unknown',
    attributeName: data.attributeName || 'Unnamed Attribute',
  };
};

export const createSkuOptionEntity = (data: Partial<SkuOption>): SkuOption => {
  return {
    id: data.id || 'unknown',
    attributeId: data.attributeId || 'unknown',
    attributeName: data.attributeName || 'Unnamed Option Type',
    value: data.value || '',
  };
};

export const createSkuImageEntity = (data: Partial<SkuImage>): SkuImage => {
  return {
    id: data.id || 'unknown',
    imageUrl: data.imageUrl || '/fallback-image.jpg',
    order: data.order ?? 0,
    createdAt: data.createdAt || new Date().toISOString(),
  };
};

export const createSkuEntity = (data: Partial<ProductSku>): ProductSku => {
  const normalizedPrice = Math.max(0, data.price || 0);
  const normalizedStock = Math.max(0, data.stock || 0);

  // Auto-sort images by their display order sequence
  const sortedImages = data.images 
    ? [...data.images].sort((a, b) => a.order - b.order) 
    : [];

  return {
    id: data.id || 'unknown',
    skuCode: data.skuCode || 'unknown-sku',
    price: normalizedPrice,
    stock: normalizedStock,
    options: data.options || [],
    images: sortedImages,
    formattedPrice: `$${normalizedPrice.toFixed(2)}`,
  };
};

export const createProductEntity = (data: Partial<Product>): Product => {
  return {
    id: data.id || 'unknown',
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    isActive: data.isActive ?? true,
    createdAt: data.createdAt || new Date().toISOString(),
    variationIds: data.variationIds || [],
    attributes: data.attributes || [],
    skus: data.skus || [],
  };
};