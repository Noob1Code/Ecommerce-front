import { Link } from 'react-router-dom';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const Header = () => {
  const contagemItensCarrinho = useCartStore((state) => 
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const usuario = useAuthStore((state) => state.usuario);
  const fazerLogout = useAuthStore((state) => state.fazerLogout);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-gray-900">
              Modular<span className="text-blue-600">Store</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Catálogo</Link>
            
            {/* CORREÇÃO DO FLUXO: Botão agora aparece sem problemas para ADMIN e ESTOQUE na barra superior */}
            {usuario && (usuario.perfis.includes('ROLE_ADMIN') || usuario.perfis.includes('ROLE_ESTOQUE')) && (
              <Link to="/backoffice" className="hover:text-blue-600 transition-colors font-semibold text-amber-600">
                Painel Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="group relative flex items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="h-6 w-6 flex-shrink-0 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.121-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {contagemItensCarrinho > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                {contagemItensCarrinho}
              </span>
            )}
          </Link>

          <div className="flex items-center border-l border-gray-200 pl-4 gap-4">
            {usuario ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900">{usuario.nome}</p>
                  <p className="text-[10px] text-gray-400 font-mono tracking-tighter">{usuario.perfis[0]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Tem certeza de que deseja encerrar sua sessão ativa?')) {
                      fazerLogout();
                      window.location.replace('/login');
                    }
                  }}
                  className="rounded-lg bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 transition-all"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};