import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { QUERY_KEYS } from '../../../services/api/queryKeys';
import { useProducts } from '../hooks/useProducts';
import { updateSkuStockInApi } from '../api/productsApi';
import { RoleGuard } from '../../auth';
import { Spinner, ErrorMessage, Card, Button, Input } from '../../../shared/components/ui';

export const ProductBackoffice = () => {
  const queryClient = useQueryClient();
  const { products, isLoading, error } = useProducts();
  
  // Instantiates the search parameters synchronization hook interface
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  
  // Local client buffer state to accumulate multiple uncommitted stock modifications
  const [stockChanges, setStockChanges] = useState<Record<string, number | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-amber-600" />
      </div>
    );
  }

  // Filter products by name based on the client search input query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Read current value from local uncommitted buffer fallback to actual cache value
  const getSkuEffectiveStock = (skuId: string, currentStock: number): number | string => {
    return stockChanges[skuId] !== undefined ? stockChanges[skuId] : currentStock;
  };

  // Determine the count of actual items that contain differences from the server cache
  const getModifiedItemsCount = (): number => {
    let count = 0;
    Object.entries(stockChanges).forEach(([skuId, val]) => {
      const newStock = val === '' ? 0 : Number(val);
      let originalStock = -1;
      products.forEach((p) => {
        const match = p.skus.find((s) => s.id === skuId);
        if (match) originalStock = match.stock;
      });
      if (originalStock !== -1 && originalStock !== newStock) {
        count++;
      }
    });
    return count;
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Synchronize the text string value to the active routing query parameters
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const handleBatchSubmit = async () => {
    const changesToApply = Object.entries(stockChanges).filter(([skuId, val]) => {
      const newStock = val === '' ? 0 : Number(val);
      let originalStock = -1;
      products.forEach((p) => {
        const match = p.skus.find((s) => s.id === skuId);
        if (match) originalStock = match.stock;
      });
      return originalStock !== -1 && originalStock !== newStock;
    });

    if (changesToApply.length === 0) {
      alert('No structural modifications detected inside the stock buffer.');
      return;
    }

    setIsSubmitting(true);

    try {
      await Promise.all(
        changesToApply.map(([skuId, val]) => {
          const newStock = val === '' ? 0 : Number(val);
          return updateSkuStockInApi(skuId, newStock);
        })
      );

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.products.all,
      });

      setStockChanges({});
      alert('All accumulated inventory configurations saved successfully!');
    } catch (err) {
      alert('An error occurred while executing batch stock updates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modifiedCount = getModifiedItemsCount();

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
        {/* Header Action Control Section */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Control Center</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage product listings, dimensional variants, modification items, and real-time SKU stock fulfillment.
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
              {isSubmitting ? 'Saving changes...' : `Submit Changes (${modifiedCount} modified)`}
            </Button>
            
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Button variant="secondary" onClick={() => alert('New catalog item creation modal simulation')}>
                + Provision New Item
              </Button>
            </RoleGuard>
          </div>
        </div>

        {/* Search Bar Utilities Strip */}
        <div className="mb-8 max-w-md">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700">
              Search Catalog Items
            </label>
            {urlSearchQuery && (
              <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded border border-blue-100 animate-fade-in">
                Filtering url context active
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
              placeholder="Search by product name (e.g., Teclado Mecânico)..."
              disabled={isSubmitting}
              className="w-full pl-3 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Empty State when Search yields no matches */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">
              No products found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Product Cards Container */}
        <div className="space-y-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6 border border-gray-200 bg-white shadow-sm rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">Product ID: {product.id}</p>
                </div>
                
                <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => alert(`Toggling structural availability context for: ${product.name}`)}
                      className="text-xs font-medium text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition-colors"
                    >
                      Toggle Active State
                    </button>
                    <button 
                      type="button"
                      onClick={() => alert(`Purging product structure container reference: ${product.id}`)}
                      className="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 transition-colors"
                    >
                      Delete Asset
                    </button>
                  </div>
                </RoleGuard>
              </div>

              {/* SKU Variations Data Table Grid */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">SKU Code</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Configuration Options</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Price Factor</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Server Active Stock</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Batch Buffer Counter (Editable)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {product.skus.map((sku) => {
                      const effectiveStock = getSkuEffectiveStock(sku.id, sku.stock);
                      const isItemDirty = stockChanges[sku.id] !== undefined && stockChanges[sku.id] !== sku.stock;
                      const numericEffectiveStock = effectiveStock === '' ? 0 : Number(effectiveStock);

                      return (
                        <tr key={sku.id} className={`transition-colors ${isItemDirty ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-gray-50/50'}`}>
                          <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                            {sku.skuCode}
                            {isItemDirty && (
                              <span className="ml-2 inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 animate-pulse">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {sku.options.map((opt) => `${opt.attributeName}: ${opt.value}`).join(' | ') || 'No configurations'}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{sku.formattedPrice}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {sku.stock} units
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                disabled={isSubmitting || numericEffectiveStock <= 0}
                                onClick={() => {
                                  const nextStock = Math.max(0, numericEffectiveStock - 1);
                                  setStockChanges((prev) => ({ ...prev, [sku.id]: nextStock }));
                                }}
                                className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold disabled:opacity-40 select-none transition-colors"
                              >
                                -
                              </button>
                              
                              <input
                                type="number"
                                min={0}
                                value={effectiveStock}
                                disabled={isSubmitting}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '') {
                                    setStockChanges((prev) => ({ ...prev, [sku.id]: '' }));
                                  } else {
                                    const parsedValue = parseInt(val, 10);
                                    if (!isNaN(parsedValue) && parsedValue >= 0) {
                                      setStockChanges((prev) => ({ ...prev, [sku.id]: parsedValue }));
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  if (effectiveStock === '') {
                                    setStockChanges((prev) => ({ ...prev, [sku.id]: 0 }));
                                  }
                                }}
                                className={`w-20 text-center py-1 text-sm font-semibold rounded-lg border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                  isItemDirty ? 'border-amber-500 ring-2 ring-amber-500 text-amber-950 font-bold' : 'border-gray-300'
                                }`}
                              />

                              <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                  const nextStock = numericEffectiveStock + 1;
                                  setStockChanges((prev) => ({ ...prev, [sku.id]: nextStock }));
                                }}
                                className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold disabled:opacity-40 select-none transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
};