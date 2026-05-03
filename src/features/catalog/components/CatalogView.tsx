import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { ProductCard } from '../../product'; 
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { Spinner, ErrorMessage, EmptyState, Button } from '../../../shared/components/ui';

export const CatalogView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. Lemos os estados múltiplos da URL
  const currentSearchQuery = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';

  // 2. Passamos tudo para a Camada de Dados
  const { data: products, isLoading, isError, error, refetch } = useCatalog({ 
    search: currentSearchQuery,
    category: currentCategory
  });

  // 3. Atualizamos a URL preservando os outros parâmetros
  const handleSearchChange = useCallback((newQuery: string) => {
    setSearchParams(prev => {
      if (newQuery) prev.set('search', newQuery);
      else prev.delete('search');
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setSearchParams(prev => {
      // Se selecionou "All" (string vazia), removemos o parâmetro da URL
      if (newCategory) prev.set('category', newCategory);
      else prev.delete('category');
      
      // Quando o usuário muda de categoria, é uma boa prática limpar o termo de busca atual
      prev.delete('search'); 
      return prev;
    });
  }, [setSearchParams]);

  const handleClearFilters = useCallback(() => {
    setSearchParams({}); // Limpa todos os parâmetros da URL
  }, [setSearchParams]);

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
          message={error.message || 'Ocorreu um erro inesperado ao carregar o catálogo.'}
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  const hasActiveFilters = currentSearchQuery !== '' || currentCategory !== '';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Cabeçalho e Busca */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Catálogo</h2>
        <SearchBar 
          initialValue={currentSearchQuery} 
          onSearch={handleSearchChange} 
        />
      </div>

      {/* Filtro de Categorias */}
      <CategoryFilter 
        selectedCategory={currentCategory} 
        onSelectCategory={handleCategoryChange} 
      />

      {/* Tratamento de Estado Vazio */}
      {!products || products.length === 0 ? (
        <EmptyState 
          title="Nenhum produto encontrado" 
          description="Não conseguimos encontrar produtos com os filtros selecionados."
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            ) : (
               <Button variant="secondary" onClick={() => refetch()}>Atualizar</Button>
            )
          }
        />
      ) : (
        /* Grade de Produtos */
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};