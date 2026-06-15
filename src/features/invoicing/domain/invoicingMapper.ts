import type { BackendPedidoDetalhadoResponseDTO, Order, OrderStatus } from './invoicing.types';

export class OrdersMapper {
  private static mapStatus(backendStatus: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      AGUARDANDO_PAGAMENTO: 'PENDING',
      PAGO: 'PAID',
      ENVIADO: 'SHIPPED',
      ENTREGUE: 'DELIVERED',
      CANCELADO: 'CANCELLED',
    };
    return statusMap[backendStatus.toUpperCase()] || 'UNKNOWN';
  }

  public static toDomain(dto: BackendPedidoDetalhadoResponseDTO): Order {
    return {
      id: dto.id,
      customer: {
        id: dto.cliente.id,
        name: dto.cliente.nome,
        email: dto.cliente.email,
        document: dto.cliente.documento,
        userType: dto.cliente.tipoUsuario,
        isActive: dto.cliente.ativo,
      },
      status: OrdersMapper.mapStatus(dto.status),
      createdAt: dto.criadoEm,
      totalValue: dto.valorTotal,
      items: dto.itens.map((item) => ({
        id: item.id,
        skuId: item.variacao.id,
        productName: item.variacao.nomeProduto,
        skuCode: item.variacao.sku,
        details: item.variacao.detalhes,
        quantity: item.quantidade,
        unitPrice: item.precoUnitario,
        subtotal: item.subtotal,
      })),
    };
  }
}