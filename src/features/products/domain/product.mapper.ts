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

const IMAGE_BASE_URL = 'http://192.168.18.206:8080';

export const mapApiToProduct = (payload: BackendProdutoResponseDTO): Product => {
  const mappedSkus: ProductSku[] = (payload.variacoes || []).map((skuDto) => {
    const mappedOptions: SkuOption[] = (skuDto.opcoes || []).map((opt) => ({
      id: opt.id,
      attributeId: opt.atributo.id,
      attributeName: opt.atributo.nome,
      value: opt.valor,
    }));

    const mappedImages: SkuImage[] = (skuDto.imagens || []).map((img) => {
      // 🕵️‍♂️ Tratamento defensivo: remove barras duplicadas ou prefixos corrompidos
      let cleanPath = img.urlImagem || '';
      
      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
      }

      const fullImageUrl = cleanPath.startsWith('http')
        ? cleanPath
        : `${IMAGE_BASE_URL}/${cleanPath}`;

      return {
        id: img.id,
        imageUrl: fullImageUrl,
        order: img.ordem,
        createdAt: img.criadoEm,
      };
    });

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

  const mappedImages: BackendImagemVariacaoRequestDTO[] = config.images.map((url, index) => {
    // 🧼 Remove o link do localhost e garante que devolve apenas o caminho relativo para o banco
    const relativeUrl = url.replace(`${IMAGE_BASE_URL}/`, '');
    
    return {
      urlImagem: relativeUrl,
      ordem: index + 1,
    };
  });

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
    payload.imagens = config.images.map((url, index) => {
      // 🧼 Garantia de limpeza bi-direcional no payload de atualização parcial
      const relativeUrl = url.replace(`${IMAGE_BASE_URL}/`, '');
      
      return {
        urlImagem: relativeUrl,
        ordem: index + 1,
      };
    });
  }

  return payload;
};