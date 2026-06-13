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
      <div className="flex min-h-[60vh] items-center justify-center">
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Seu carrinho está vazio</h2>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Adicione produtos ao seu carrinho de compras antes de prosseguir para o fluxo de finalização e pagamento seguro.
        </p>
        <Link 
          to="/" 
          className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md"
        >
          Navegar pelo Catálogo de Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Barra de Título Superior */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Carrinho de Compras ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'})
        </h1>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-600 border border-red-200 bg-red-50/50 px-4 py-2 rounded-lg transition-all shadow-2xs"
        >
          Esvaziar Carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Listagem de Itens no Carrinho */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card 
              key={item.skuId} 
              className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Container da Imagem */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-mono">
                  {item.selectedSku.images?.[0]?.imageUrl ? (
                    <img 
                      src={item.selectedSku.images[0].imageUrl} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    'Sem Imagem'
                  )}
                </div>
                
                {/* Metadados do Produto */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 font-mono">SKU: {item.selectedSku.skuCode}</p>
                  <p className="mt-0.5 text-xs text-gray-500 font-medium">
                    {item.selectedSku.options.map((o) => `${o.attributeName}: ${o.value}`).join(' | ')}
                  </p>
                  
                  {/* Responsabilidade de Formatação Unificada na Camada Visuall */}
                  <span className="mt-2 inline-block text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      item.selectedSku.price
                    )}
                  </span>
                </div>
              </div>

              {/* Controles de Quantidade e Ações */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecrement(item.skuId, item.quantity)}
                    className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold select-none transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.skuId, item.quantity, item.selectedSku.stock)}
                    className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold select-none transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal por Linha Calculado Baseado no Preço Puro de Domínio */}
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-1 min-w-[110px]">
                  <span className="text-base font-black text-gray-900 hidden sm:block">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      item.selectedSku.price * item.quantity
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.skuId)}
                    className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Resumo Lateral Financeiro */}
        <div className="lg:col-span-4">
          <Card className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Resumo do Pedido</h2>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                <span>Subtotal Itens</span>
                <span className="font-bold text-gray-900">{formattedCartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium border-b border-gray-100 pb-4">
                <span className="text-gray-500">Logística de Entrega</span>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-wide">
                  Frete Grátis
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-bold text-gray-900">Total Geral</span>
                <span className="text-2xl font-black text-blue-600">{formattedCartTotal}</span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                variant="primary"
                onClick={handleCheckoutRedirect}
                className="w-full py-3.5 text-sm font-bold uppercase tracking-wider shadow-md flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700"
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