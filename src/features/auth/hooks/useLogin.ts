import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logarUsuarioApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);

  const { mutate: login, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: logarUsuarioApi,
    onSuccess: (resultado) => {
      fazerLogin(resultado.token, resultado.usuario);
      navigate('/');
    },
  });

  return {
    login,
    estaCarregando,
    erro: erro ? erro.message : null,
  };
};