import type { BackendPedidoDetalhadoResponseDTO, Order, OrderStatus } from './invoicing.types';

export class OrdersMapper {
  private static mapStatus(backendStatus: string): string {
    if (!backendStatus) return 'Em Processamento';

    const statusMap: Record<string, string> = {
      PENDENTE: 'Pendente',
      AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
      APROVADO: 'Pago',
      PAGO: 'Pago',
      ENVIADO: 'Enviado',
      ENTREGUE: 'Entregue',
      CANCELADO: 'Cancelado',
    };

    return statusMap[backendStatus.toUpperCase()] || 'Em Processamento';
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
      status: OrdersMapper.mapStatus(dto.status) as OrderStatus,
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