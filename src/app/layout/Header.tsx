import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const Header = () => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Estados globais
  const usuario = useAuthStore((state) => state.usuario);
  const fazerLogout = useAuthStore((state) => state.fazerLogout);
  const contagemItensCarrinho = useCartStore((state) => 
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    const cliqueFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta?')) {
      fazerLogout();
      setMenuAberto(false);
      navigate('/login');
    }
  };

  // Pega a inicial do nome para o avatar (Desenho/Bolinha)
  const inicialNome = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Lado Esquerdo: Logo e Navegação Principal */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-gray-950">
              Modular<span className="text-blue-600">Store</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Catálogo</Link>
          </nav>
        </div>

        {/* Lado Direito: Carrinho e Usuário */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Botão do Carrinho */}
          <Link 
            to="/cart" 
            className="group relative flex items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.121-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {contagemItensCarrinho > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {contagemItensCarrinho}
              </span>
            )}
          </Link>

          {/* Seção de Autenticação */}
          <div className="relative flex items-center border-l border-gray-200 pl-4 ml-2" ref={menuRef}>
            {usuario ? (
              <>
                {/* BOLINHA/AVATAR DO USUÁRIO */}
                <button
                  onClick={() => setMenuAberto(!menuAberto)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="flex flex-col text-right hidden sm:flex">
                    <span className="text-xs font-bold text-gray-900 line-clamp-1">{usuario.nome}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Minha Conta ▼</span>
                  </div>
                  
                  {/* Círculo do Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform border-2 border-white ring-1 ring-gray-100">
                    {inicialNome}
                  </div>
                </button>

                {/* DROPDOWN MENU (O que aparece ao clicar) */}
                {menuAberto && (
                  <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-100">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Ações do Cliente</p>
                    </div>
                    
                    <Link
                      to="/meus-pedidos"
                      onClick={() => setMenuAberto(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h12l1 12H4L5 9z" />
                      </svg>
                      Meus Pedidos
                    </Link>

                    <Link
                      to="/minha-conta"
                      onClick={() => setMenuAberto(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Editar Cadastro
                    </Link>

                    {/* Exibe painel admin apenas se tiver perfil para isso */}
                    {(usuario.perfis.includes('ROLE_ADMIN') || usuario.perfis.includes('ROLE_ESTOQUE')) && (
                      <Link
                        to="/backoffice"
                        onClick={() => setMenuAberto(false)}
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
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};