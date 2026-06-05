import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useVariantSelector } from '../hooks/useVariantSelector';
import { useCartStore } from '../../../app/store/useCartStore';
import { Spinner, ErrorMessage, Button } from '../../../shared/components/ui';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage
          message={error || 'The requested product could not be loaded.'}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!resolvedSku || resolvedSku.stock <= 0) return;

    addItem(product, resolvedSku.id);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm font-medium text-gray-900">{product.name}</span>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        {/* Left Column: Media Presentation Layout */}
        <div className="flex flex-col">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
            <img
              src={activeImageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center sm:rounded-lg"
            />
          </div>
        </div>

        {/* Right Column: Configuration & Purchase Operations Section */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {resolvedSku ? resolvedSku.formattedPrice : 'Select Options'}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="space-y-6 text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            {/* Dynamic Variant Option Controls generated via hooks extraction filters */}
            {product.attributes.map((attr) => {
              const currentSelectedValue = selectedOptions[attr.attributeId];
              const dynamicValues = getOptionGroupValues(attr.attributeId);

              return (
                <div key={attr.id} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{attr.attributeName}</h3>
                  <div className="flex flex-wrap gap-3">
                    {dynamicValues.map((value) => {
                      const isSelected = currentSelectedValue === value;
                      const isAllowed = isCombinationAvailable(attr.attributeId, value);

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleOptionChange(attr.attributeId, value)}
                          disabled={!isAllowed}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                              : isAllowed
                              ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-40 line-through'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Inventory Status Real-time Feedback indicator */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Availability:</span>
              {resolvedSku ? (
                resolvedSku.stock > 0 ? (
                  <span className="text-sm font-semibold text-green-600">
                    In Stock ({resolvedSku.stock} units available)
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                )
              ) : (
                <span className="text-sm font-semibold text-amber-500">Invalid combination selected</span>
              )}
            </div>

            {/* Checkout Form Actions */}
            <div className="mt-8 flex">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={!resolvedSku || resolvedSku.stock <= 0}
                className="w-full py-4 text-base font-medium uppercase tracking-wide shadow-sm lg:max-w-xs"
                variant={isAdded ? 'secondary' : 'primary'}
              >
                {!resolvedSku
                  ? 'Select Options'
                  : resolvedSku.stock <= 0
                  ? 'Sold Out'
                  : isAdded
                  ? '✓ Added to Cart'
                  : 'Add to Cart'}
              </Button>
            </div>

            {resolvedSku && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 tracking-mono">
                  SKU Reference: <span className="font-semibold">{resolvedSku.skuCode}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};