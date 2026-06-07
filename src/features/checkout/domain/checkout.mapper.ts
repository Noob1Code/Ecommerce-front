import { type BackendPedidoRequestDTO } from '../api/checkoutApi';

interface CheckoutItemInput {
  skuId: string;
  quantity: number;
}

export const mapCheckoutToApi = (userId: string, items: CheckoutItemInput[]): BackendPedidoRequestDTO => {
  return {
    clienteId: userId,
    itens: items.map((item) => ({
      variacaoId: item.skuId,
      quantidade: item.quantity,
    })),
  };
};