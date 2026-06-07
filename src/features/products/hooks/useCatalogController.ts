import { useState, useMemo } from 'react';
import { useProducts } from './useProducts';

export const useCatalogController = () => {
  const { products, isLoading, error } = useProducts();

  // Estados dos filtros utilitários do catálogo
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activePriceRange, setActivePriceRange] = useState<string | null>(null);

  // Filtra reativamente a lista com base nas regras do Mercado Livre (Nome + Faixas de Preço)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // O produto deve estar ativo no catálogo público
      if (!product.isActive) return false;

      // Busca por texto (Nome do produto)
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Resolução do preço padrão do primeiro SKU cadastrado
      const defaultPrice = product.skus && product.skus.length > 0 ? product.skus[0].price : 0;

      // Filtro por faixa numérica customizada
      const matchesMin = minPrice === '' || defaultPrice >= Number(minPrice);
      const matchesMax = maxPrice === '' || defaultPrice <= Number(maxPrice);

      return matchesSearch && matchesMin && matchesMax;
    });
  }, [products, searchQuery, minPrice, maxPrice]);

  // Handlers semânticos para seleção de faixas rápidas de preço (Estilo Mercado Livre)
  const handleSelectPriceRange = (rangeId: string, min: string, max: string) => {
    setActivePriceRange(rangeId);
    setMinPrice(min);
    setMaxPrice(max);
  };

  // AJUSTE: Expressão regular \D remove tudo o que não for dígito numérico de 0 a 9
  // Isso bloqueia instantaneamente os caracteres: + - . , e ou letras por digitação ou colagem
  const handleMinPriceChange = (value: string) => {
    setActivePriceRange(null);
    const sanitized = value.replace(/\D/g, '');
    setMinPrice(sanitized);
  };

  const handleMaxPriceChange = (value: string) => {
    setActivePriceRange(null);
    const sanitized = value.replace(/\D/g, '');
    setMaxPrice(sanitized);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setActivePriceRange(null);
  };

  return {
    isLoading,
    error,
    searchQuery,
    minPrice,
    maxPrice,
    activePriceRange,
    filteredProducts,
    setSearchQuery,
    handleMinPriceChange,
    handleMaxPriceChange,
    handleSelectPriceRange,
    handleClearFilters,
  };
};