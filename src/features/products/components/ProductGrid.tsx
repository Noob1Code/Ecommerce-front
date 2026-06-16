import { Card, EmptyState, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
import { useCatalogController } from '../hooks/useCatalogController';
import { ProductCard } from './ProductCard';

export const ProductGrid = () => {
  const {
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
  } = useCatalogController();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const quickPriceRanges = [
    { id: 'under-100', label: 'Até R$100', min: '0', max: '100' },
    { id: '100-500', label: 'R$100 a R$500', min: '100', max: '500' },
    { id: 'over-500', label: 'Mais de R$500', min: '500', max: '999999' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 max-w-2xl mx-auto w-full">
        <div className="relative rounded-xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <svg className="h-5 w-5 text-gray-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos pelo nome..."
            className="w-full pl-12 pr-4 rounded-xl text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-x-8 lg:gap-y-10 lg:items-start">
        <div className="w-full lg:col-span-1">
          <Card className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Filtros</h2>
              {(searchQuery || minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider active:scale-95"
                >
                  Limpar todos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2.5">Preço</h3>
                <ul className="space-y-2 text-xs sm:text-sm font-medium">
                  {quickPriceRanges.map((range) => {
                    const isSelected = activePriceRange === range.id;
                    return (
                      <li key={range.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectPriceRange(range.id, range.min, range.max)}
                          className={`text-left w-full transition-colors py-0.5 rounded active:scale-99 ${isSelected
                              ? 'text-blue-600 font-extrabold'
                              : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                          {range.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex flex-col justify-center lg:justify-start">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2.5">
                  Intervalo personalizado
                </h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Mínimo"
                    value={minPrice}
                    disabled={isLoading}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="w-full text-center py-2 text-xs rounded-xl bg-gray-50/50"
                  />
                  <span className="text-gray-400 text-xs font-bold shrink-0">—</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Máximo"
                    value={maxPrice}
                    disabled={isLoading}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="w-full text-center py-2 text-xs rounded-xl bg-gray-50/50"
                  />
                </div>
              </div>

            </div>
          </Card>
        </div>

        <div className="w-full lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Tente ajustar os termos da busca ou redefinir os limites de preço aplicados."
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};