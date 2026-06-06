import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../cart';
import { useAuthStore } from '../../auth';
import { createOrderApi, type BackendPedidoRequestDTO } from '../api/checkoutApi';
import { Card, Button, Spinner } from '../../../shared/components/ui';

export const Checkout = () => {
  const navigate = useNavigate();
  
  // Clean consumption targeting our newly promoted modular cart domain feature layer
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  // Synchronously compute active totals inline based on current reactive SKU price metrics
  const cartTotal = items.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal);

  // Hook-driven async state management replacing archaic direct component setTimeouts
  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      clearCart();
      alert('Order placed successfully matching modular sales guidelines! Thank you.');
      navigate('/');
    },
    onError: () => {
      alert('An error occurred while communicating order fulfillment details to the backend.');
    }
  });

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">You need items in your cart to checkout.</p>
        <Link to="/" className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Go to Products
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Authentication required. Please sign in before finalizing transaction protocols.');
      navigate('/login');
      return;
    }

    // Explicitly mirrors your friend's Spring Boot PedidoRequestDTO validation structures 100% exactly
    const orderPayload: BackendPedidoRequestDTO = {
      clienteId: user.id,
      itens: items.map((item) => ({
        variacaoId: item.skuId, // Maps unique SKU key to backend variation placeholder
        quantidade: item.quantity,
      })),
    };

    placeOrder(orderPayload);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Review Order</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Side: Order Items List & Customer Snapshot */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Identification Profile */}
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

          {/* Detailed Items Breakdown Table */}
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
                  <span className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      item.selectedSku.price * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Financial Settlement Summary Card Panel */}
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