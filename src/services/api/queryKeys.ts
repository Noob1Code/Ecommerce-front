export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    list: () => ['products', 'list'] as const,
    detail: (id: string) => ['product', id] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
} as const;