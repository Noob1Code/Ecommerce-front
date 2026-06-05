import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Card, Button, EmptyState } from '../../../shared/components/ui';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  // Dynamically aggregate and calculate checkout order totals snapshot values
  const cartSubtotal = items.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartSubtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Corrected mapping injecting the UI button primitve directly inside the action container layout node */}
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Explore our high-quality catalog selection layout nodes to append items to your basket fulfillment streams."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Shopping Cart</h1>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        {/* Cart Item Grid Rows List entries */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-gray-100/60 p-4 rounded-xl border border-gray-200/50">
            <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase">
              Items Summary ({items.length} positions)
            </span>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Purge All Items
            </button>
          </div>

          {items.map((item) => {
            const itemImageUrl = item.selectedSku.images && item.selectedSku.images.length > 0
              ? item.selectedSku.images[0].imageUrl
              : '/fallback-image.jpg';

            const skuOptionsLabel = item.selectedSku.options
              .map((opt) => `${opt.attributeName}: ${opt.value}`)
              .join(' | ');

            const rowTotalPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              item.selectedSku.price * item.quantity
            );

            return (
              <Card key={item.skuId} className="p-4 flex gap-4 bg-white border border-gray-200 rounded-xl relative hover:shadow-sm transition-all">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                  <img src={itemImageUrl} alt={item.product.name} className="h-full w-full object-cover object-center" />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <h3>{item.product.name}</h3>
                      <p className="ml-4">{rowTotalPrice}</p>
                    </div>
                    <p className="mt-1 text-xs font-mono text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100">
                      {skuOptionsLabel || 'Standard configuration'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Ref: {item.selectedSku.skuCode}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Adjustment Selector Controls */}
                    <div className="flex items-center gap-1.5 border border-gray-300 rounded-lg p-0.5 bg-gray-50/50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.skuId, item.quantity - 1)}
                        className="h-7 w-7 bg-white rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm shadow-sm border border-gray-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.selectedSku.stock}
                        onClick={() => updateQuantity(item.skuId, item.quantity + 1)}
                        className="h-7 w-7 bg-white rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm shadow-sm border border-gray-200 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.skuId)}
                      className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100/80 px-2.5 py-1.5 rounded-md border border-red-100 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Order Total Breakdown Summary Card Panel */}
        <div className="mt-16 rounded-xl bg-white border border-gray-200 p-6 shadow-sm sm:p-8 lg:col-span-5 lg:mt-0 lg:p-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Order Checkout Summary</h2>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Cart Subtotal</span>
              <span className="font-semibold text-gray-900">{formattedSubtotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-4">
              <span>Estimated Shipping</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                Free
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-bold text-gray-900">Estimated Grand Total</span>
              <span className="text-2xl font-black text-gray-900">{formattedSubtotal}</span>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 text-base font-semibold uppercase tracking-wider shadow-sm"
              variant="primary"
            >
              Proceed to Secure Checkout &rarr;
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors">
              &larr; Or continue browsing catalog inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};