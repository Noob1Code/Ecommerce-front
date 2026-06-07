import { mockBackendProducts, type BackendProdutoDetalhadoPayload } from './mockData';

const MOCK_DELAY_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productsMockService = {
  getAll: async (): Promise<BackendProdutoDetalhadoPayload[]> => {
    await delay(MOCK_DELAY_MS);
    return mockBackendProducts;
  },

  getById: async (id: string): Promise<BackendProdutoDetalhadoPayload> => {
    await delay(MOCK_DELAY_MS);
    const product = mockBackendProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product container reference asset not found');
    return product;
  },

  updateMetadata: async (id: string, name: string, description: string): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    const product = mockBackendProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product container asset not found for metadata allocation');
    product.nome = name;
    product.descricao = description;
  },

  updateSkuStock: async (skuId: string, newStock: number): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    let isUpdated = false;
    
    mockBackendProducts.forEach((product) => {
      const skuMatch = product.variacoes.find((v) => v.id === skuId);
      if (skuMatch) {
        skuMatch.estoque = newStock;
        isUpdated = true;
      }
    });

    if (!isUpdated) throw new Error('SKU target row identifier not found inside collection state');
  },

  // NOVO MÉTODO DO MOCK: Realiza a mutação real de reativação comercial mudando para true
  activateProduct: async (id: string): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    const index = mockBackendProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockBackendProducts[index].ativo = true;
    }
  },

  // NOVO MÉTODO DO MOCK: Realiza a mutação real de preços percorrendo a lista de variações brutas
  updateSkuPrice: async (skuId: string, newPrice: number): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    let isUpdated = false;

    mockBackendProducts.forEach((product) => {
      const skuMatch = product.variacoes.find((v) => v.id === skuId);
      if (skuMatch) {
        skuMatch.preco = newPrice;
        isUpdated = true;
      }
    });

    if (!isUpdated) throw new Error('SKU target identifier not found for price allocation');
  },

  softDeleteProduct: async (id: string): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    const index = mockBackendProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockBackendProducts[index].ativo = false;
    }
  },

  hardDeleteSku: async (skuId: string): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    let isDeleted = false;
    
    mockBackendProducts.forEach((product) => {
      const variantIndex = product.variacoes.findIndex((v) => v.id === skuId);
      if (variantIndex !== -1) {
        product.variacoes.splice(variantIndex, 1);
        isDeleted = true;
      }
    });

    if (!isDeleted) throw new Error('SKU row reference mismatch during memory extraction sequence');
  }
};