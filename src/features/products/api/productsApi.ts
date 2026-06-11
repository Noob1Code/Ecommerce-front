import { httpClient } from '../../../services/api';
import { PRODUCT_ENDPOINTS } from './productsEndpoints';
import { productsMockService } from './productsMockService';
import type { BackendProdutoDetalhadoPayload } from './mockData';

const USE_MOCKS = false;

// ==========================================
// DATA TRANSFER OBJECTS (DTO) INTERFACES
// ==========================================

export interface ProductRequestDTO {
  nome: string;
  descricao: string;
  atributosIds: string[];
}

export interface ProductResponseDTO {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  atributosIds: string[];
}

export interface SkuOptionRequestDTO {
  atributoId: string;
  valor: string;
}

export interface SkuImageRequestDTO {
  urlImagem: string;
  ordem: number;
}

export interface ProductVariationRequestDTO {
  sku: string;
  preco: number;
  estoque: number;
  opcoes: SkuOptionRequestDTO[];
  imagens: SkuImageRequestDTO[];
}

export interface ProductVariationUpdateDTO {
  sku?: string;
  preco?: number;
  estoque?: number;
  opcoes?: SkuOptionRequestDTO[];
  imagens?: SkuImageRequestDTO[];
}

export interface ProductVariationResponseDTO {
  id: string;
  preco: number;
  estoque: number;
  sku: string;
  customizacao: string;
  ativo: boolean;
}

export interface AttributeRequestDTO {
  nome: string;
  valores: string[];
}

export interface AttributeResponseDTO {
  id: string;
  nome: string;
  valores: string[];
  ativo: boolean;
}

// ==========================================
// CORE CORE-CATALOG API OPERATIONS
// ==========================================

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

export const createProductInApi = async (payload: ProductRequestDTO): Promise<ProductResponseDTO> => {
  const response = await httpClient.post<ProductResponseDTO>(PRODUCT_ENDPOINTS.base, payload);
  return response.data;
};

export const updateProductMetadataInApi = async (id: string, name: string, description: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.updateMetadata(id, name, description);
  }

  const payload: ProductRequestDTO = {
    nome: name,
    descricao: description,
    atributosIds: []
  };

  await httpClient.put<void>(PRODUCT_ENDPOINTS.detail(id), payload);
};

export const activateProductInApi = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.activateProduct(id);
  }

  await httpClient.patch<void>(PRODUCT_ENDPOINTS.delete(id));
};

export const deleteProductInApi = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.softDeleteProduct(id);
  }

  await httpClient.patch<void>(PRODUCT_ENDPOINTS.delete(id));
};

// ==========================================
// SKUs / PRODUCT VARIATIONS OPERATIONS
// ==========================================

export const fetchAllSkuVariationsFromApi = async (): Promise<ProductVariationResponseDTO[]> => {
  const response = await httpClient.get<ProductVariationResponseDTO[]>(PRODUCT_ENDPOINTS.variation.base);
  return response.data;
};

export const createSkuVariationInApi = async (productId: string, payload: ProductVariationRequestDTO): Promise<ProductVariationResponseDTO> => {
  const response = await httpClient.post<ProductVariationResponseDTO>(PRODUCT_ENDPOINTS.variation.create(productId), payload);
  return response.data;
};

export const updateSkuStockInApi = async (skuId: string, newStock: number): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.updateSkuStock(skuId, newStock);
  }

  const payload: ProductVariationUpdateDTO = { 
    estoque: newStock 
  };

  await httpClient.put<void>(PRODUCT_ENDPOINTS.variation.detail(skuId), payload);
};

export const updateSkuPriceInApi = async (skuId: string, newPrice: number): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.updateSkuPrice(skuId, newPrice);
  }

  const payload: ProductVariationUpdateDTO = {
    preco: newPrice
  };

  await httpClient.put<void>(PRODUCT_ENDPOINTS.variation.detail(skuId), payload);
};

export const deleteSkuInApi = async (skuId: string): Promise<void> => {
  if (USE_MOCKS) {
    return productsMockService.hardDeleteSku(skuId);
  }

  await httpClient.patch<void>(PRODUCT_ENDPOINTS.variation.delete(skuId));
};

// ==========================================
// ATTRIBUTE ENGINE OPERATIONS
// ==========================================

export const fetchAttributesFromApi = async (): Promise<AttributeResponseDTO[]> => {
  const response = await httpClient.get<AttributeResponseDTO[]>(PRODUCT_ENDPOINTS.attribute.base);
  return response.data;
};

export const createAttributeInApi = async (payload: AttributeRequestDTO): Promise<AttributeResponseDTO> => {
  const response = await httpClient.post<AttributeResponseDTO>(PRODUCT_ENDPOINTS.attribute.base, payload);
  return response.data;
};

export const updateAttributeInApi = async (id: string, payload: AttributeRequestDTO): Promise<AttributeResponseDTO> => {
  const response = await httpClient.put<AttributeResponseDTO>(PRODUCT_ENDPOINTS.attribute.detail(id), payload);
  return response.data;
};

export const deleteAttributeInApi = async (id: string): Promise<void> => {
  await httpClient.patch<void>(PRODUCT_ENDPOINTS.attribute.delete(id));
};