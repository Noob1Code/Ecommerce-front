import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../../../app/store/useCartStore'; // Caminho atualizado
import { Button, Spinner, ErrorMessage } from '../../../shared/components/ui';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id || '');
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

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

  const mainOffer = product.bestOffer;
  const otherOffers = product.offers?.filter(offer => offer.id !== mainOffer?.id) || [];

  const handleAddToCart = () => {
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
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-blue-900 mb-4 uppercase tracking-wider">
                Melhor Oferta
              </h2>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Vendido e entregue por <span className="font-semibold text-gray-900">{mainOffer?.seller.name || 'Loja Parceira'}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {mainOffer?.condition === 'NEW' ? 'Novo' : 'Usado'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Estoque: {product.stock} unidades
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full sm:w-auto px-6 py-3 text-lg font-medium transition-colors ${isAdded ? '!bg-green-500 hover:!bg-green-600' : ''}`}
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  {product.stock === 0 ? 'Esgotado' : isAdded ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            </div>
          </div>

          {otherOffers.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">Outras opções de compra</h3>
              <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                {otherOffers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900">{formatPrice(offer.price)}</p>
                      <p className="text-sm text-gray-500">
                        Vendido por <span className="font-medium text-gray-700">{offer.seller.name}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {offer.condition === 'NEW' ? 'Novo' : 'Usado'} • {offer.stock} em stock
                      </p>
                    </div>
                    <Button 
                      variant="secondary" 
                      className="px-3 py-1.5 text-sm"
                      onClick={() => alert('Em breve!')}
                    >
                      Comprar este
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};