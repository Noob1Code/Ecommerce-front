import { httpClient } from '../../../services/api';
import { PRODUCT_ENDPOINTS } from './productsEndpoints';
import { productsMockService } from './productsMockService';
import type { BackendProdutoDetalhadoPayload } from './mockData';

const USE_MOCKS = true;

export const fetchProductsFromApi = async (): Promise<BackendProdutoDetalhadoPayload[]> => {
  if (USE_MOCKS) {
    return productsMockService.getAll();
  }

  const response = await httpClient.get<BackendProdutoDetalhadoPayload[]>(PRODUCT_ENDPOINTS.base);
  return response.data;
};

export const fetchProductByIdFromApi = async (id: string): Promise<BackendProdutoDetalhadoPayload> => {
  if (USE_MOCKS) {
    return productsMockService.getById(id);
  }

  const response = await httpClient.get<BackendProdutoDetalhadoPayload>(PRODUCT_ENDPOINTS.detail(id));
  return response.data;
};

export const updateProductMetadataInApi = async (id: string, name: string, description: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.updateMetadata(id, name, description);
  }

  await httpClient.put(PRODUCT_ENDPOINTS.detail(id), {
    nome: name,
    descricao: description,
    atributosIds: []
  });
};

export const updateSkuStockInApi = async (skuId: string, newStock: number): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.updateSkuStock(skuId, newStock);
  }

  await httpClient.put(PRODUCT_ENDPOINTS.variation.detail(skuId), { 
    estoque: newStock 
  });
};

export const deleteProductInApi = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.softDeleteProduct(id);
  }

  await httpClient.patch(`${PRODUCT_ENDPOINTS.detail(id)}/delete`);
};

export const deleteSkuInApi = async (skuId: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.hardDeleteSku(skuId);
  }

  await httpClient.delete(PRODUCT_ENDPOINTS.variation.detail(skuId));
};