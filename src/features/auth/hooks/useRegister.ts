import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { cadastrarClienteApi, logarUsuarioApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const showError = useNotificationModalStore((state) => state.showError);

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    telefone: '',
  });

  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErroValidacao(null);
  };

  // A inteligência do fluxo sequencial agora vive aqui no mutationFn do controlador
  const { mutate: registrarCliente, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: async () => {
      // 1. Cria a conta do cliente no servidor
      await cadastrarClienteApi({
        nome: formulario.nome,
        email: formulario.email,
        senha: formulario.senha,
        cpf: formulario.cpf || undefined,
        telefone: formulario.telefone || undefined,
      });

      // 2. Realiza o login automático imediatamente aproveitando as credenciais
      const respostaAutenticada = await logarUsuarioApi({
        email: formulario.email,
        senha: formulario.senha,
      });

      return respostaAutenticada;
    },
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formulario.nome || !formulario.email || !formulario.senha) {
      setErroValidacao('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formulario.senha !== formulario.confirmarSenha) {
      setErroValidacao('As senhas informadas não coincidem.');
      return;
    }

    if (formulario.senha.length < 6) {
      setErroValidacao('A senha provisória deve conter no mínimo 6 caracteres.');
      return;
    }

    registrarCliente();
  };

  return {
    formulario,
    erroValidacao,
    estaCarregando,
    erro: erro ? erro.message : null,
    handleChange,
    handleSubmit,
    setErroValidacao,
  };
};