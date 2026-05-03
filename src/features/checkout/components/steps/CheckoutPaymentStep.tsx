import { useCheckoutStore } from '../../store/useCheckoutStore';
import { Button } from '../../../../shared/components/ui';

export const CheckoutPaymentStep = () => {
  const setStep = useCheckoutStore((state) => state.setStep);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">3. Pagamento</h2>
      <p className="text-gray-500 mb-8">
        (Placeholder) Integração do cartão de crédito ou gateway de pagamentos entrará aqui.
      </p>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep('shipping')} className="px-6 py-2">
          Voltar
        </Button>
        <Button onClick={() => setStep('review')} className="px-8 py-2">
          Rever Encomenda
        </Button>
      </div>
    </div>
  );
};