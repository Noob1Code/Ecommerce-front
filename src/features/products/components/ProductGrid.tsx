import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

export const ProductGrid = () => {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-red-500">
        <p>Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Our Products</h2>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};