import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cadastrarClienteApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);

  const { mutate: registrarCliente, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: cadastrarClienteApi,
    onSuccess: (usuarioCard) => {
      const tokenSimulado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_string';
      
      fazerLogin(tokenSimulado, usuarioCard);
      navigate('/');
    },
  });

  return {
    registrarCliente,
    estaCarregando,
    erro: erro ? erro.message : null,
  };
};