import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../../../app/store/useCartStore';
import { Button, Spinner, ErrorMessage } from '../../../shared/components/ui';
import type { Offer } from '../domain/product.types';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id || '');
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOfferId(null);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage 
          message={error?.message || 'Produto não encontrado.'}
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);

  // Derivação da "Guaranteed Offer" com padronização de seller para consistência
  const activeOffer: Offer = (() => {
    if (selectedOfferId && product.offers?.length) {
      const selected = product.offers.find((o) => o.id === selectedOfferId);
      if (selected) return selected;
    }
    
    if (product.bestOffer) {
      return product.bestOffer;
    }

    return {
      id: product.id, 
      price: product.price,
      stock: product.stock,
      condition: 'NEW',
      isBuyBoxWinner: true,
      seller: undefined as any // Forçamos undefined para compatibilidade segura e real com o carrinho
    };
  })();

  const conditionText = activeOffer.condition === 'USED' 
    ? 'Usado' 
    : activeOffer.condition === 'REFURBISHED' 
      ? 'Recondicionado' 
      : 'Novo';

  const handleAddToCart = () => {
    addItem({
      id: activeOffer.id,
      productId: product.id,
      name: product.name,
      price: activeOffer.price,
      imageUrl: product.imageUrl,
      stock: activeOffer.stock,
      seller: activeOffer.seller ? { id: activeOffer.seller.id, name: activeOffer.seller.name } : undefined,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-900">Catálogo</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm transition-all duration-300">
              <h2 className="text-sm font-semibold text-blue-900 mb-4 uppercase tracking-wider">
                Resumo da Compra
              </h2>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(activeOffer.price)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Vendido e entregue por <span className="font-semibold text-gray-900">{activeOffer.seller?.name || 'Parceiro Desconhecido'}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {conditionText}
                    </span>
                    <span className={`text-sm ${activeOffer.stock === 0 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      {activeOffer.stock === 0 ? 'Sem estoque' : `Estoque: ${activeOffer.stock} unidades`}
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full sm:w-auto px-6 py-3 text-lg font-medium transition-colors ${isAdded ? '!bg-green-500 hover:!bg-green-600' : ''}`}
                  disabled={activeOffer.stock === 0}
                  onClick={handleAddToCart}
                >
                  {activeOffer.stock === 0 ? 'Esgotado' : isAdded ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            </div>
          </div>

          {product.offers && product.offers.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">Opções de compra</h3>
              <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                {product.offers.map((offer) => {
                  const isSelected = activeOffer.id === offer.id;
                  const isOutOfStock = offer.stock === 0;
                  
                  return (
                    <div 
                      key={offer.id} 
                      className={`flex items-center justify-between py-4 px-3 transition-all ${
                        isSelected 
                          ? 'bg-blue-50/50 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      } ${isOutOfStock && !isSelected ? 'opacity-50' : ''}`}
                    >
                      <div>
                        <p className={`font-medium ${isOutOfStock ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {formatPrice(offer.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Vendido por <span className="font-medium text-gray-700">{offer.seller?.name || 'Desconhecido'}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {offer.condition === 'NEW' ? 'Novo' : offer.condition === 'REFURBISHED' ? 'Recondicionado' : 'Usado'} 
                          {' '}• {isOutOfStock ? 'Esgotado' : `${offer.stock} em stock`}
                        </p>
                      </div>
                      
                      <Button 
                        variant={isSelected ? "primary" : "secondary"} 
                        className={`px-3 py-1.5 text-sm ${isSelected ? 'cursor-default opacity-80 hover:opacity-80' : ''}`}
                        disabled={isSelected || isOutOfStock}
                        onClick={() => setSelectedOfferId(offer.id)}
                      >
                        {isSelected ? 'Selecionado' : isOutOfStock ? 'Esgotado' : 'Escolher este'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};