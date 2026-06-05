import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../../../app/store';
import { Spinner, ErrorMessage, Button } from '../../../shared/components/ui';
import type { ProductSku } from '../domain/product.types';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);

  // State to track user selected options: Record<attributeId, value>
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [resolvedSku, setResolvedSku] = useState<ProductSku | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string>('/fallback-image.jpg');
  const [isAdded, setIsAdded] = useState(false);

  // Initialize options with the first available SKU to guarantee a deterministic state
  useEffect(() => {
    if (product && product.skus && product.skus.length > 0) {
      const defaultSku = product.skus[0];
      const initialOptions: Record<string, string> = {};
      
      defaultSku.options.forEach((opt) => {
        initialOptions[opt.attributeId] = opt.value;
      });

      setSelectedOptions(initialOptions);
      setResolvedSku(defaultSku);

      if (defaultSku.images && defaultSku.images.length > 0) {
        setActiveImageUrl(defaultSku.images[0].imageUrl);
      }
    }
  }, [product]);

  // Synchronize SKU determination whenever options change
  useEffect(() => {
    if (!product || !product.skus) return;

    const matchedSku = product.skus.find((sku) =>
      sku.options.every((opt) => selectedOptions[opt.attributeId] === opt.value)
    );

    if (matchedSku) {
      setResolvedSku(matchedSku);
      // Automatically update the main picture if the newly selected variant possesses media assets
      if (matchedSku.images && matchedSku.images.length > 0) {
        setActiveImageUrl(matchedSku.images[0].imageUrl);
      }
    } else {
      setResolvedSku(null);
    }
  }, [selectedOptions, product]);

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

  const handleOptionChange = (attributeId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!resolvedSku || resolvedSku.stock <= 0) return;

    addItem(product, resolvedSku.id);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Extract all unique values per attribute across all SKUs to draw correct option pickers
  const getOptionGroupValues = (attributeId: string): string[] => {
    const valuesSet = new Set<string>();
    product.skus.forEach((sku) => {
      const match = sku.options.find((o) => o.attributeId === attributeId);
      if (match) valuesSet.add(match.value);
    });
    return Array.from(valuesSet);
  };

  // Determine combination compatibility to visually disable invalid selections
  const isCombinationAvailable = (attributeId: string, value: string): boolean => {
    const hypotheticalSelection = { ...selectedOptions, [attributeId]: value };
    return product.skus.some((sku) =>
      sku.options.every((opt) => hypotheticalSelection[opt.attributeId] === opt.value)
    );
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
        {/* Left Column: Media Presentation */}
        <div className="flex flex-col">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
            <img
              src={activeImageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center sm:rounded-lg"
            />
          </div>

          {/* Sku Thumbnails Collection */}
          {resolvedSku && resolvedSku.images && resolvedSku.images.length > 1 && (
            <div className="mx-auto mt-4 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-4" role="tablist" aria-label="Product images">
                {resolvedSku.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageUrl(img.imageUrl)}
                    className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50 border ${
                      activeImageUrl === img.imageUrl ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200'
                    }`}
                    type="button"
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img src={img.imageUrl} alt="" className="h-full w-full object-cover object-center" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Configuration & Purchase Operations */}
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
            {/* Dynamic Variant Option Controls */}
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
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
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

            {/* Inventory Feedback */}
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

            {/* Checkout Actions */}
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