import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../../app/store/useCartStore';

export const Checkout = () => {
  const navigate = useNavigate();
  const { getCartTotal, clearCart, items } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = getCartTotal();

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

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call for payment processing
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      alert('Order placed successfully! Thank you for your purchase.');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Checkout</h1>
      
      <div className="bg-white shadow-sm sm:rounded-lg border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleCheckout}>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
                  <div className="mt-1">
                    <input type="text" id="address" name="address" required className="block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1">
                    <input type="text" id="city" name="city" required className="block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                  <div className="mt-1">
                    <input type="text" id="zip" name="zip" required className="block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total Amount</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};