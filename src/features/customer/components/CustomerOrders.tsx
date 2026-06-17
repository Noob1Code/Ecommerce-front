import { Button, Card, EmptyState, ErrorMessage, Spinner } from '../../../shared/components/ui';
import { useCustomerOrdersController } from '../hooks/useCustomerOrdersController';

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
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (erro) {
    return <div className="max-w-4xl mx-auto p-4"><ErrorMessage message={erro} /></div>;
  }

  if (pedidos.length === 0) {
    return (
      <div className="px-4 py-12">
        <EmptyState
          title="Nenhum pedido localizado"
          description="Sua conta de cliente ainda não registrou transações comerciais."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 sm:py-10 w-full">
      <div className="mb-6 border-b border-gray-200 pb-5 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Meus Pedidos</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">Monitore o status, histórico e faturamento das suas compras de hardware.</p>
      </div>

      <div className="space-y-4 w-full">
        {pedidos.map((pedido) => {
          const ehExpandido = pedidoExpandidoId === pedido.id;

          return (
            <Card key={pedido.id} className="p-4 sm:p-5 border border-gray-200 bg-white shadow-xs rounded-xl w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                <div className="grid grid-cols-2 gap-x-2 gap-y-3.5 sm:grid-cols-4 flex-1 w-full">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Código Localizador</p>
                    <p className="text-xs font-mono font-bold text-gray-900 mt-0.5 break-all pr-1" title={pedido.id}>
                      {pedido.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Data de Emissão</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">
                      {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Liquidado</p>
                    <p className="text-xs sm:text-sm font-black text-blue-600 mt-0.5">
                      R$ {pedido.valorTotal.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status Operacional</p>
                    <div>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-xs font-bold border mt-0.5 uppercase tracking-wide ${obterClasseStatus(pedido.status)}`}>
                        {pedido.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-end items-center sm:pl-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
                  <Button
                    variant="secondary"
                    onClick={() => handleAlternarDetalhes(pedido.id)}
                    className="w-full sm:w-auto text-xs py-2 px-4 font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    {ehExpandido ? 'Ocultar Sub-itens' : 'Ver Detalhes'}
                  </Button>
                </div>
              </div>

              {ehExpandido && (
                <div className="mt-4 border-t border-gray-100 pt-4 bg-gray-50/50 rounded-xl p-3 sm:p-4 space-y-3 animate-in fade-in duration-200 w-full">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 text-left">Discriminação das Variações Adquiridas</h4>

                  {pedido.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs w-full"
                    >
                      <div className="flex items-start space-x-3 text-left">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.variacao.nomeProduto}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{item.variacao.detalhes}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-tight whitespace-nowrap">
                            SKU: {item.variacao.sku} | Qtd: {item.quantidade}x
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100/70 w-full sm:w-auto">
                        <span className="text-sm font-black text-gray-900 sm:block">
                          R$ {item.subtotal.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Un: R$ {item.precoUnitario.toFixed(2)}
                        </span>
                      </div>

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