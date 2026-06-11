export const CART_ENDPOINTS = {
  base: '/pedidos/carrinho',
  addItems: '/pedidos/carrinho/itens',
  removeItem: (variacaoId: string) => `/pedidos/carrinho/itens/${variacaoId}` as const,
} as const;