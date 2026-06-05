/**
 * Raw Backend DTO Contracts (Mirroring the Java modular monolith response keys)
 */

export interface BackendProdutoVariacaoIDsDTO {
  id: string;
}

export interface BackendProdutoAtributoResponseDTO {
  id: string;
  atributoId: string;
  attributeNome?: string;
  atributoNome: string;
}

export interface BackendProdutoResponseDTO {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  variacoes: BackendProdutoVariacaoIDsDTO[];
  atributos: BackendProdutoAtributoResponseDTO[];
}

export interface BackendAtributoResponseDTO {
  id: string;
  nome: string;
}

export interface BackendVariacaoOpcaoResponseDTO {
  id: string;
  atributo: BackendAtributoResponseDTO;
  valor: string;
}

export interface BackendImagemVariacaoResponseDTO {
  id: string;
  urlImagem: string;
  ordem: number;
  criadoEm: string;
}

export interface BackendProdutoVariacaoResponseDTO {
  id: string;
  sku: string;
  preco: number;
  estoque: number;
  opcoes: BackendVariacaoOpcaoResponseDTO[];
  imagens: BackendImagemVariacaoResponseDTO[];
}

/**
 * Clean Frontend Domain Interfaces (Strict Language Uniformity - English Only)
 */

export interface ProductAttribute {
  id: string;
  attributeId: string;
  attributeName: string;
}

export interface SkuOption {
  id: string;
  attributeId: string;
  attributeName: string;
  value: string;
}

export interface SkuImage {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export interface ProductSku {
  id: string;
  skuCode: string;
  price: number;
  stock: number;
  options: SkuOption[];
  images: SkuImage[];
  formattedPrice: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  variationIds: string[];
  attributes: ProductAttribute[];
  skus: ProductSku[];
}