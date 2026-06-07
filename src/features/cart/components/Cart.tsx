import { Link } from 'react-router-dom';
import { useCartController } from '../hooks/useCartController';
import { Card, Button } from '../../../shared/components/ui';

export const Cart = () => {
  // Camada de Lógica: Consome unicamente as propriedades e ações mastigadas do Controlador
  const {
    items,
    isEmpty,
    totalItemsCount,
    formattedCartTotal,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleClear,
    handleCheckoutRedirect,
  } = useCartController();

  // Tratamento visual prioritário para estado de Carrinho Vazio
  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">Add products to your cart before proceeding to the secure checkout loop.</p>
        <Link 
          to="/" 
          className="mt-4 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Browse Products Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Grid: Reactive Selection Row Tables */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card 
              key={item.skuId} 
              className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              {/* Product Info snapshot */}
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-xs text-gray-400 font-mono">
                  {item.selectedSku.images?.[0]?.imageUrl ? (
                    <img 
                      src={item.selectedSku.images[0].imageUrl} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    'No Img'
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 hover:text-blue-600">
                    <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 font-mono">SKU: {item.selectedSku.skuCode}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.selectedSku.options.map((o) => `${o.attributeName}: ${o.value}`).join(' | ')}
                  </p>
                  <span className="mt-2 inline-block text-sm font-bold text-gray-900">
                    {item.selectedSku.formattedPrice}
                  </span>
                </div>
              </div>

              {/* Quantity selectors and deletion row controllers */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecrement(item.skuId, item.quantity)}
                    className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold select-none"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.skuId, item.quantity, item.selectedSku.stock)}
                    className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold select-none"
                  >
                    +
                  </button>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-1 min-w-[100px]">
                  <span className="text-base font-black text-gray-900 hidden sm:block">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      item.selectedSku.price * item.quantity
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.skuId)}
                    className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Grid: Order Settled Summary Card Panel */}
        <div className="lg:col-span-4">
          <Card className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Order Summary</h2>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal Items</span>
                <span className="font-semibold text-gray-900">{formattedCartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-4">
                <span>Shipping Logistic</span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">{formattedCartTotal}</span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                variant="primary"
                onClick={handleCheckoutRedirect}
                className="w-full py-3.5 text-base font-bold uppercase tracking-wider shadow-sm flex justify-center items-center"
              >
                Proceed to Secure Checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};