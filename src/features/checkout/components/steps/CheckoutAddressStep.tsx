import { useCheckoutStore } from '../../store/useCheckoutStore';
import { Button } from '../../../../shared/components/ui';

export const CheckoutAddressStep = () => {
  const setStep = useCheckoutStore((state) => state.setStep);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">1. Endereço de Entrega</h2>
      <p className="text-gray-500 mb-8">
        (Placeholder) Formulário ou seleção de moradas do utilizador entrará aqui.
      </p>
      
      <div className="flex justify-end">
        <Button onClick={() => setStep('shipping')} className="px-8 py-2">
          Continuar para Frete
        </Button>
      </div>
    </div>
  );
};