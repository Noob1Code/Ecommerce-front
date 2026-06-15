import { useQuery } from '@tanstack/react-query'; //
import { ordersApi } from '../api/invoicingApi';
import { OrdersMapper } from '../domain/invoicingMapper'; //

export const useOrdersController = () => {
    
  const { data: rawOrders = [], isLoading, error } = useQuery({
    queryKey: ['orders', 'admin', 'listAll'],
    queryFn: ordersApi.obterTodosPedidos,
    staleTime: 5 * 60 * 1000, //
    retry: 1,
  });

  const orders = rawOrders.map(OrdersMapper.toDomain);

  return {
    orders,
    isLoaderActive: isLoading,
    errorMessage: error ? 'Ocorreu um erro ao carregar o painel geral de pedidos do backoffice.' : null,
  };
};