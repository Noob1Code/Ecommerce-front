import { Link } from 'react-router-dom';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const Header = () => {
  const cartItemCount = useCartStore((state) => 
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo Snap */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-gray-950">
              Modular<span className="text-blue-600">Store</span>
            </span>
          </Link>
          
          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Catalog</Link>
            {user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_ESTOQUE')) && (
              <Link to="/backoffice" className="hover:text-blue-600 transition-colors font-semibold text-amber-600">
                Backoffice Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Action Widgets Toolbar */}
        <div className="flex items-center gap-4">
          {/* Cart Icon Link Snapshot */}
          <Link 
            to="/cart" 
            className="group relative flex items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <svg 
              className="h-6 w-6 flex-shrink-0 group-hover:scale-105 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12)1-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm animate-fade-in">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Session Profile Widget */}
          <div className="flex items-center border-l border-gray-200 pl-4 gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono tracking-tighter">{user.roles[0]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to end your active authentication session?')) {
                      logout();
                      window.location.replace('/login');
                    }
                  }}
                  className="rounded-lg bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};