import { Link } from 'react-router-dom';
import { Button, Card, ErrorMessage, Spinner } from '../../../shared/components/ui';
import { useCartController } from '../hooks/useCartController';

export const Cart = () => {
  const {
    items,
    isEmpty,
    isLoading,
    error,
    totalItemsCount,
    formattedCartTotal,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleClear,
    handleCheckoutRedirect,
  } = useCartController();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4 py-12 w-full max-w-xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 text-center">Seu carrinho está vazio</h2>
        <p className="text-sm text-gray-500 text-center px-4">
          Adicione produtos ao seu carrinho de compras antes de prosseguir para o fluxo de finalização e pagamento seguro.
        </p>
        <Link
          to="/"
          className="mt-4 w-full sm:w-auto text-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md active:scale-95 transform"
        >
          Navegar pelo Catálogo de Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Carrinho de Compras
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-400 mt-0.5">
            Você selecionou {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'} para compra
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-center w-full sm:w-auto text-xs font-bold uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-600 border border-red-200 bg-red-50/50 px-4 py-2.5 rounded-lg transition-all shadow-2xs active:scale-98"
        >
          Esvaziar Carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start w-full">
        <div className="lg:col-span-8 space-y-4 w-full">
          {items.map((item) => (
            <Card
              key={item.skuId}
              className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4 w-full sm:w-auto">
                {/* 🪄 ARQUITETURA DEFENSIVA: Contêiner de imagem removido completamente aqui para evitar o selo "Sem Imagem" */}

                <div className="flex-1">
                  {/* 🛡️ BLINDAGEM DE ROTA: Removido a tag <Link> interna para impedir redirecionamentos corrompidos com id 'undefined' */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400 font-mono tracking-tight">SKU: {item.selectedSku.skuCode}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5 leading-normal">
                    {item.selectedSku.options.map((o) => `${o.attributeName}: ${o.value}`).join(' | ')}
                  </p>
                  <div className="mt-1.5 sm:mt-1">
                    <span className="inline-block text-xs font-bold text-gray-700 bg-gray-100 sm:bg-transparent px-2 py-0.5 sm:px-0 sm:py-0 rounded">
                      {item.precoFormatado}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="flex items-center gap-1.5 bg-gray-50/80 p-1 border border-gray-200 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDecrement(item.skuId, item.quantity)}
                    className="h-7 w-7 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold select-none transition-colors shadow-2xs active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs sm:text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.skuId, item.quantity, item.selectedSku.stock)}
                    className="h-7 w-7 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold select-none transition-colors shadow-2xs active:scale-95"
                  >
                    +
                  </button>
                </div>

                <div className="text-right flex flex-col items-end justify-center min-w-[90px] sm:min-w-[110px] gap-0.5">
                  <span className="text-sm sm:text-base font-black text-gray-900">
                    {item.subtotalFormatado}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.skuId)}
                    className="text-[11px] font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider mt-0.5 active:scale-95 block"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-4 w-full">
          <Card className="bg-white p-5 sm:p-6 border border-gray-200 shadow-sm rounded-xl">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Resumo do Pedido</h2>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-400">
                <span>Subtotal Itens</span>
                <span className="font-bold text-gray-900">{formattedCartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium border-b border-gray-100 pb-4">
                <span className="text-gray-400">Logística de Entrega</span>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-wide">
                  Frete Grátis
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm sm:text-base font-bold text-gray-900">Total Geral</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600">{formattedCartTotal}</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <Button
                type="button"
                variant="primary"
                onClick={handleCheckoutRedirect}
                className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all active:scale-[0.99]"
              >
                Prosseguir para o Checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};