import { useCheckoutStore } from '../../store/useCheckoutStore';
import { Button } from '../../../../shared/components/ui';

export const CheckoutReviewStep = () => {
  const setStep = useCheckoutStore((state) => state.setStep);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">4. Revisão Final</h2>
      <p className="text-gray-500 mb-8">
        (Placeholder) Resumo visual de todos os pacotes, subtotais, fretes, endereço e pagamento antes de enviar para a API.
      </p>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep('payment')} className="px-6 py-2">
          Voltar
        </Button>
        <Button onClick={() => alert('Disparar POST /orders')} className="!bg-green-600 hover:!bg-green-700 px-8 py-2">
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
};