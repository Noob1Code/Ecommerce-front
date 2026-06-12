import { useState, useMemo } from 'react';
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
  // Guardamos o ID do produto anterior para identificar quando houve troca de página/produto
  const [prevProductId, setPrevProductId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // ⚡ SINCRONIZAÇÃO SÍNCRONA DE ESTADO (Substitui o primeiro useEffect antigo)
  // Quando o produto carrega ou muda, reinicializa as opções padrões do primeiro SKU instantaneamente
  // no mesmo ciclo de renderização, eliminando flashes visuais na tela.
  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    
    const initialOptions: Record<string, string> = {};
    if (product.skus && product.skus.length > 0) {
      product.skus[0].options.forEach((opt) => {
        initialOptions[opt.attributeId] = opt.value;
      });
    }
    setSelectedOptions(initialOptions);
  }

  // 🧠 Estado Derivado 1: Resolve o SKU ativo com base nas opções que o usuário clicou
  const resolvedSku = useMemo(() => {
    if (!product || !product.skus) return null;

    return product.skus.find((sku) =>
      sku.options.every((opt) => selectedOptions[opt.attributeId] === opt.value)
    ) || null;
  }, [selectedOptions, product]);

  // 🎨 Estado Derivado 2: Remove totalmente o useState e o segundo useEffect da imagem!
  // A URL da imagem ativa agora é calculada dinamicamente. Quando o resolvedSku muda pelo clique,
  // a imagem atualiza no exato milissegundo, evitando renderizações em cascata lentas.
  const activeImageUrl = useMemo(() => {
    if (resolvedSku && resolvedSku.images && resolvedSku.images.length > 0) {
      return resolvedSku.images[0].imageUrl;
    }
    if (product && product.skus && product.skus.length > 0) {
      const defaultSku = product.skus[0];
      if (defaultSku.images && defaultSku.images.length > 0) {
        return defaultSku.images[0].imageUrl;
      }
    }
    return '/fallback-image.jpg';
  }, [resolvedSku, product]);

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