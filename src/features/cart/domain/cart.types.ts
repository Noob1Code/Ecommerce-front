export interface BackendItemCarrinhoRequestDTO {
    variacaoId: string;
    quantidade: number;
}

export interface BackendItemCatalogoCompletoDTO {
    variacaoId: string;
    produtoId?: string; // 🛡️ Opcional enquanto o backend não implementa
    nomeProduto: string;
    preco: number;
    estoque: number;
    sku: string;
    detalhes: string;
    urlImagem?: string; // 🛡️ Opcional enquanto o backend não implementa
}

export interface BackendItemCarrinhoResponseDTO {
    id: string;
    quantidade: number;
    produto: BackendItemCatalogoCompletoDTO | null;
}

export interface BackendCarrinhoResponseDTO {
    id: string;
    atualizadoEm: string;
    itens: BackendItemCarrinhoResponseDTO[];
}

export interface EnrichedCartItem {
    id: string;
    skuId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
    };
    selectedSku: {
        skuCode: string;
        price: number;
        stock: number;
        images: { imageUrl: string }[];
        options: { attributeName: string; value: string }[];
    };
    precoFormatado: string;
    subtotalFormatado: string;
}