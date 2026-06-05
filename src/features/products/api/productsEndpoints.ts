export const PRODUCT_ENDPOINTS = {
  base: '/api/produto',
  detail: (id: string) => `/api/produto/${id}`,
  variation: {
    base: '/api/produto/variacao',
    detail: (skuId: string) => `/api/produto/variacao/${skuId}`,
  }
} as const;