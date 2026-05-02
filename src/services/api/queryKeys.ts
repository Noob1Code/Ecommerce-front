export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    detail: (id: string) => ['product', id] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
} as const;