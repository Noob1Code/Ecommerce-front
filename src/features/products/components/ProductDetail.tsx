import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../../../app/store/useCartStore';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id!);
  
  const addItem = useCartStore((state) => state.addItem);

  // States and Refs for the Long Press logic
  const [buttonText, setButtonText] = useState('Add to bag');
  // Corrigido para number | null (tipo de retorno do setTimeout no navegador)
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <p className="text-xl text-gray-600">Product not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleShortPress = () => {
    addItem(product);
    setButtonText('Added!');
    
    // Reset button text after 2 seconds
    window.setTimeout(() => {
      setButtonText('Add to bag');
    }, 2000);
  };

  const handleLongPress = () => {
    addItem(product);
    navigate('/cart');
  };

  const startPress = () => {
    isLongPress.current = false;
    // Usando window.setTimeout explicitamente para garantir que o TS entenda que estamos no Browser
    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      handleLongPress();
    }, 500); // 500ms threshold for long press
  };

  const endPress = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    // If the timeout didn't finish, it means it was a quick click
    if (!isLongPress.current) {
      handleShortPress();
    }
  };

  const cancelPress = () => {
    // If the user moves the mouse out of the button while holding, cancel it
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block transition-colors">
        &larr; Back to Products
      </Link>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center" />
        </div>
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-700">{product.description}</p>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">In Stock: {product.stock} units</p>
          </div>
          <div className="mt-10 flex">
            <button
              type="button"
              onMouseDown={startPress}
              onMouseUp={endPress}
              onMouseLeave={cancelPress}
              onTouchStart={startPress}
              onTouchEnd={endPress}
              className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-colors select-none"
            >
              {buttonText}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Tip: Hold the button to go directly to cart.
          </p>
        </div>
      </div>
    </div>
  );
};