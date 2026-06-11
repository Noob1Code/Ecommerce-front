export const ENDPOINTS = {
  products: {
    base: '/products',
    detail: (id: string) => `/products/${id}`,
  },
  cart: {
    base: '/cart',
  },
  auth: {
    login: '/auth/login',
  },
} as const;