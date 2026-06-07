import type {
  BackendProdutoResponseDTO,
  Product,
  ProductSku,
  ProductAttribute,
  SkuOption,
  SkuImage
} from '../domain/product.types';

/**
 * Enterprise Domain Product Mapper
 * Transforms raw incoming backend payload DTO graphs natively into type-safe, 
 * clean frontend core domain entities without leaking network structural contracts.
 */
export const mapApiToProduct = (payload: BackendProdutoResponseDTO): Product => {
  const mappedSkus: ProductSku[] = (payload.variacoes || []).map((skuDto) => {
    // CORREÇÃO: Mapeando os campos planos vindos diretamente do VariacaoOpcaoResponseDTO.java
    const mappedOptions: SkuOption[] = (skuDto.opcoes || []).map((opt) => ({
      id: opt.id,
      attributeId: opt.produtoAtributoId, // Corrigido de opt.atributo.id
      attributeName: opt.atributoNome,   // Corrigido de opt.atributo.nome
      value: opt.valor,                  // Mapeia "valor" para "value"
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
      // Alinhado para a moeda do ecossistema do projeto (BRL)
      formattedPrice: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
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