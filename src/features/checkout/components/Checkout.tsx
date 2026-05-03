import { useCheckoutStore } from '../store/useCheckoutStore';
import { CheckoutLayout } from './CheckoutLayout';
import { CheckoutAddressStep } from './steps/CheckoutAddressStep';
import { CheckoutShippingStep } from './steps/CheckoutShippingStep';
import { CheckoutPaymentStep } from './steps/CheckoutPaymentStep';
import { CheckoutReviewStep } from './steps/CheckoutReviewStep';

export const Checkout = () => {
  const currentStep = useCheckoutStore((state) => state.currentStep);

  return (
    <CheckoutLayout>
      <div className="transition-all duration-300">
        {currentStep === 'address' && <CheckoutAddressStep />}
        {currentStep === 'shipping' && <CheckoutShippingStep />}
        {currentStep === 'payment' && <CheckoutPaymentStep />}
        {currentStep === 'review' && <CheckoutReviewStep />}
      </div>
    </CheckoutLayout>
  );
};