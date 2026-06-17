import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ErrorMessage, Spinner } from '../../../shared/components/ui';
import { useAuthStore } from '../../auth';
import { useCartController } from '../../cart';
import { formatCurrency } from '../domain/product.entity';
import type { Product } from '../domain/product.types';
import { useProduct } from '../hooks/useProduct';
import { useVariantSelector } from '../hooks/useVariantSelector';

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent = ({ product }: ProductDetailContentProps) => {
  const navigate = useNavigate();
  const { handleAddToCart } = useCartController();

  const usuario = useAuthStore((state) => state.usuario);

  const {
    selectedOptions,
    resolvedSku,
    activeImageUrl,
    handleOptionChange,
    getOptionGroupValues,
    isCombinationAvailable,
    handleImageChange,
  } = useVariantSelector(product);

  const precoFormatado = useMemo(() => {
    if (!resolvedSku) return '';
    return formatCurrency(resolvedSku.price);
  }, [resolvedSku]);

  const handleAddToCartClick = () => {
    if (!resolvedSku) return;
    handleAddToCart(resolvedSku.id, resolvedSku.stock);
    navigate('/cart');
  };

  const possuiPermissaoCompra = !usuario || usuario.perfis?.some((p) =>
    ['ROLE_CLIENTE', 'ROLE_ADMIN'].includes(p)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2 w-full">
        <div className="flex flex-col space-y-4 w-full">
          <div className="aspect-square w-full max-h-[300px] sm:max-h-[450px] lg:max-h-none overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center shadow-xs shrink-0">
            <img
              src={activeImageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
          </div>

          {resolvedSku && resolvedSku.images && resolvedSku.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 w-full">
              {resolvedSku.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => handleImageChange(img.imageUrl)}
                  className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white p-1 hover:border-blue-500 transition-colors shadow-3xs cursor-pointer active:scale-95 shrink-0"
                >
                  <img src={img.imageUrl} alt="Visualização" className="h-full w-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-6 lg:space-y-0 text-left w-full">
          <div className="space-y-4 w-full">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 break-words">{product.name}</h1>

            <p className="text-2xl sm:text-3xl font-black text-blue-600 whitespace-nowrap">
              {resolvedSku ? precoFormatado : 'Selecione as opções'}
            </p>

            <div className="border-t border-gray-100 pt-4 w-full">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Descrição</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-medium break-words">
                {product.description || 'Este item não possui uma descrição detalhada cadastrada.'}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-gray-100 pt-4 w-full">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="space-y-2 w-full">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {attr.attributeName}
                  </span>

                  <div className="flex flex-wrap gap-2.5 w-full">
                    {getOptionGroupValues(attr.attributeId).map((valor) => {
                      const ativo = selectedOptions[attr.attributeId] === valor;
                      const disponivel = isCombinationAvailable(attr.attributeId, valor);

                      return (
                        <button
                          key={valor}
                          type="button"
                          disabled={!disponivel}
                          onClick={() => handleOptionChange(attr.attributeId, valor)}
                          className={`px-4 py-2.5 sm:py-2 text-xs font-bold rounded-xl border transition-all active:scale-95 outline-none cursor-pointer ${ativo
                            ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                            : disponivel
                              ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs'
                              : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through opacity-40'
                            }`}
                        >
                          {valor}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-10 border-t border-gray-100 pt-5 sm:pt-6 w-full">
            {!possuiPermissaoCompra ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center shadow-3xs w-full">
                <p className="text-xs font-bold text-amber-800">
                  Sua credencial funcional corporativa não possui permissões de compras nesta vitrine.
                </p>
              </div>
            ) : resolvedSku ? (
              <div className="space-y-3.5 w-full">
                <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">
                  Disponibilidade:{' '}
                  {resolvedSku.stock > 0 ? (
                    <span className="text-green-600 font-extrabold normal-case bg-green-50 px-2 py-0.5 rounded border border-green-100 ml-1 inline-block">
                      {resolvedSku.stock} unidades em estoque
                    </span>
                  ) : (
                    <span className="text-red-500 font-extrabold normal-case bg-red-50 px-2 py-0.5 rounded border border-red-100 ml-1 inline-block">
                      Produto Esgotado
                    </span>
                  )}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  disabled={resolvedSku.stock === 0}
                  onClick={handleAddToCartClick}
                  className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md bg-blue-600 text-white hover:bg-blue-700 rounded-xl border-none disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {resolvedSku.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="primary"
                disabled
                className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase bg-gray-100 text-gray-400 cursor-not-allowed rounded-xl border-none"
              >
                Selecione as Variações
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 w-full">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 w-full">
        <ErrorMessage message={error || 'O item solicitado não foi localizado no servidor.'} />
      </div>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
};