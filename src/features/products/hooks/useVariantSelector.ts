import { useState, useEffect, useMemo } from 'react';
import type { Product, ProductSku } from '../domain/product.types';

interface UseVariantSelectorResult {
  selectedOptions: Record<string, string>;
  resolvedSku: ProductSku | null;
  activeImageUrl: string;
  handleOptionChange: (attributeId: string, value: string) => void;
  getOptionGroupValues: (attributeId: string) => string[];
  isCombinationAvailable: (attributeId: string, value: string) => boolean;
}

export const useVariantSelector = (product: Product | null | undefined): UseVariantSelectorResult => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeImageUrl, setActiveImageUrl] = useState<string>('/fallback-image.jpg');

  useEffect(() => {
    if (product && product.skus && product.skus.length > 0) {
      const defaultSku = product.skus[0];
      const initialOptions: Record<string, string> = {};
      
      defaultSku.options.forEach((opt) => {
        initialOptions[opt.attributeId] = opt.value;
      });

      setSelectedOptions(initialOptions);

      if (defaultSku.images && defaultSku.images.length > 0) {
        setActiveImageUrl(defaultSku.images[0].imageUrl);
      }
    }
  }, [product]);

  const resolvedSku = useMemo(() => {
    if (!product || !product.skus) return null;

    return product.skus.find((sku) =>
      sku.options.every((opt) => selectedOptions[opt.attributeId] === opt.value)
    ) || null;
  }, [selectedOptions, product]);

  useEffect(() => {
    if (resolvedSku && resolvedSku.images && resolvedSku.images.length > 0) {
      setActiveImageUrl(resolvedSku.images[0].imageUrl);
    }
  }, [resolvedSku]);

  const handleOptionChange = (attributeId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  const getOptionGroupValues = (attributeId: string): string[] => {
    if (!product || !product.skus) return [];
    
    const valuesSet = new Set<string>();
    product.skus.forEach((sku) => {
      const match = sku.options.find((o) => o.attributeId === attributeId);
      if (match) valuesSet.add(match.value);
    });
    return Array.from(valuesSet);
  };

  const isCombinationAvailable = (attributeId: string, value: string): boolean => {
    if (!product || !product.skus) return false;

    const hypotheticalSelection = { ...selectedOptions, [attributeId]: value };
    return product.skus.some((sku) =>
      sku.options.every((opt) => hypotheticalSelection[opt.attributeId] === opt.value)
    );
  };

  return {
    selectedOptions,
    resolvedSku,
    activeImageUrl,
    handleOptionChange,
    getOptionGroupValues,
    isCombinationAvailable,
  };
};