import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { cadastrarClienteApi, logarUsuarioApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

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

    let maskedValue = value;
    if (name === 'cpf') {
      maskedValue = formatCPF(value);
    } else if (name === 'telefone') {
      maskedValue = formatPhone(value);
    }

    setFormulario((prev) => ({
      ...prev,
      [name]: maskedValue,
    }));
    setErroValidacao(null);
  };

  const { mutate: registrarCliente, isPending: estaCarregando, error: erro } = useMutation({
    mutationFn: async () => {
      await cadastrarClienteApi({
        nome: formulario.nome,
        email: formulario.email,
        senha: formulario.senha,
        cpf: formulario.cpf,
        telefone: formulario.telefone,
      });

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

    if (!formulario.nome || !formulario.email || !formulario.senha || !formulario.cpf || !formulario.telefone) {
      setErroValidacao('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const rawCPF = formulario.cpf.replace(/\D/g, '');
    const rawTelefone = formulario.telefone.replace(/\D/g, '');

    if (rawCPF.length !== 11) {
      setErroValidacao('O CPF deve conter exatamente 11 dígitos.');
      return;
    }

    if (rawTelefone.length !== 11) {
      setErroValidacao('O telefone deve conter exatamente 11 dígitos.');
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