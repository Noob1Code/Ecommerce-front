import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../domain/product.types';
import { useCartStore } from '../../cart';
import { RoleGuard } from '../../auth';
import { Button, Card } from '../../../shared/components/ui';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  // Extract the first SKU as fallback for catalog display presentation
  const defaultSku = product.skus && product.skus.length > 0 ? product.skus[0] : null;
  
  // Resolve primary thumbnail image matching the default resolved variant setup
  const displayImageUrl = defaultSku && defaultSku.images.length > 0 
    ? defaultSku.images[0].imageUrl 
    : '/fallback-image.jpg';

  const displayPrice = defaultSku ? defaultSku.formattedPrice : '$0.00';
  const isOutOfStock = defaultSku ? defaultSku.stock <= 0 : true;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultSku || isOutOfStock) return;

    addItem(product, defaultSku.id);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleQuickEditRedirect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Smoothly redirect the staff profile to the backoffice context pre-filtered by name
    navigate(`/backoffice?search=${encodeURIComponent(product.name)}`);
  };

  return (
    <Card className="group flex flex-col transition-all hover:shadow-md relative">
      <div className="relative h-64 overflow-hidden bg-gray-100 rounded-t-lg">
        {/* Administrative Quick Edit Control overlay triggered exclusively by staff roles */}
        <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}>
          <button
            type="button"
            onClick={handleQuickEditRedirect}
            className="absolute top-3 left-3 z-20 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-md transition-all border border-amber-500 hover:scale-105 flex items-center space-x-1"
            title="Redirect to Backoffice Inventory edit page"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Asset</span>
          </button>
        </RoleGuard>

        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={displayImageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        <Button
          variant="icon"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="absolute bottom-3 right-3 z-10"
          aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          title={isOutOfStock ? "Out of stock" : "Quick add to cart"}
        >
          {isOutOfStock ? (
            <span className="text-xs font-semibold text-red-500 px-1">Esgotado</span>
          ) : isAdded ? (
            <svg className="h-5 w-5 text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{displayPrice}</span>
          {defaultSku && defaultSku.stock > 0 && (
            <span className="text-xs text-gray-400">{defaultSku.stock} un.</span>
          )}
        </div>
      </div>
    </Card>
  );
};