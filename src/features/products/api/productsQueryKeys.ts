export const PRODUCTS_QUERY_KEYS = {
  all: ['products'] as const,
  list: () => ['products', 'list'] as const,
  detail: (id: string) => ['product', id] as const,
} as const;