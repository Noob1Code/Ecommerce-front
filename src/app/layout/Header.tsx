import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth';
import { useSyncCart } from '../../features/cart';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useNotificationModalStore } from '../../shared/store/useNotificationModalStore';

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const user = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.fazerLogout);
  const clearCartLocal = useCartStore((state) => state.clearCart);
  const showConfirm = useNotificationModalStore((state) => state.showConfirm);
  
  useSyncCart();

  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      
      if (
        mobileNavRef.current && 
        !mobileNavRef.current.contains(event.target as Node) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileNavOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    showConfirm({
      title: 'Deslogar',
      message: 'Deseja realmente sair da sua conta?',
      onConfirm: () => {
        logout();
        clearCartLocal();
        setIsMenuOpen(false);
        setIsMobileNavOpen(false);
        navigate('/login');
      }
    });
  };

  const initialName = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';
  const hasPurchasePermission = !user || user.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );
  const isCorporateUser = user?.perfis?.some((p) =>
    ['ROLE_ADMIN', 'ROLE_ESTOQUE', 'ROLE_FATURAMENTO'].includes(p)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-4 sm:gap-8">
          <button
            ref={mobileButtonRef}
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="block md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-gray-900">
              Modular<span className="text-blue-600">Store</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Catalogo</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {hasPurchasePermission && (
            <Link
              to="/cart"
              className="group relative flex items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.121-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white animate-in zoom-in duration-150">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          )}

          <div className="relative flex items-center border-l border-gray-200 pl-2 sm:pl-4" ref={menuRef}>
            {user ? (
              <>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="flex flex-col text-right hidden sm:flex select-none">
                    <span className="text-xs font-bold text-gray-900 max-w-[120px] truncate">{user.nome}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Minha Conta ▼</span>
                  </div>

                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform border-2 border-white ring-1 ring-gray-100 shrink-0">
                    {initialName}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ações da Conta</p>
                    </div>

                    {user.perfis?.some((p) => ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)) && (
                      <Link
                        to="/meus-pedidos"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h12l1 12H4L5 9z" />
                        </svg>
                        Meus Pedidos
                      </Link>
                    )}

                    <Link
                      to="/minha-conta"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Editar Cadastro
                    </Link>

                    {user.perfis?.some((p) => ['ROLE_ADMIN', 'ROLE_FATURAMENTO'].includes(p)) && (
                      <Link
                        to="/backoffice/faturamento"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-700 font-bold bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                      >
                        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Faturamento Global
                      </Link>
                    )}

                    {isCorporateUser && (
                      <Link
                        to="/backoffice"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Painel Administrativo
                      </Link>
                    )}

                    <div className="my-1 border-t border-gray-100"></div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Encerrar Sessão
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-3 animate-in slide-in-from-top-4 duration-200" ref={mobileNavRef}>
          <Link
            to="/"
            onClick={() => setIsMobileNavOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            Catalogo
          </Link>
        </div>
      )}
    </header>
  );
};