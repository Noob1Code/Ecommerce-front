import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../domain/product.types';
import { useCartStore } from '../../../app/store';
import { Button, Card } from '../../../shared/components/ui';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Card className="group flex flex-col transition-all hover:shadow-md">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        <Button
          variant="icon"
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 z-10"
          aria-label="Add to cart"
          title="Quick add to cart"
        >
          {isAdded ? (
            <svg className="h-5 w-5 text-green-500 transition-colors group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          <span className="text-lg font-bold text-gray-900">{product.formattedPrice}</span>
        </div>
      </div>
    </Card>
  );
};