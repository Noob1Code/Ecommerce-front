export interface BackendProdutoVariacaoIDsDTO {
  id: string;
}

export interface BackendProdutoAtributoResponseDTO {
  id: string;
  atributoId: string;
  atributoNome: string;
}

export interface BackendProdutoResponseDTO {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  variacoes: BackendProdutoVariacaoResponseDTO[];
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

export interface BackendAtributoRequestDTO {
  nome: string;
}

export interface BackendImagemVariacaoRequestDTO {
  urlImagem: string;
  ordem: number;
}

export interface BackendVariacaoOpcaoRequestDTO {
  atributoId: string;
  valor: string;
}

export interface BackendProdutoRequestDTO {
  nome: string;
  descricao: string;
  atributosIds: string[];
}

export interface BackendProdutoVariacaoRequestDTO {
  sku: string;
  preco: number;
  estoque: number;
  opcoes: BackendVariacaoOpcaoRequestDTO[];
  imagens: BackendImagemVariacaoRequestDTO[];
}

export interface BackendProdutoVariacaoUpdateDTO {
  sku?: string;
  preco?: number;
  estoque?: number;
  opcoes?: BackendVariacaoOpcaoRequestDTO[];
  imagens?: BackendImagemVariacaoRequestDTO[];
}

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