export const CART_ENDPOINTS = {
  base: '/pedidos/carrinho',
  addItems: '/pedidos/carrinho/itens',
  removeItem: (variacaoId: string) => `/pedidos/carrinho/itens/${variacaoId}` as const,
  incrementItem: (variacaoId: string) => `/pedidos/carrinho/itens/${variacaoId}/incrementar` as const,
  decrementItem: (variacaoId: string) => `/pedidos/carrinho/itens/${variacaoId}/decrementar` as const,
} as const;