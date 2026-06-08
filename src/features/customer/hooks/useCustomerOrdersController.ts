import { useState, useEffect } from 'react';
import { customerApi, type PedidoResponseDTO } from '../api/customerApi';

export const useCustomerOrdersController = () => {
  const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [pedidoExpandidoId, setPedidoExpandidoId] = useState<string | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const dados = await customerApi.obterMeusPedidos();
        setPedidos(dados);
      } catch (err) {
        setErro('Não foi possível carregar seu histórico de pedidos.');
      } finally {
        setEstaCarregando(false);
      }
    };
    carregarHistorico();
  }, []);

  const handleAlternarDetalhes = (pedidoId: string) => {
    setPedidoExpandidoId((prev) => (prev === pedidoId ? null : pedidoId));
  };

  const obterClasseStatus = (status: string) => {
    const cores: Record<string, string> = {
      Pendente: 'bg-amber-50 text-amber-700 border-amber-200',
      Pago: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Em Separação': 'bg-blue-50 text-blue-700 border-blue-200',
      Faturado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Em Entrega': 'bg-purple-50 text-purple-700 border-purple-200',
      Entregue: 'bg-green-50 text-green-700 border-green-200',
      Cancelado: 'bg-red-50 text-red-700 border-red-200',
    };
    return cores[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return {
    pedidos,
    estaCarregando,
    erro,
    pedidoExpandidoId,
    handleAlternarDetalhes,
    obterClasseStatus
  };
};