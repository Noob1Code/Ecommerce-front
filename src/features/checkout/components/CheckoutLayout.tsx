import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useCheckoutStore } from '../store/useCheckoutStore';
import type { CheckoutStep } from '../domain/checkout.types';

interface CheckoutLayoutProps {
  children: ReactNode;
}

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'address', label: 'Endereço' },
  { id: 'shipping', label: 'Frete' },
  { id: 'payment', label: 'Pagamento' },
  { id: 'review', label: 'Revisão' },
];

export const CheckoutLayout = ({ children }: CheckoutLayoutProps) => {
  const currentStep = useCheckoutStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Minimalista para Checkout */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-blue-600 transition-colors hover:text-blue-700">
            Marketplace
          </Link>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span className="uppercase tracking-wider">Checkout Seguro</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Indicador de Passos (Stepper) */}
        <nav aria-label="Progress" className="mb-8">
          <ol role="list" className="flex items-center space-x-2 text-sm font-medium text-gray-400">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              // Para simplificar na fase 1, consideramos "completado" quem está antes na array
              const currentIndex = STEPS.findIndex(s => s.id === currentStep);
              const isCompleted = index < currentIndex;

              return (
                <li key={step.id} className="flex items-center">
                  <span className={`transition-colors ${isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-gray-900' : ''}`}>
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span className="mx-2 text-gray-300">›</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Renderização do Passo Atual */}
        {children}
      </main>
    </div>
  );
};