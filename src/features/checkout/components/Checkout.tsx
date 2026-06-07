import { Link } from 'react-router-dom';
import { useCheckoutController } from '../hooks/useCheckoutController';
import { Card, Button, Spinner } from '../../../shared/components/ui';

export const Checkout = () => {
  const {
    items,
    user,
    isEmpty,
    formattedTotal,
    isPending,
    handleSubmit,
  } = useCheckoutController();

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">You need items in your cart to checkout.</p>
        <Link 
          to="/" 
          className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Review Order</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">Customer Profile</h2>
            <div className="text-sm text-gray-900 space-y-1">
              <p>
                <span className="font-semibold text-gray-500">Name:</span> {user?.name || 'Guest User'}
              </p>
              <p>
                <span className="font-semibold text-gray-500">Account ID:</span>{' '}
                <span className="font-mono text-xs bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{user?.id}</span>
              </p>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 pb-2">
              Items Summary ({items.length})
            </h2>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.skuId} className="py-3 flex justify-between items-start text-sm gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.selectedSku.skuCode}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}x</p>
                  </div>
                  {/* CORREÇÃO: Subtotal individual de itens no resumo formatado em BRL */}
                  <span className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      item.selectedSku.price * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Financial Summary</h2>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal Items</span>
                <span className="font-semibold text-gray-900">{formattedTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-4">
                <span>Logistic Fulfillment</span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-bold text-gray-900">Total Settlement</span>
                <span className="text-2xl font-black text-gray-900">{formattedTotal}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3.5 text-base font-bold uppercase tracking-wider shadow-sm"
                variant="primary"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <Spinner className="h-5 w-5 text-white" />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  'Place Order & Confirm'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};