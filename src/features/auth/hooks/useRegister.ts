import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cadastrarClienteApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);

  const { mutate: registrarCliente, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: cadastrarClienteApi,
    onSuccess: (resultado) => {
      fazerLogin(resultado.token, resultado.usuario);
      navigate('/');
    },
  });

  return {
    registrarCliente,
    estaCarregando,
    erro: erro ? erro.message : null,
  };
};