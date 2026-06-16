import type { BackendPedidoRequestDTO, EnrichedCheckoutItem, OpcaoParcelamento } from './checkout.types';

export const CheckoutMapper = {

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  },

  mapCheckoutToApi(
    userId: string,
    metodoPagamento: string,
    parcelas: number,
    items: EnrichedCheckoutItem[]
  ): BackendPedidoRequestDTO {
    return {
      clienteId: userId,
      metodoPagamento: metodoPagamento,
      parcelas: metodoPagamento === 'CREDITO_CARD' ? parcelas : 1,
      itens: items.map((item) => ({
        variacaoId: item.skuId,
        quantidade: item.quantity,
        precoUnitario: item.selectedSku.price
      })),
    };
  },

  gerarOpcoesParcelamento(total: number): OpcaoParcelamento[] {
    const parcelasDisponiveis = [1, 2, 3, 4, 5, 6, 10, 12];
    return parcelasDisponiveis.map((n) => {
      const valorParcela = total / n;
      return {
        parcelas: n,
        texto: `${n}x de ${CheckoutMapper.formatarMoeda(valorParcela)} sem juros`
      };
    });
  }
};