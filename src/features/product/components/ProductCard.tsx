import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../domain/product.types';
import { useCartStore } from '../../../app/store/useCartStore'; // Caminho atualizado

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.price);

  const sellerName = product.bestOffer?.seller?.name || 'Loja Parceira';
  const otherOffersCount = product.offers ? product.offers.length - 1 : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock, // <- Enviamos o estoque para a sua regra de negócio!
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          {product.category && (
            <p className="mb-1 text-xs font-medium text-blue-600">{product.category}</p>
          )}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          
          <div className="mt-2 text-xs text-gray-500">
            <p>Vendido por <span className="font-medium text-gray-900">{sellerName}</span></p>
            {otherOffersCount > 0 && (
              <p className="mt-0.5 text-blue-600">
                + {otherOffersCount} {otherOffersCount === 1 ? 'outra oferta' : 'outras ofertas'}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-end justify-between">
          <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Esgotado' : 'Adicionar ao carrinho'}
            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              product.stock === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : isAdded 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAdded ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};