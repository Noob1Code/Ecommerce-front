import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { customerApi, type BackendPedidoDetalhadoResponseDTO } from '../api/customerApi';

export const useCustomerOrdersController = (somenteMeus: boolean = true) => {
  const [pedidoExpandidoId, setPedidoExpandidoId] = useState<string | null>(null);
  const { data: pedidos = [], isLoading: estaCarregando, error } = useQuery<BackendPedidoDetalhadoResponseDTO[], Error>({
    queryKey: ['customer', 'orders', somenteMeus ? 'meus' : 'todos'] as const,
    queryFn: async () => {
      if (somenteMeus) {
        return customerApi.obterMeusPedidos();
      } else {
        return customerApi.obterTodosPedidos();
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleAlternarDetalhes = (pedidoId: string) => {
    setPedidoExpandidoId((prev) => (prev === pedidoId ? null : pedidoId));
  };

  const obterClasseStatus = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('PENDENTE') || s.includes('AGUARDANDO')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s.includes('PAGO') || s.includes('CONCLUIDO')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('SEPARA')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('ENTREGUE')) return 'bg-green-50 text-green-700 border-green-200';
    if (s.includes('CANCELADO')) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return {
    pedidos,
    estaCarregando,
    erro: error ? 'Não foi possível sincronizar o histórico de faturamento com o servidor.' : null,
    pedidoExpandidoId,
    handleAlternarDetalhes,
    obterClasseStatus
  };
};