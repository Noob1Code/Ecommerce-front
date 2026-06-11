export const PRODUCT_ENDPOINTS = {
  base: '/produto',
  detail: (id: string) => `/produto/${id}` as const,
  delete: (id: string) => `/produto/${id}/delete` as const,
  
  variation: {
    base: '/produto/variacao',
    detail: (id: string) => `/produto/variacao/${id}` as const,
    create: (productId: string) => `/produto/variacao/${productId}` as const,
    delete: (id: string) => `/produto/variacao/${id}/delete` as const,
  },
  
  attribute: {
    base: '/produto/atributo',
    detail: (id: string) => `/produto/atributo/${id}` as const,
    delete: (id: string) => `/produto/atributo/${id}/delete` as const,
  }
} as const;