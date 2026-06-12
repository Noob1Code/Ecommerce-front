import { Card, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }
  const quickPriceRanges = [
    { id: 'under-100', label: 'Até R$100', min: '0', max: '100' },
    { id: '100-500', label: 'R$100 a R$500', min: '100', max: '500' },
    { id: 'over-500', label: 'Mais de R$500', min: '500', max: '999999' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* BARRA SUPERIOR: Campo de pesquisa integrado com ícone de Lupa */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            {/* Ícone de Lupa vetorial nativo */}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos pelo nome..."
            className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* GRID PRINCIPAL: Layout dividido em Coluna de Filtros (Esquerda) e Resultados (Direita) */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

        {/* SIDEBAR: Painel Facetado de Filtros de Preço */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-gray-900">Filtros</h2>
              {(searchQuery || minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Limpar todos
                </button>
              )}
            </div>

            {/* Seção 1: Links Rápidos de Faixas de Preço */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-2.5">Preço</h3>
              <ul className="space-y-2 text-sm">
                {quickPriceRanges.map((range) => {
                  const isSelected = activePriceRange === range.id;
                  return (
                    <li key={range.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectPriceRange(range.id, range.min, range.max)}
                        className={`text-left w-full transition-colors ${isSelected
                            ? 'text-blue-600 font-bold'
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

            {/* Seção 2: Inputs Customizados de Mínimo/Máximo */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Intervalo personalizado
              </h3>
              <div className="flex items-center gap-2">
                {/* AJUSTE: Alterado para type="text", inputMode="numeric" e pattern para travar apenas inteiros */}
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  className="w-full text-center py-1.5 text-xs rounded-lg border-gray-300 bg-gray-50/50"
                />
                <span className="text-gray-400 text-xs font-medium">—</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  className="w-full text-center py-1.5 text-xs rounded-lg border-gray-300 bg-gray-50/50"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* CONTAINER DE RESULTADOS: Listagem de Cards de Produtos */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-base font-bold text-gray-900 mb-1">Nenhum produto encontrado</h3>
              <p className="text-sm text-gray-500">
                Tente ajustar os termos da busca ou redefinir os limites de preço aplicados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
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