import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../app/store';
import { useProduct } from '../hooks/useProduct';
import { Button, Spinner, ErrorMessage } from '../../../shared/components/ui';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Pegamos os itens do carrinho para checar se o limite já foi alcançado
  const { items: cartItems, addItem } = useCartStore();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id || '');

  const [isAdded, setIsAdded] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Refs para gerenciar a animação de Long Press
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  // Lógica para verificar o limite de estoque
  const cartItem = cartItems.find((item) => item.id === product?.id);
  const isMaxStockReached = product ? (cartItem?.quantity || 0) >= product.stock : false;

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Ignora cliques com botão direito e ignora se não tiver mais estoque
    if (('button' in e && e.button !== 0) || isMaxStockReached || !product) return;
    
    startTimeRef.current = Date.now();
    
    // Animação de preenchimento (0 a 100%)
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / 600) * 100, 100); // 600ms = 100%
      setProgress(newProgress);

      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Se chegou no 100%, dispara o LONG PRESS!
        addItem(product);
        navigate('/cart');
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Se o mouse sair do botão (Cancelamento)
  const handlePressCancel = () => {
    cancelAnimationFrame(animationRef.current);
    setProgress(0);
    startTimeRef.current = 0;
  };

  // Se soltar o clique (Short press)
  const handlePressEnd = () => {
    cancelAnimationFrame(animationRef.current);
    const elapsed = Date.now() - startTimeRef.current;
    
    // Se soltou antes de 600ms, é um clique rápido (SHORT PRESS)
    if (elapsed > 0 && elapsed < 600 && product && !isMaxStockReached) {
       addItem(product);
       setIsAdded(true);
       setTimeout(() => setIsAdded(false), 2000);
    }
    
    setProgress(0);
    startTimeRef.current = 0;
  };

  // Limpa animação se desmontar a tela
  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorMessage 
          title="Product Not Found"
          message={error?.message || "We couldn't load the details for this product."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-900 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div className="overflow-hidden rounded-lg bg-gray-100 shadow-sm border border-gray-200">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-3xl tracking-tight text-gray-900">{product.formattedPrice}</p>
          </div>
          
          {/* Mostra a quantidade real do estoque! */}
          <p className={`mt-2 text-sm font-medium ${isMaxStockReached ? 'text-red-500' : 'text-green-600'}`}>
            {product.stock > 0 
              ? `${product.stock} items available in stock` 
              : 'Out of stock'}
          </p>

          <div className="mt-6">
            <div className="space-y-6 text-base text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col space-y-4">
            {/* Botão com Barra de Progresso interna */}
            <Button
              variant={isMaxStockReached ? 'secondary' : 'primary'}
              className="relative w-full py-4 text-base shadow-sm select-none overflow-hidden"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressCancel}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onTouchCancel={handlePressCancel}
              disabled={isMaxStockReached}
            >
              {/* Layer da barra de progresso (0-100) */}
              <div 
                className="absolute left-0 top-0 h-full bg-blue-800 transition-none opacity-40" 
                style={{ width: `${progress}%` }} 
              />
              
              <span className="relative z-10 font-medium">
                {isMaxStockReached 
                  ? 'Max Limit Reached' 
                  : isAdded 
                  ? 'Added to Bag! ✓' 
                  : 'Add to Bag (Hold to Checkout)'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};