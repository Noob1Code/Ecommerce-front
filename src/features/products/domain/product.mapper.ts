import type {
  BackendProdutoResponseDTO,
  Product,
  ProductAttribute,
  ProductSku,
  SkuImage,
  SkuOption
} from './product.types';

export const mapApiToProduct = (payload: BackendProdutoResponseDTO): Product => {
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