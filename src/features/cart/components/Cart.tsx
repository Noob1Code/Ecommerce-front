import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../app/store';
import { useCartPackages } from '../hooks/useCartPackages';

export const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    selectedItemIds,
    toggleItemSelection,
    toggleSellerSelection,
    selectAll,
    unselectAll,
    getSelectedItems
  } = useCartStore();

  const selectedTotal = useCartStore((state) => state.getSelectedTotal());
  
  const cartPackages = useCartPackages();
  
  // Derivando estado visual de seleção global
  const isGlobalAllSelected = items.length > 0 && selectedItemIds.length === items.length;
  const hasSelectedItems = selectedItemIds.length > 0;
  // Estado indeterminate global
  const isGlobalIndeterminate = hasSelectedItems && !isGlobalAllSelected;
  
  const selectedItems = getSelectedItems();

  const selectedCount = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSelectAllToggle = () => {
    if (isGlobalAllSelected) unselectAll();
    else selectAll();
  };

  const handleCheckout = (e: React.MouseEvent) => {
    if (!hasSelectedItems) {
      e.preventDefault();
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your bag is empty</h2>
        <p className="text-gray-500">Looks like you haven't added any items yet.</p>
        <Link
          to="/"
          className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
          
          <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={isGlobalAllSelected}
              ref={(el) => {
                // Aplicação do estado indeterminate no Select All
                if (el) el.indeterminate = isGlobalIndeterminate;
              }}
              onChange={handleSelectAllToggle}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Select All</span>
          </label>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="space-y-6">
        {cartPackages.map((pkg) => {
          // OTIMIZAÇÃO VISUAL: Tri-state para o checkbox do vendedor
          const packageSelectedCount = pkg.items.filter(item =>
            selectedItemIds.includes(item.id)
          ).length;

          const isPackageAllSelected = packageSelectedCount === pkg.items.length;
          const isPackageIndeterminate = packageSelectedCount > 0 && !isPackageAllSelected;

          return (
            <div key={pkg.sellerId} className="bg-white shadow-sm sm:rounded-lg border border-gray-200 overflow-hidden">
              
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center sm:px-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isPackageAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPackageIndeterminate;
                    }}
                    onChange={() => toggleSellerSelection(pkg.items.map(i => i.id))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <h2 className="text-sm font-medium text-gray-700">
                    Package from <span className="font-bold text-gray-900">{pkg.sellerName}</span>
                  </h2>
                </div>
                
                <span className="text-sm text-gray-500">
                  {pkg.totalItems} {pkg.totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <ul role="list" className="divide-y divide-gray-200">
                {pkg.items.map((item) => (
                  <li key={item.id} className="flex py-6 px-4 sm:px-6 relative transition-colors hover:bg-gray-50/50">
                    
                    <div className="mr-4 flex items-center h-24">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={`h-full w-full object-cover object-center transition-opacity ${!selectedItemIds.includes(item.id) && 'opacity-60 grayscale-[0.3]'}`}
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <div className="flex flex-col">
                            <h3>
                              <Link to={`/product/${item.productId || item.id}`} className="hover:text-blue-600">
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm mt-4">
                        <div className="flex items-center">
                          <div className="flex items-center rounded-md border border-gray-300 bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md transition-colors"
                            >
                              -
                            </button>
                            
                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) updateQuantity(item.id, Math.max(1, Math.min(val, item.stock)));
                              }}
                              className="w-16 border-y-0 border-x border-gray-300 py-1 text-center text-sm font-medium text-gray-700 focus:outline-none"
                            />
                            
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="font-medium text-red-600 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gray-50 px-4 py-6 sm:rounded-lg sm:px-6 border border-gray-200">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Selected Subtotal ({selectedCount} items)</p>
          <p className="text-xl">${selectedTotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 mb-6">
          Shipping and taxes calculated at checkout.
        </p>
        
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleCheckout}
            disabled={!hasSelectedItems}
            className={`w-full flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm transition-all ${
              hasSelectedItems 
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' 
                : 'bg-gray-300 cursor-not-allowed opacity-70'
            }`}
          >
            Proceed to Checkout
          </button>
          
          {!hasSelectedItems && (
            <p className="mt-3 text-sm text-red-500 font-medium">
              Please select at least one item to proceed to checkout.
            </p>
          )}
        </div>
        
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or{' '}
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Continue Shopping<span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};