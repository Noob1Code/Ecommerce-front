import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { cadastrarClienteApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const showError = useNotificationModalStore((state) => state.showError);

  const { mutate: registrarCliente, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: cadastrarClienteApi,
    onSuccess: (resultado) => {
      fazerLogin(resultado.token, resultado.usuario);
      navigate('/');
    },
    onError: () => {
      showError({
        title: 'Falha no Cadastro',
        message: 'Não foi possível concluir o seu registro. Por favor, verifique se o e-mail ou documento informado já não estão vinculados a outra conta.'
      });
    }
  });

  return {
    registrarCliente,
    estaCarregando,
    erro: erro ? erro.message : null,
  };
};