export const PRODUCTS_QUERY_KEYS = {
  all: ['products'] as const,
  list: () => ['products', 'list'] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  attributes: () => ['products', 'attributes-manager-clean'] as const,
} as const;