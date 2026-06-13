import { useMemo, useState } from 'react';
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

  const resolvedSku = useMemo(() => {
    if (!product || !product.skus) return null;

    return product.skus.find((sku) => {
      const numOpcoesSelecionadas = Object.keys(selectedOptions).length;
      
      if (sku.options.length !== numOpcoesSelecionadas) return false;

      return sku.options.every((opt) => selectedOptions[opt.attributeId] === opt.value);
    }) || null;
  }, [selectedOptions, product]);

  const activeImageUrl = useMemo(() => {
    if (resolvedSku && resolvedSku.images && resolvedSku.images.length > 0) {
      return resolvedSku.images[0].imageUrl;
    }
    
    if (product && product.skus) {
      const primeiroSkuComImagem = product.skus.find((s) => s.images && s.images.length > 0);
      if (primeiroSkuComImagem && primeiroSkuComImagem.images.length > 0) {
        return primeiroSkuComImagem.images[0].imageUrl;
      }
    }
    
    return '/fallback-image.jpg';
  }, [resolvedSku, product]);

  const handleOptionChange = (attributeId: string, value: string) => {
    setSelectedOptions((prev) => {
      if (prev[attributeId] === value) {
        const copia = { ...prev };
        delete copia[attributeId];
        return copia;
      }
      return {
        ...prev,
        [attributeId]: value,
      };
    });
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

    const selecaoHipotetica = { ...selectedOptions, [attributeId]: value };
    
    return product.skus.some((sku) => {
      return Object.entries(selecaoHipotetica).every(([attrId, val]) =>
        sku.options.some((opt) => opt.attributeId === attrId && opt.value === val)
      );
    });
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