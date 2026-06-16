import { httpClient } from '../../../services/api';
import type { BackendProdutoResponseDTO } from '../domain/product.types';
import { PRODUCT_ENDPOINTS } from './productsEndpoints';

export interface ProductRequestDTO {
  nome: string;
  descricao: string;
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
}

export interface AttributeResponseDTO {
  id: string;
  nome: string;
}

export const createProductInApi = async (payload: ProductRequestDTO): Promise<BackendProdutoResponseDTO> => {
  const response = await httpClient.post<BackendProdutoResponseDTO>(PRODUCT_ENDPOINTS.base, payload);
  return response.data;
};

export const updateProductMetadataInApi = async (
  id: string,
  name: string,
  description: string,
  atributosIds: string[]
): Promise<void> => {
  const payload: ProductRequestDTO = {
    nome: name,
    descricao: description,
    atributosIds: atributosIds
  };
  await httpClient.put<void>(PRODUCT_ENDPOINTS.detail(id), payload);
};

export const alterarStatusProdutoEmApi = async (id: string): Promise<void> => {
  await httpClient.patch<void>(PRODUCT_ENDPOINTS.delete(id));
};

export const fetchAllSkuVariationsFromApi = async (): Promise<ProductVariationResponseDTO[]> => {
  const response = await httpClient.get<ProductVariationResponseDTO[]>(PRODUCT_ENDPOINTS.variation.base);
  return response.data;
};

export const createSkuVariationInApi = async (
  productId: string,
  payload: ProductVariationRequestDTO
): Promise<ProductVariationResponseDTO> => {
  const response = await httpClient.post<ProductVariationResponseDTO>(
    PRODUCT_ENDPOINTS.variation.create(productId),
    payload
  );
  return response.data;
};

export const updateSkuStockInApi = async (skuId: string, newStock: number): Promise<void> => {
  const payload: ProductVariationUpdateDTO = { estoque: newStock };
  await httpClient.put<void>(PRODUCT_ENDPOINTS.variation.detail(skuId), payload);
};

export const updateSkuPriceInApi = async (skuId: string, newPrice: number): Promise<void> => {
  const payload: ProductVariationUpdateDTO = { preco: newPrice };
  await httpClient.put<void>(PRODUCT_ENDPOINTS.variation.detail(skuId), payload);
};

export const updateSkuDetailsInApi = async (
  skuId: string,
  skuCode: string,
  opcoes: SkuOptionRequestDTO[],
  imagens: SkuImageRequestDTO[]
): Promise<void> => {
  const payload: ProductVariationUpdateDTO = {
    sku: skuCode,
    opcoes: opcoes,
    imagens: imagens
  };
  await httpClient.put<void>(PRODUCT_ENDPOINTS.variation.detail(skuId), payload);
};

export const deleteSkuInApi = async (skuId: string): Promise<void> => {
  await httpClient.patch<void>(PRODUCT_ENDPOINTS.variation.delete(skuId));
};

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

export const uploadSkuImageInApi = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await httpClient.post<{ url: string }>('/produto/storage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const fetchProductsFromApi = async (): Promise<BackendProdutoResponseDTO[]> => {
  const response = await httpClient.get<BackendProdutoResponseDTO[]>(PRODUCT_ENDPOINTS.base);
  return response.data;
};

export const fetchProductByIdFromApi = async (id: string): Promise<BackendProdutoResponseDTO> => {
  const response = await httpClient.get<BackendProdutoResponseDTO>(PRODUCT_ENDPOINTS.detail(id));
  return response.data;
};