import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../../cart';
import { useAuthStore } from '../../auth';
import { createOrderApi, type BackendPedidoRequestDTO } from '../api/checkoutApi';
import { Card, Button, Input, Spinner } from '../../../shared/components/ui';

export const Checkout = () => {
  const navigate = useNavigate();
  
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const cartTotal = items.reduce((acc, item) => acc + item.selectedSku.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal);

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

    const orderPayload: BackendPedidoRequestDTO = {
      clienteId: user.id,
      itens: items.map((item) => ({
        variacaoId: item.skuId,
        quantidade: item.quantity,
      })),
    };

    placeOrder(orderPayload);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Checkout</h1>
      
      <Card className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                Shipping Logistics Information
              </h2>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Delivery Address *
                  </label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isPending}
                    placeholder="123 Corporate Ave, Apt 4B"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isPending}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code *
                  </label>
                  <Input
                    type="text"
                    id="zip"
                    name="zip"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    disabled={isPending}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Financial Order Summary</h2>
              <div className="flex justify-between text-base font-medium text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="font-semibold text-gray-600">Total Settlement Amount</p>
                <p className="text-xl font-black text-gray-900">{formattedTotal}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3.5 text-base font-bold uppercase tracking-wider shadow-sm"
                variant="primary"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <Spinner className="h-5 w-5 text-white" />
                    <span>Processing Transaction...</span>
                  </div>
                ) : (
                  'Confirm & Authorize Order'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};