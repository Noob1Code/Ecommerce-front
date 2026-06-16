export interface BackendItemPedidoRequestDTO {
    variacaoId: string;
    quantidade: number;
    precoUnitario: number;
}

export interface BackendPedidoRequestDTO {
    clienteId: string;
    metodoPagamento: string;
    parcelas: number;
    itens: BackendItemPedidoRequestDTO[];
}

export interface BackendItemPedidoCriadoResponseDTO {
    id: string;
    variacaoId: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface BackendPedidoCriadoResponseDTO {
    id: string;
    clienteId: string;
    status: string;
    valorTotal: number;
    criadoEm: string;
    itens: BackendItemPedidoCriadoResponseDTO[];
}

export interface BackendCheckoutResponseDTO {
    pedido: BackendPedidoCriadoResponseDTO;
    processadoSincronamente: boolean;
    statusCobranca: string;
    mensagem: string;
    pixCopiaECola: string | null;
    linhaDigitavel: string | null;
}

export interface EnrichedCheckoutItem {
    skuId: string;
    quantity: number;
    product: {
        name: string;
    };
    selectedSku: {
        skuCode: string;
        price: number;
    };
}

export interface OpcaoParcelamento {
    parcelas: number;
    texto: string;
}