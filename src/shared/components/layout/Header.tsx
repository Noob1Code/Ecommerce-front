import { Link } from 'react-router-dom';
import { useCartStore } from '../../../app/store';

export const Header = () => {
  // We calculate the total number of items, not just unique products
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Store Name */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight text-blue-600 transition-colors hover:text-blue-700">
            Cacats viado
          </Link>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            Sign in
          </Link>
          
          <Link to="/cart" className="group flex items-center p-2 relative">
            <svg
              className="h-6 w-6 flex-shrink-0 text-gray-400 transition-colors group-hover:text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="sr-only">items in cart, view bag</span>
            
            {/* Cart Badge */}
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
};