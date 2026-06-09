export const PRODUCT_ENDPOINTS = {
  base: '/api/produto',
  detail: (id: string) => `/api/produto/${id}`,
  delete: (id: string) => `/api/produto/${id}/delete`,
  
  variation: {
    base: '/api/produto/variacao',
    detail: (id: string) => `/api/produto/variacao/${id}`,
    delete: (id: string) => `/api/produto/variacao/${id}/delete`,
  },
  
  attribute: {
    base: '/api/produto/atributo',
    detail: (id: string) => `/api/produto/atributo/${id}`,
    delete: (id: string) => `/api/produto/atributo/${id}/delete`,
  }
};