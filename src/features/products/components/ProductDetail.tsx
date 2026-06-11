import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useVariantSelector } from '../hooks/useVariantSelector';
import { useCartController } from '../../cart';
import { Button, Spinner, ErrorMessage } from '../../../shared/components/ui';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleAddToCart } = useCartController();
  const { product, isLoading, error } = useProduct(id);
  
  const {
    selectedOptions,
    resolvedSku,
    activeImageUrl,
    handleOptionChange,
    getOptionGroupValues,
    isCombinationAvailable,
  } = useVariantSelector(product);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <ErrorMessage message={error || 'O item solicitado não foi localizado no servidor.'} />
      </div>
    );
  }

  const handleAddToCartClick = () => {
    if (!resolvedSku) return;
    handleAddToCart(resolvedSku.id, resolvedSku.stock);
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        
        {/* Bloco Esquerdo: Galeria de Imagens baseada na Variação Ativa */}
        <div className="flex flex-col space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center shadow-xs">
            <img
              src={activeImageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
          </div>
          
          {/* Miniaturas de Preview da Variação Selecionada */}
          {resolvedSku && resolvedSku.images && resolvedSku.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {resolvedSku.images.map((img) => (
                <div key={img.id} className="aspect-square rounded-lg overflow-hidden border bg-gray-50 p-1">
                  <img src={img.imageUrl} alt="Visualização" className="h-full w-full object-cover rounded-md" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bloco Direito: Detalhes, Preços e Seletores Dinâmicos de Atributos */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">{product.name}</h1>
            
            <p className="text-3xl font-black text-blue-600">
              {resolvedSku ? resolvedSku.formattedPrice : 'Selecione as opções'}
            </p>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Descrição</h3>
              <p className="mt-2 text-base text-gray-600 leading-relaxed">
                {product.description || 'Este item não possui uma descrição detalhada cadastrada.'}
              </p>
            </div>

            {/* Seleção Dinâmica baseada nos atributos injetados via DTO do Backend */}
            <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {attr.attributeName}
                  </span>
                  
                  <div className="flex flex-wrap gap-2">
                    {getOptionGroupValues(attr.attributeId).map((valor) => {
                      const ativo = selectedOptions[attr.attributeId] === valor;
                      const disponivel = isCombinationAvailable(attr.attributeId, valor);

                      return (
                        <button
                          key={valor}
                          type="button"
                          disabled={!disponivel}
                          onClick={() => handleOptionChange(attr.attributeId, valor)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                            ativo
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                              : disponivel
                              ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs'
                              : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
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

          {/* Botão de Compra e Validação Baseado no Estoque Real do SKU do Servidor */}
          <div className="mt-10 border-t border-gray-100 pt-6">
            {resolvedSku ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400">
                  Disponibilidade:{' '}
                  {resolvedSku.stock > 0 ? (
                    <span className="text-green-600 font-bold">{resolvedSku.stock} unidades em estoque</span>
                  ) : (
                    <span className="text-red-500 font-bold">Produto Esgotado</span>
                  )}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  disabled={resolvedSku.stock === 0}
                  onClick={handleAddToCartClick}
                  className="w-full py-4 text-sm font-bold uppercase tracking-wider shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {resolvedSku.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
              </div>
            ) : (
              <Button type="button" variant="primary" disabled className="w-full py-4 text-sm font-bold uppercase bg-gray-100 text-gray-400 cursor-not-allowed">
                Selecione as Variações
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};