import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Spinner, ErrorMessage, EmptyState } from '../../../shared/components/ui';

export const ProductGrid = () => {
  const { products, isLoading, error } = useProducts();

  // Performance Optimization & Visibilidade: Filtra para exibir APENAS produtos ativos na vitrine
  const activeProducts = useMemo(() => {
    return products.filter((product) => product.isActive);
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (activeProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState 
          title="No available products found" 
          description="There are no active products available in the catalog showroom at the moment." 
        />
      </div>
    );
  }

  return (
    // CORREÇÃO VISUAL: Inserido contêiner de limite de largura máxima e centralização automática (mx-auto)
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};