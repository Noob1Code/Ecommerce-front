import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { cadastrarFuncionarioApi } from '../api/authApi';
import type { PerfilUsuario } from '../store/useAuthStore';

export const useEmployeeRegister = () => {
  const navigate = useNavigate();
  const showSuccess = useNotificationModalStore((state) => state.showSuccess);
  const showError = useNotificationModalStore((state) => state.showError);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [matricula, setMatricula] = useState('');
  const [perfisSelecionados, setPerfisSelecionados] = useState<PerfilUsuario[]>(['ROLE_ESTOQUE']);

  const handleAlternarPerfil = (perfil: PerfilUsuario) => {
    setPerfisSelecionados((prev) => {
      if (prev.includes(perfil)) {
        return prev.filter((p) => p !== perfil);
      } else {
        return [...prev, perfil];
      }
    });
  };

  const { mutate: executarCadastro, isPending: carregando } = useMutation({
    mutationFn: cadastrarFuncionarioApi,
    onSuccess: () => {
      showSuccess({
        title: 'Contratação Concluída',
        message: `O colaborador "${nome}" foi registrado com sucesso sob a matrícula funcional "${matricula}".`
      });

      setNome('');
      setEmail('');
      setSenha('');
      setMatricula('');
      setPerfisSelecionados(['ROLE_ESTOQUE']);
    },
    onError: () => {
      showError({
        title: 'Falha no Registro',
        message: 'Ocorreu um erro interno de persistência ao processar a contratação do funcionário no Spring Boot.'
      });
    }
  });

  const handleCadastrarFuncionario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !senha.trim() || !matricula.trim()) {
      showError({
        title: 'Campos Incompletos',
        message: 'Por favor, certifique-se de preencher todos os dados cadastrais obrigatórios do formulário.'
      });
      return;
    }

    if (perfisSelecionados.length === 0) {
      showError({
        title: 'Nível de Acesso Obrigatório',
        message: 'É mandatório associar pelo menos um papel de autoridade (Role) de acesso para o novo funcionário.'
      });
      return;
    }

    executarCadastro({
      nome,
      email,
      senha,
      matricula,
      perfis: perfisSelecionados,
    });
  };

  const handleVoltar = () => {
    navigate('/backoffice');
  };

  return {
    nome,
    email,
    senha,
    matricula,
    perfisSelecionados,
    carregando,
    setNome,
    setEmail,
    setSenha,
    setMatricula,
    handleAlternarPerfil,
    handleCadastrarFuncionario,
    handleVoltar,
  };
};