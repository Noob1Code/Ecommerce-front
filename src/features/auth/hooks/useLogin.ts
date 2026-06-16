import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { logarUsuarioApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const showError = useNotificationModalStore((state) => state.showError);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroValidacao(null);

    if (!email || !senha) {
      setErroValidacao('Por favor, preencha todos os campos obrigatórios de autenticação.');
      return;
    }

    login({ email, senha });
  };

  return {
    email,
    senha,
    erroValidacao,
    estaCarregando,
    erro: erro ? erro.message : null,
    setEmail,
    setSenha,
    setErroValidacao,
    handleSubmit,
  };
};