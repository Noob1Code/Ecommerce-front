import type {
  BackendImagemVariacaoRequestDTO,
  BackendProdutoRequestDTO,
  BackendProdutoResponseDTO,
  BackendProdutoVariacaoRequestDTO,
  BackendProdutoVariacaoUpdateDTO,
  BackendVariacaoOpcaoRequestDTO,
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

export const mapProductToRequestApi = (
  name: string,
  description: string,
  attributeIds: string[]
): BackendProdutoRequestDTO => {
  return {
    nome: name,
    descricao: description,
    atributosIds: attributeIds,
  };
};

export const mapVariationToRequestApi = (config: {
  skuCode: string;
  price: number;
  stock: number;
  options: Record<string, string>;
  images: string[];
}): BackendProdutoVariacaoRequestDTO => {
  const mappedOptions: BackendVariacaoOpcaoRequestDTO[] = Object.entries(config.options).map(
    ([atributoId, valor]) => ({
      atributoId,
      valor,
    })
  );

  const mappedImages: BackendImagemVariacaoRequestDTO[] = config.images.map((url, index) => ({
    urlImagem: url,
    ordem: index + 1,
  }));

  return {
    sku: config.skuCode,
    preco: config.price,
    estoque: Math.floor(config.stock),
    opcoes: mappedOptions,
    imagens: mappedImages,
  };
};

export const mapVariationToUpdateApi = (config: {
  skuCode?: string;
  price?: number;
  stock?: number;
  options?: Record<string, string>;
  images?: string[];
}): BackendProdutoVariacaoUpdateDTO => {
  const payload: BackendProdutoVariacaoUpdateDTO = {};

  if (config.skuCode !== undefined) payload.sku = config.skuCode;
  if (config.price !== undefined) payload.preco = config.price;
  if (config.stock !== undefined) payload.estoque = Math.floor(config.stock);

  if (config.options !== undefined) {
    payload.opcoes = Object.entries(config.options).map(([atributoId, valor]) => ({
      atributoId,
      valor,
    }));
  }

  if (config.images !== undefined) {
    payload.imagens = config.images.map((url, index) => ({
      urlImagem: url,
      ordem: index + 1,
    }));
  }

  return payload;
};