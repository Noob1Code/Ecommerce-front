export const PRODUCT_ENDPOINTS = {
  base: '/produto',
  detail: (id: string) => `/produto/${id}`,
  delete: (id: string) => `/produto/${id}/delete`,
  
  variation: {
    base: 'produto/variacao',
    detail: (id: string) => `/produto/variacao/${id}`,
    delete: (id: string) => `/produto/variacao/${id}/delete`,
  },
  
  attribute: {
    base: '/produto/atributo',
    detail: (id: string) => `/produto/atributo/${id}`,
    delete: (id: string) => `/produto/atributo/${id}/delete`,
  }
};