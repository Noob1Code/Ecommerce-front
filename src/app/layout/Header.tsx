import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../features/cart';
import { useAuthStore, useAuthorization } from '../../features/auth';

export const Header = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const { isAuthenticated, user, isOperationalStaff } = useAuthorization();
  const logoutUser = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight text-blue-600 transition-colors hover:text-blue-700">
            Mercado Preso
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {isOperationalStaff && (
            <Link 
              to="/backoffice" 
              className="text-sm font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 hover:bg-amber-100 transition-all"
            >
              Backoffice Panel
            </Link>
          )}

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
            
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-gray-900">{user.name}</p>
                <p className="text-[10px] text-gray-400 font-mono tracking-wide">
                  {user.roles[0]?.replace('ROLE_', '')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                type="button"
                className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 bg-gray-50 hover:bg-gray-100 px-4 py-1.5 rounded-md border border-gray-200"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};