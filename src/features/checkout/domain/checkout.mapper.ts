import { type BackendPedidoRequestDTO } from '../api/checkoutApi';

interface CheckoutItemInput {
  skuId: string;
  quantity: number;
  price: number;
}
export const mapCheckoutToApi = (
  userId: string, 
  metodoPagamento: string, 
  parcelas: number, 
  items: CheckoutItemInput[]
): BackendPedidoRequestDTO => {
  return {
    clienteId: userId,
    metodoPagamento: metodoPagamento,
    parcelas: metodoPagamento === 'CREDITO' ? parcelas : 1,
    itens: items.map((item) => ({
      variacaoId: item.skuId,
      quantidade: item.quantity,
      precoUnitario: item.price
    })),
  };
};