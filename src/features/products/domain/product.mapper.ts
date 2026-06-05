import type {
  BackendProdutoResponseDTO,
  BackendProdutoVariacaoResponseDTO,
  BackendVariacaoOpcaoResponseDTO,
  BackendImagemVariacaoResponseDTO,
  BackendProdutoAtributoResponseDTO,
  Product,
  ProductSku,
  SkuOption,
  SkuImage,
  ProductAttribute
} from './product.types';
import {
  createProductEntity,
  createSkuEntity,
  createSkuOptionEntity,
  createSkuImageEntity,
  createProductAttributeEntity
} from './product.entity';

export const mapApiToProductAttribute = (apiData: BackendProdutoAtributoResponseDTO): ProductAttribute => {
  return createProductAttributeEntity({
    id: apiData.id,
    attributeId: apiData.atributoId,
    attributeName: apiData.atributoNome,
  });
};

export const mapApiToSkuOption = (apiData: BackendVariacaoOpcaoResponseDTO): SkuOption => {
  return createSkuOptionEntity({
    id: apiData.id,
    attributeId: apiData.atributo?.id,
    attributeName: apiData.atributo?.nome,
    value: apiData.valor,
  });
};

export const mapApiToSkuImage = (apiData: BackendImagemVariacaoResponseDTO): SkuImage => {
  return createSkuImageEntity({
    id: apiData.id,
    imageUrl: apiData.urlImagem,
    order: apiData.ordem,
    createdAt: apiData.criadoEm,
  });
};

export const mapApiToSku = (apiData: BackendProdutoVariacaoResponseDTO): ProductSku => {
  return createSkuEntity({
    id: apiData.id,
    skuCode: apiData.sku,
    price: apiData.preco,
    stock: apiData.estoque,
    options: apiData.opcoes ? apiData.opcoes.map(mapApiToSkuOption) : [],
    images: apiData.imagens ? apiData.imagens.map(mapApiToSkuImage) : [],
  });
};

export const mapApiToProduct = (
  apiData: BackendProdutoResponseDTO,
  fullSkus?: BackendProdutoVariacaoResponseDTO[]
): Product => {
  const variationIds = apiData.variacoes ? apiData.variacoes.map((v) => v.id) : [];
  const attributes = apiData.atributos ? apiData.atributos.map(mapApiToProductAttribute) : [];
  const skus = fullSkus ? fullSkus.map(mapApiToSku) : [];

  return createProductEntity({
    id: apiData.id,
    name: apiData.nome,
    description: apiData.descricao,
    isActive: apiData.ativo,
    createdAt: apiData.criadoEm,
    variationIds,
    attributes,
    skus,
  });
};

export const mapApiToProductList = (
  apiDataList: BackendProdutoResponseDTO[],
  fullSkusMap?: Record<string, BackendProdutoVariacaoResponseDTO[]>
): Product[] => {
  if (!apiDataList) return [];
  
  return apiDataList.map((product) => {
    const associatedSkus = fullSkusMap ? fullSkusMap[product.id] : undefined;
    return mapApiToProduct(product, associatedSkus);
  });
};