import { Link } from 'react-router-dom';
import { useCartStore } from '../../../app/store/useCartStore';

export const Cart = () => {
  // Extracting clearCart from the Zustand store
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const cartTotal = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your bag is empty</h2>
        <p className="text-gray-500">Looks like you haven't added any items yet.</p>
        <Link
          to="/"
          className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header section with the Clear Cart button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="bg-white shadow-sm sm:rounded-lg border border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="flex py-6 px-4 sm:px-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm mt-4">
                  <div className="flex items-center">
                    <label htmlFor={`quantity-${item.id}`} className="sr-only">
                      Quantity
                    </label>
                    
                    {/* Advanced Quantity Selector */}
                    <div className="flex items-center rounded-md border border-gray-300 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const inputValue = parseInt(e.target.value, 10);
                          if (!isNaN(inputValue)) {
                            const clampedValue = Math.max(1, Math.min(inputValue, item.stock));
                            updateQuantity(item.id, clampedValue);
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
                            updateQuantity(item.id, 1);
                          }
                        }}
                        className="w-16 border-y-0 border-x border-gray-300 py-1 text-center text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="font-medium text-red-600 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-gray-50 px-4 py-6 sm:rounded-lg sm:px-6 border border-gray-200">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Subtotal</p>
          <p>${cartTotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 mb-6">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or{' '}
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Continue Shopping<span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};