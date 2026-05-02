import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Spinner, ErrorMessage, EmptyState, Button } from '../../../shared/components/ui';

export const ProductGrid = () => {
  const { data: products, isLoading, isError, error, refetch } = useProducts();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage 
          message={error.message || 'An unexpected error occurred while fetching products.'}
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState 
          title="No products found" 
          description="We couldn't find any products at the moment. Please check back later."
          action={
            <Button variant="secondary" onClick={() => refetch()}>
              Refresh
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Our Products</h2>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};