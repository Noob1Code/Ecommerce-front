import { useCustomerOrdersController } from '../hooks/useCustomerOrdersController';
import { Card, Button, Spinner, ErrorMessage, EmptyState } from '../../../shared/components/ui';

export const CustomerOrders = () => {
  const {
    pedidos,
    estaCarregando,
    erro,
    pedidoExpandidoId,
    handleAlternarDetalhes,
    obterClasseStatus
  } = useCustomerOrdersController();

  if (estaCarregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (erro) {
    return <div className="max-w-4xl mx-auto p-4"><ErrorMessage message={erro} /></div>;
  }

  if (pedidos.length === 0) {
    return <EmptyState title="Nenhum pedido localizado" description="Você ainda não realizou nenhuma compra em nossa plataforma." />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Pedidos</h1>
        <p className="mt-2 text-sm text-gray-500">Acompanhe o status e faturamento de suas aquisições comerciais.</p>
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => {
          const ehExpandido = pedidoExpandidoId === pedido.id;

          return (
            <Card key={pedido.id} className="p-5 border border-gray-200 bg-white shadow-xs rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Código do Pedido</p>
                    <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">{pedido.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Data da Compra</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Valor Total</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">R$ {pedido.valorTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status Atual</p>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border mt-1 ${obterClasseStatus(pedido.status)}`}>
                      {pedido.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center sm:pl-4">
                  <Button variant="secondary" onClick={() => handleAlternarDetalhes(pedido.id)} className="text-xs py-1.5 px-3">
                    {ehExpandido ? 'Ocultar Itens' : 'Ver Detalhes'}
                  </Button>
                </div>
              </div>

              {/* Accordion: Detalhes dos sub-itens comprados */}
              {ehExpandido && (
                <div className="mt-5 border-t border-gray-100 pt-4 bg-gray-50/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Produtos Comprados</h4>
                  {pedido.itens.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-sm bg-white p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border text-gray-400 font-mono text-[9px]">IMG</div>
                        <div>
                          <p className="font-bold text-gray-900">{item.nome}</p>
                          <p className="text-xs text-gray-500">Qtd: {item.quantidade} x R$ {item.precoUnitario.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};