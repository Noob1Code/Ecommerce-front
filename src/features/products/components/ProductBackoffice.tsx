import { useProductBackofficeController } from '../hooks/useProductBackofficeController';
import { RoleGuard } from '../../auth';
import { Spinner, ErrorMessage, Card, Button, Input } from '../../../shared/components/ui';

export const ProductBackoffice = () => {
  const {
    isLoading,
    error,
    searchQuery,
    filteredProducts,
    stockChanges,
    isSubmitting,
    modifiedCount,
    getSkuEffectiveStock,
    getProductEffectiveMetadata,
    handleMetadataChange,
    handleProductInactivation,
    handleSkuPhysicalDeletion,
    handleBatchSubmit,
    handleSearchChange,
    clearSearch,
    handleIncrementStock,
    handleDecrementStock,
    handleQuantityInputChange,
    handleQuantityInputBlur
  } = useProductBackofficeController();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-amber-600" />
      </div>
    );
  }

  return (
    <RoleGuard 
      allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']} 
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-sm text-red-600 mb-6">
              Your active account credentials do not possess authorized privileges to view the backoffice node.
            </p>
            <Button variant="primary" onClick={() => window.location.assign('/')}>
              Return to Catalog Storefront
            </Button>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Strip */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory & Catalog CRUD</h1>
            <p className="mt-2 text-sm text-gray-500">
              Modify container details, soft-delete parent products, and physically purge SKU rows.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant={modifiedCount > 0 ? 'primary' : 'secondary'}
              disabled={modifiedCount === 0 || isSubmitting}
              onClick={handleBatchSubmit}
              className={`px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all shadow-md ${
                modifiedCount > 0 ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white shadow-md' : ''
              }`}
            >
              {isSubmitting ? 'Saving changes...' : `Submit Changes (${modifiedCount} updates)`}
            </Button>
          </div>
        </div>

        {/* Search Bar Utility */}
        <div className="mb-8 max-w-md">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700">
              Filter Items By Name
            </label>
            {searchQuery && (
              <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded border border-blue-100">
                Search filter active
              </span>
            )}
          </div>
          <div className="relative rounded-md shadow-sm">
            <Input
              id="search"
              name="search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search product name..."
              disabled={isSubmitting}
              className="w-full pl-3 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">No products found matching requirements.</p>
          </div>
        )}

        {/* Catalog Items Iteration Loop */}
        <div className="space-y-6">
          {filteredProducts.map((product) => {
            const { name: currentName, description: currentDesc } = getProductEffectiveMetadata(product.id, product.name, product.description);
            const isProductDirty = currentName !== product.name || currentDesc !== product.description;

            return (
              <Card 
                key={product.id} 
                className={`p-6 border shadow-sm rounded-xl transition-all ${
                  !product.isActive 
                    ? 'border-gray-200 bg-gray-50/50 opacity-65' 
                    : isProductDirty 
                      ? 'border-amber-400 ring-1 ring-amber-400 bg-white' 
                      : 'border-gray-200 bg-white'
                }`}
              >
                {/* Product Metadata Editable Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-5 mb-5 items-start">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor={`name-${product.id}`} className="block text-xs font-bold uppercase tracking-wide text-gray-500">
                        Product Container Name
                      </label>
                      {!product.isActive && (
                        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 uppercase tracking-wider">
                          Inactive
                        </span>
                      )}
                    </div>
                    {/* SUBSTITUIÇÃO ARQUITETURAL: Tag nativa substituída pelo componente atómico reaproveitável */}
                    <Input
                      type="text"
                      id={`name-${product.id}`}
                      value={currentName}
                      disabled={isSubmitting || !product.isActive} 
                      onChange={(e) => handleMetadataChange(product.id, 'name', e.target.value)}
                      className={`text-base font-bold text-gray-900 border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                        !product.isActive ? 'text-gray-500 cursor-not-allowed' : 'bg-gray-50/50'
                      }`}
                    />
                    <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {product.id}</p>
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor={`desc-${product.id}`} className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                      Catalog Description
                    </label>
                    <textarea
                      id={`desc-${product.id}`} 
                      value={currentDesc}
                      rows={2}
                      disabled={isSubmitting || !product.isActive} 
                      onChange={(e) => handleMetadataChange(product.id, 'description', e.target.value)}
                      className={`w-full text-sm text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none leading-tight ${
                        !product.isActive ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50/50'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-end pt-5 md:pt-4">
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                      {product.isActive ? (
                        <button 
                          type="button"
                          onClick={() => handleProductInactivation(product.id, product.name)}
                          className="text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2 transition-all shadow-sm"
                          title="Performs logical soft delete via PATCH mapping"
                        >
                          Inactivate Product (Soft)
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 rounded-lg px-5 py-2 select-none cursor-not-allowed uppercase tracking-wider">
                          Inactivated
                        </span>
                      )}
                    </RoleGuard>
                  </div>
                </div>

                {/* SKU Variations Data Table Subgrid */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">SKU Code</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Configuration Options</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Price Factor</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Active Stock</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500">Modify Quantity</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Purge Record</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {product.skus.map((sku) => {
                        const effectiveStock = getSkuEffectiveStock(sku.id, sku.stock);
                        const isSkuDirty = stockChanges[sku.id] !== undefined && stockChanges[sku.id] !== sku.stock;
                        const numericStock = effectiveStock === '' ? 0 : Number(effectiveStock);

                        return (
                          <tr 
                            key={sku.id} 
                            className={`transition-colors ${
                              !product.isActive 
                                ? 'bg-gray-50/30 text-gray-400' 
                                : isSkuDirty 
                                  ? 'bg-amber-50/40 hover:bg-amber-50/70' 
                                  : 'hover:bg-gray-50/50'
                            }`}
                          >
                            <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                              {sku.skuCode}
                              {isSkuDirty && product.isActive && (
                                <span className="ml-2 inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 animate-pulse">
                                  Pending Stock
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">
                              {sku.options.map((opt) => `${opt.attributeName}: ${opt.value}`).join(' | ')}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">{sku.formattedPrice}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                              {sku.stock} un.
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  aria-label={`Decrease stock for SKU ${sku.skuCode}`}
                                  disabled={isSubmitting || numericStock <= 0 || !product.isActive}
                                  onClick={() => handleDecrementStock(sku.id, sku.stock)}
                                  className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold disabled:opacity-40 select-none"
                                >
                                  -
                                </button>
                                
                                <input
                                  type="number"
                                  aria-label={`Stock volume for SKU ${sku.skuCode}`}
                                  min={0}
                                  value={effectiveStock}
                                  disabled={isSubmitting || !product.isActive}
                                  onChange={(e) => handleQuantityInputChange(sku.id, e.target.value)}
                                  onBlur={() => handleQuantityInputBlur(sku.id)}
                                  className={`w-20 text-center py-1 text-sm font-semibold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    !product.isActive
                                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                      : isSkuDirty 
                                        ? 'border-amber-500 ring-2 ring-amber-500 text-amber-950 font-bold bg-white' 
                                        : 'border-gray-300 bg-white'
                                  }`}
                                />

                                <button
                                  type="button"
                                  aria-label={`Increase stock for SKU ${sku.skuCode}`}
                                  disabled={isSubmitting || !product.isActive}
                                  onClick={() => handleIncrementStock(sku.id, sku.stock)}
                                  className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                                <button
                                  type="button"
                                  disabled={isSubmitting || !product.isActive}
                                  onClick={() => handleSkuPhysicalDeletion(sku.id, sku.skuCode)}
                                  className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Triggers physical record deletion from database storage"
                                >
                                  Delete Variation (Hard)
                                </button>
                              </RoleGuard>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </RoleGuard>
  );
};