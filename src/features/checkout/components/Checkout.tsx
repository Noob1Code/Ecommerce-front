import { Button, Card, Spinner } from '../../../shared/components/ui';
import { useCheckoutController } from '../hooks/useCheckoutController';

export const Checkout = () => {
  const {
    items,
    user,
    isEmpty,
    formattedTotal,
    opcoesParcelamento,
    isPending,
    metodoPagamento,
    parcelas,
    sucessoCheckout,
    setMetodoPagamento,
    setParcelas,
    handleSubmit,
    concluirFluxo
  } = useCheckoutController();

  const possuiPermissaoCompra = !user || user.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  if (user && !possuiPermissaoCompra) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16 text-center">
        <Card className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 shadow-sm animate-in fade-in zoom-in-95 duration-150">
          <h2 className="text-xl font-bold text-red-700 mb-2">Acesso Restrito a Compras</h2>
          <p className="text-sm text-red-600 mb-6">
            Identificamos que você está autenticado sob uma credencial funcional corporativa.
            Contas de funcionários não possuem permissão para gerenciar sacolas ou fechar pedidos.
          </p>
          <Button variant="primary" className="w-full sm:w-auto" onClick={() => window.location.assign('/')}>
            Voltar para a Vitrine
          </Button>
        </Card>
      </div>
    );
  }

  if (sucessoCheckout) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 text-center">
        <Card className="p-5 sm:p-8 border border-green-200 bg-green-50/20 rounded-2xl shadow-md">
          <div className="mx-auto h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">✓</div>
          <h2 className="text-2xl font-black text-gray-900">Pedido Gerado com Sucesso!</h2>
          <p className="text-sm text-gray-500 mt-1 font-mono break-all">Código: {sucessoCheckout.pedido.id}</p>
          <p className="text-sm text-gray-600 mt-3">{sucessoCheckout.mensagem}</p>

          {/* Faturamento Dinâmico via PIX - Responsivo */}
          {sucessoCheckout.pixCopiaECola && (
            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl text-left space-y-2">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pagamento via PIX Copia e Cola</p>
              <textarea readOnly value={sucessoCheckout.pixCopiaECola} rows={3} className="w-full font-mono text-xs p-2 bg-gray-50 border rounded-lg focus:outline-none resize-none break-all" />
              <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(sucessoCheckout.pixCopiaECola || ''); alert('Código copiado!'); }} className="text-xs w-full sm:w-auto py-2">
                Copiar Chave Pix
              </Button>
            </div>
          )}

          {/* Faturamento Dinâmico via BOLETO - Responsivo */}
          {sucessoCheckout.linhaDigitavel && (
            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl text-left space-y-2">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Linha Digitável do Boleto</p>
              <input type="text" readOnly value={sucessoCheckout.linhaDigitavel} className="w-full font-mono text-xs p-2.5 bg-gray-50 border rounded-lg focus:outline-none break-all" />
              <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(sucessoCheckout.linhaDigitavel || ''); alert('Linha digitável copiada!'); }} className="text-xs w-full sm:w-auto py-2">
                Copiar Código de Barras
              </Button>
            </div>
          )}

          <div className="mt-8 border-t border-gray-100 pt-5">
            <Button variant="primary" onClick={concluirFluxo} className="w-full sm:w-auto px-6 py-2.5 font-bold">
              Acompanhar meu Pedido &rarr;
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-3 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">Seu carrinho de compras está vazio</h2>
        <p className="text-sm text-gray-400 max-w-sm">Insira mercadorias na sacola antes de prosseguir para a confirmação.</p>
        <Button variant="primary" onClick={() => window.location.assign('/')} className="mt-2 w-full sm:w-auto">
          Ver Produtos
        </Button>
      </div>
    );
  }

  const obterRotuloMeioPagamento = (tipo: string) => {
    if (tipo === 'CREDITO_CARD') return 'Crédito';
    if (tipo === 'DEBITO_CARD') return 'Débito';
    return tipo;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-6 sm:mb-8">Revisar e Fechar Pedido</h1>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start">
        <div className="w-full lg:col-span-7 space-y-6">
          <Card className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Dados do Comprador</h2>
            <div className="text-sm text-gray-900 space-y-1 font-medium break-all">
              <p><span className="text-gray-400">Titular:</span> {user?.nome}</p>
              <p><span className="text-gray-400">E-mail:</span> {user?.email}</p>
            </div>
          </Card>

          {/* Seleção de Pagamento */}
          <Card className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 pb-2">Forma de Pagamento *</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['PIX', 'BOLETO', 'CREDITO_CARD', 'DEBITO_CARD'].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => {
                    setMetodoPagamento(tipo);
                    setParcelas(1);
                  }}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all active:scale-95 ${metodoPagamento === tipo
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {obterRotuloMeioPagamento(tipo)}
                </button>
              ))}
            </div>

            {metodoPagamento === 'CREDITO_CARD' && (
              <div className="pt-2 animate-in fade-in duration-200">
                <label htmlFor="parcelas" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Opções de Parcelamento</label>
                <select id="parcelas" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} className="w-full p-2.5 text-sm border rounded-lg bg-white font-semibold text-gray-700 focus:outline-none">
                  {opcoesParcelamento.map((opcao) => (
                    <option key={opcao.parcelas} value={opcao.parcelas}>
                      {opcao.texto}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Card>

          {/* Lista de Itens do Pedido */}
          <Card className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 pb-2">Produtos Escolhidos ({items.length})</h2>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.skuId} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">SKU: {item.selectedSku.skuCode} | Qtd: {item.quantity}x</p>
                  </div>
                  <span className="font-bold text-gray-900 whitespace-nowrap self-end sm:self-auto bg-gray-50 sm:bg-transparent px-2 py-0.5 sm:px-0 rounded">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      item.selectedSku.price * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Resumo Financeiro da Direita */}
        <div className="w-full lg:col-span-5">
          <Card className="bg-white p-4 sm:p-5 border border-gray-200 shadow-sm rounded-xl">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Resumo Econômico</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Subtotal Itens</span>
                <span className="font-bold text-gray-900">{formattedTotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium border-b border-gray-100 pb-4">
                <span className="text-gray-500">Logística de Entrega</span>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 uppercase tracking-wide">Frete Grátis</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-gray-900">Total a Pagar</span>
                <span className="text-2xl font-black text-blue-600">{formattedTotal}</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-3.5 text-sm font-bold uppercase tracking-wider shadow-md bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
              >
                {isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Spinner className="h-4 w-4 text-white" />
                    <span>Transmitindo Pedido...</span>
                  </div>
                ) : (
                  'Confirmar e Finalizar Compra'
                )}
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};