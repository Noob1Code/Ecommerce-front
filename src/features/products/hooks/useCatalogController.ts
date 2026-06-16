import { useMemo, useState } from 'react';
import { useProducts } from './useProducts';

export const useCatalogController = () => {
  const { products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      if (!product.isActive) return false;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const defaultPrice = product.skus && product.skus.length > 0 ? product.skus[0].price : 0;
      const matchesMin = minPrice === '' || defaultPrice >= Number(minPrice);
      const matchesMax = maxPrice === '' || defaultPrice <= Number(maxPrice);

      return matchesSearch && matchesMin && matchesMax;
    });
  }, [products, searchQuery, minPrice, maxPrice]);

  const handleSelectPriceRange = (rangeId: string, min: string, max: string) => {
    setActivePriceRange(rangeId);
    setMinPrice(min);
    setMaxPrice(max);
  };

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