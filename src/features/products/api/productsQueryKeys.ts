export const PRODUCTS_QUERY_KEYS = {
  // Chave Raiz Global: Qualquer invalidação aqui limpa em cascata todos os sub-nós filhos
  all: ['products'] as const,
  
  // Nó Filho de Listagem
  list: () => ['products', 'list'] as const,
  
  // CORREÇÃO: Nó Filho de Detalhes unificado sob o mesmo prefixo 'products' para invalidação em lote legítima
  detail: (id: string) => ['products', 'detail', id] as const,
} as const;