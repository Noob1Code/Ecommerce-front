export const QUERY_KEYS = {
  // O domínio 'product' cuida apenas de itens individuais
  products: {
    detail: (id: string) => ['product', id] as const,
  },
  // O domínio 'catalog' cuida de listas e buscas
  catalog: {
    list: (filters: any) => ['catalog', filters] as const,
  },
};