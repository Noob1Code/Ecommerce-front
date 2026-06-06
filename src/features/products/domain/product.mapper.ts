import type {
  BackendProdutoResponseDTO,
  BackendProdutoVariacaoResponseDTO,
  Product,
  ProductSku,
  ProductAttribute,
  SkuOption,
  SkuImage
} from './product.types';

/**
 * Enterprise Product Payload Alignment Blueprint
 * Bridges the gap by intersecting the parent container with the unmapped variation entity array natively.
 */
export interface BackendProductDetailedPayload extends Omit<BackendProdutoResponseDTO, 'variacoes'> {
  variacoes: BackendProdutoVariacaoResponseDTO[];
}

/**
 * Enterprise Domain Product Mapper
 * Transforms raw incoming backend payload DTO graphs natively into type-safe, 
 * clean frontend core domain entities without leaking network structural contracts.
 */
export const mapApiToProduct = (payload: BackendProductDetailedPayload): Product => {
  const mappedSkus: ProductSku[] = (payload.variacoes || []).map((skuDto) => {
    const mappedOptions: SkuOption[] = (skuDto.opcoes || []).map((opt) => ({
      id: opt.id,
      attributeId: opt.atributo.id,
      attributeName: opt.atributo.nome,
      value: opt.valor,
    }));

    const mappedImages: SkuImage[] = (skuDto.imagens || []).map((img) => ({
      id: img.id,
      imageUrl: img.urlImagem,
      order: img.ordem,
      createdAt: img.criadoEm,
    }));

    return {
      id: skuDto.id,
      skuCode: skuDto.sku,
      price: skuDto.preco,
      stock: skuDto.estoque,
      options: mappedOptions,
      images: mappedImages,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(skuDto.preco),
    };
  });

  const mappedAttributes: ProductAttribute[] = (payload.atributos || []).map((attr) => ({
    id: attr.id,
    attributeId: attr.atributoId,
    attributeName: attr.atributoNome,
  }));

  return {
    id: payload.id,
    name: payload.nome,
    description: payload.descricao,
    isActive: payload.ativo,
    createdAt: payload.criadoEm,
    variationIds: (payload.variacoes || []).map((v) => v.id),
    attributes: mappedAttributes,
    skus: mappedSkus,
  };
};