import { useOrdersController } from '../hooks/useInvoicingController';
import { Spinner, Card, ErrorMessage, EmptyState } from '../../../shared/components/ui';

const STATUS_BADGE_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
  DELIVERED: 'bg-purple-50 text-purple-700 border-purple-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  UNKNOWN: 'bg-gray-50 text-gray-700 border-gray-200',
};

export const InvoicingPanel = () => {
  const { orders, isLoaderActive, errorMessage } = useOrdersController();

  if (isLoaderActive) {
    return (
      <div className="flex justify-center items-center py-16 w-full">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        <EmptyState 
          title="Nenhum pedido registrado" 
          description="Não constam transações comerciais registradas no sistema de faturamento até o momento." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
      <div className="border-b border-gray-200 pb-5 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Painel de Faturamento</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Visão geral administrativa de todas as ordens de vendas e fluxos transacionais.
        </p>
      </div>

      <div className="space-y-4 w-full">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors w-full">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4 gap-3 text-left">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">ID da Ordem:</span>
                  <span className="text-xs sm:text-sm font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 break-all">
                    {order.id}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  Data/Hora: {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="shrink-0">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${STATUS_BADGE_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border border-gray-200/60 text-left">
              <div className="min-w-0">
                <span className="font-bold text-gray-400 block uppercase tracking-wider mb-1">Cliente</span>
                <span className="text-gray-900 font-medium text-sm block truncate">{order.customer.name}</span>
                <span className="text-gray-500 block mt-0.5 truncate">{order.customer.email}</span>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-gray-400 block uppercase tracking-wider mb-1">Documentação</span>
                <span className="text-gray-900 font-mono block">{order.customer.document}</span>
                <span className="text-gray-500 block mt-0.5">Perfil: {order.customer.userType}</span>
              </div>
              <div>
                <span className="font-bold text-gray-400 block uppercase tracking-wider mb-1">Situação Cadastral</span>
                <span className="inline-flex items-center gap-1.5 mt-0.5 font-medium text-gray-800">
                  {order.customer.isActive ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Conta Ativa
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Conta Inativa
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-3 w-full text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-0.5">Itens e Variações</h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white w-full">
                {order.items.map((item) => (
                  <div key={item.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-3 hover:bg-gray-50/70 transition-colors w-full">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                        <span>SKU: <strong className="font-mono text-gray-700">{item.skuCode}</strong></span>
                        {item.details && <span>Especificações: <span className="text-gray-600 italic">{item.details}</span></span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-8 text-xs sm:text-sm border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 w-full sm:w-auto">
                      <span className="text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                        {item.quantity} un × R$ {item.unitPrice.toFixed(2)}
                      </span>
                      <span className="font-bold text-gray-900 min-w-[80px] text-right whitespace-nowrap">
                        R$ {item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-4 text-left">
              <span className="text-sm font-medium text-gray-500">Montante Consolidado:</span>
              <span className="text-xl font-black text-gray-900 tracking-tight whitespace-nowrap pl-2">
                R$ {order.totalValue.toFixed(2)}
              </span>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};