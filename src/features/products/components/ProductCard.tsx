import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card } from '../../../shared/components/ui';
import { RoleGuard, useAuthStore } from '../../auth';
import { useCartController } from '../../cart';
import type { Product } from '../domain/product.types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { handleAddToCart: addToCart } = useCartController();
  const [isAdded, setIsAdded] = useState(false);

  const usuario = useAuthStore((state) => state.usuario);

  const defaultSku = product.skus && product.skus.length > 0 ? product.skus[0] : null;
  const displayImageUrl = defaultSku && defaultSku.images.length > 0
    ? defaultSku.images[0].imageUrl
    : '/fallback-image.jpg';
  const displayPrice = defaultSku ? defaultSku.price : '$0.00';
  const isOutOfStock = defaultSku ? defaultSku.stock <= 0 : true;

  const possuiPermissaoCompra = !usuario || usuario.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultSku || isOutOfStock) return;

    addToCart(defaultSku.id, defaultSku.stock);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleQuickEditRedirect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/backoffice?search=${encodeURIComponent(product.name)}`);
  };

  return (
    <Card className="group flex flex-col transition-all hover:shadow-md relative rounded-xl h-full bg-white border border-gray-200 shadow-xs">
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gray-50 rounded-t-xl shrink-0">

        <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}>
          <button
            type="button"
            onClick={handleQuickEditRedirect}
            className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 bg-amber-600 hover:bg-amber-700 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1.5 rounded-xl shadow-md transition-all border border-amber-500 hover:scale-105 active:scale-95 flex items-center space-x-1"
            title="Acessar painel de gerenciamento deste item"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Editar Ativo</span>
          </button>
        </RoleGuard>

        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={displayImageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {possuiPermissaoCompra && (
          <Button
            variant="icon"
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10"
            aria-label={isOutOfStock ? "Esgotado" : "Adicionar ao carrinho"}
          >
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">Falta</span>
            ) : isAdded ? (
              <svg className="h-5 w-5 text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            )}
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-1.5 p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="text-[11px] sm:text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-base sm:text-lg font-black text-blue-600">
            {displayPrice}
          </span>
          {defaultSku && defaultSku.stock > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
              {defaultSku.stock} un
            </span>
          )}
        </div>
      </div>

    </Card>
  );
};