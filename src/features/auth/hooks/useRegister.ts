import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerCustomerApi, type RegisterInput } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const { mutate: registerCustomer, isPending, error } = useMutation({
    mutationFn: registerCustomerApi,
    onSuccess: (user) => {
      // Simulate automatic authentication extraction upon successful registration sequence
      // In production, backend registration returns a payload containing both the token and the user
      const simulatedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_string';
      
      loginUser(simulatedToken, user);
      navigate('/');
    },
  });

  return {
    registerCustomer,
    isLoading: isPending,
    error: error ? error.message : null,
  };
};