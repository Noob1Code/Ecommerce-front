import { useOrdersController } from '../hooks/useInvoicingController';
import { Spinner, Card, ErrorMessage, EmptyState } from '../../../shared/components/ui'; //

// Dicionário utilitário para mapeamento visual de cores e bordas com Tailwind CSS
const STATUS_BADGE_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
  DELIVERED: 'bg-purple-50 text-purple-700 border-purple-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  UNKNOWN: 'bg-gray-50 text-gray-700 border-gray-200',
};

export const InvoicingPanel = () => {
  // Consome a inteligência abstrata do hook controlador (Lei 1)
  const { orders, isLoaderActive, errorMessage } = useOrdersController();

  // 1. Estado de Carregamento (Loading)
  if (isLoaderActive) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner className="h-8 w-8 text-blue-600" /> {/* */}
      </div>
    );
  }

  // 2. Estado de Erro na Requisição
  if (errorMessage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ErrorMessage message={errorMessage} /> {/* */}
      </div>
    );
  }

  // 3. Estado de Lista Vazia
  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState 
          title="Nenhum pedido registrado" 
          description="Não constam transações comerciais registradas no sistema de faturamento até o momento." 
        /> {/* */}
      </div>
    );
  }

  // 4. Renderização Declarativa da Grade de Pedidos (Interface Principal)
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho da Tela */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Painel de Faturamento</h1>
        <p className="mt-2 text-sm text-gray-500">
          Visão geral administrativa de todas as ordens de vendas e fluxos transacionais.
        </p>
      </div>

      {/* Lista Linear de Pedidos Transacionados */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors"> {/* */}
            
            {/* Bloco Superior: Identificação e Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">ID da Ordem:</span>
                  <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    {order.id}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Data/Hora: {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${STATUS_BADGE_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Bloco Central Informativo: Dados do Comprador */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border border-gray-200/60">
              <div>
                <span className="font-bold text-gray-400 block uppercase tracking-wider mb-1">Cliente</span>
                <span className="text-gray-900 font-medium text-sm">{order.customer.name}</span>
                <span className="text-gray-500 block mt-0.5">{order.customer.email}</span>
              </div>
              <div>
                <span className="font-bold text-gray-400 block uppercase tracking-wider mb-1">Documentação</span>
                <span className="text-gray-900 font-mono">{order.customer.document}</span>
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

            {/* Bloco de Itens Comprados */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Itens e Variações</h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white">
                {order.items.map((item) => (
                  <div key={item.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2 hover:bg-gray-50/70 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <div className="flex flex-wrap gap-x-4 text-xs text-gray-500">
                        <span>SKU: <strong className="font-mono text-gray-700">{item.skuCode}</strong></span>
                        {item.details && <span>Especificações: <span className="text-gray-600 italic">{item.details}</span></span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8 text-xs sm:text-sm">
                      <span className="text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                        {item.quantity} un × R$ {item.unitPrice.toFixed(2)}
                      </span>
                      <span className="font-bold text-gray-900 min-w-[80px] text-right">
                        R$ {item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco de Fechamento Monetário */}
            <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-4">
              <span className="text-sm font-medium text-gray-500">Montante Consolidado:</span>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                R$ {order.totalValue.toFixed(2)}
              </span>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};