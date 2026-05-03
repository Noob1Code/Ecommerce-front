import { create } from 'zustand';
import type { CheckoutStep } from '../domain/checkout.types';

export interface ShippingMethod {
  id: string;
  label: string;
  price: number;
  estimatedDays: number;
}

interface CheckoutState {
  currentStep: CheckoutStep;
  // Mapa de seleções: [sellerId]: ShippingMethod
  shippingSelections: Record<string, ShippingMethod>;
  
  setStep: (step: CheckoutStep) => void;
  setShippingMethod: (sellerId: string, method: ShippingMethod) => void;
  getShippingTotal: () => number;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  currentStep: 'address',
  shippingSelections: {},
  
  setStep: (step) => set({ currentStep: step }),
  
  setShippingMethod: (sellerId, method) => set((state) => ({
    shippingSelections: {
      ...state.shippingSelections,
      [sellerId]: method
    }
  })),

  getShippingTotal: () => {
    return Object.values(get().shippingSelections).reduce((acc, curr) => acc + curr.price, 0);
  }
}));