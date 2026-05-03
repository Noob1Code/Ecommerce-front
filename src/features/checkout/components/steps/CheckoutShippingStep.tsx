import { useCartStore } from '../../../../app/store/useCartStore';
import { useCartPackages } from '../../../cart/hooks/useCartPackages';
import { useCheckoutStore, type ShippingMethod } from '../../store/useCheckoutStore';
import { Button } from '../../../../shared/components/ui';

// MOCK: Opções de frete que viriam de uma API por vendedor
const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'std', label: 'Entrega Padrão', price: 5.90, estimatedDays: 5 },
  { id: 'exp', label: 'Entrega Expresso', price: 15.00, estimatedDays: 2 },
  { id: 'free', label: 'Levantamento em Loja', price: 0.00, estimatedDays: 1 },
];

export const CheckoutShippingStep = () => {
  const setStep = useCheckoutStore((state) => state.setStep);
  const { shippingSelections, setShippingMethod, getShippingTotal } = useCheckoutStore();
  const selectedItemsTotal = useCartStore((state) => state.getSelectedTotal());
  
  // Obtemos apenas os pacotes dos itens selecionados
  const packages = useCartPackages(true);
  
  const shippingTotal = getShippingTotal();
  const grandTotal = selectedItemsTotal + shippingTotal;

  // Validação: Todos os vendedores têm um frete selecionado?
  const isNextDisabled = packages.some(pkg => !shippingSelections[pkg.sellerId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Opções de Entrega</h2>
        <span className="text-sm text-gray-500">{packages.length} pacotes distintos</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LADO ESQUERDO: Lista de Pacotes por Vendedor */}
        <div className="lg:col-span-2 space-y-6">
          {packages.map((pkg) => (
            <div key={pkg.sellerId} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Header do Vendedor */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  Pacote de <span className="text-blue-600">{pkg.sellerName}</span>
                </p>
              </div>

              <div className="p-6">
                {/* Mini lista de itens (Apenas nomes e quantidades) */}
                <div className="mb-6 space-y-2">
                  {pkg.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Opções de Frete para ESTE Vendedor */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escolha o frete:</p>
                  <div className="grid grid-cols-1 gap-3">
                    {MOCK_SHIPPING_METHODS.map((method) => {
                      const isSelected = shippingSelections[pkg.sellerId]?.id === method.id;
                      
                      return (
                        <label 
                          key={method.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name={`shipping-${pkg.sellerId}`}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              checked={isSelected}
                              onChange={() => setShippingMethod(pkg.sellerId, method)}
                            />
                            <div className="ml-4">
                              <p className="text-sm font-bold text-gray-900">{method.label}</p>
                              <p className="text-xs text-gray-500">Chega em {method.estimatedDays} dias úteis</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {method.price === 0 ? 'Grátis' : `$${method.price.toFixed(2)}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LADO DIREITO: Resumo de Valores (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do Checkout</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Produtos selecionados</span>
                <span>${selectedItemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total de Fretes</span>
                <span className={shippingTotal > 0 ? 'text-gray-900 font-medium' : ''}>
                  {shippingTotal === 0 ? 'A calcular' : `$${shippingTotal.toFixed(2)}`}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button 
                onClick={() => setStep('payment')} 
                disabled={isNextDisabled}
                className="w-full py-3"
              >
                Próximo: Pagamento
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setStep('address')} 
                className="w-full py-2"
              >
                Voltar ao Endereço
              </Button>
              
              {isNextDisabled && (
                <p className="text-[10px] text-center text-red-500 mt-2">
                  * Selecione o frete para todos os pacotes antes de prosseguir.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};