import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { logarUsuarioApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const showError = useNotificationModalStore((state) => state.showError);

  const { mutate: login, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: logarUsuarioApi,
    onSuccess: (resultado) => {
      fazerLogin(resultado.token, resultado.usuario);
      navigate('/');
    },
    onError: () => {
      showError({
        title: 'Acesso Recusado',
        message: 'E-mail ou senha incorretos. Por favor, confira suas credenciais de acesso e tente novamente.'
      });
    }
  });

  return {
    login,
    estaCarregando,
    erro: erro ? erro.message : null,
  };
};