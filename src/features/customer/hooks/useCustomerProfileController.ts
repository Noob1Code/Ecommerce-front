import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { useAuthStore } from '../../auth';
import { customerApi } from '../api/customerApi';

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

export const useCustomerProfileController = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const usuario = useAuthStore((state) => state.usuario);
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const token = useAuthStore((state) => state.token);
  const ehCliente = usuario?.perfis.includes('ROLE_CLIENTE') ?? false;
  const showSuccess = useNotificationModalStore((state) => state.showSuccess);
  const showError = useNotificationModalStore((state) => state.showError);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  const { data: dadosPerfil, isLoading: carregandoDados } = useQuery({
    queryKey: ['customer', 'perfil-logado', usuario?.id] as const,
    queryFn: () => customerApi.obterPerfil(usuario!.id, ehCliente),
    enabled: !!usuario,
    staleTime: 0,
  });

  const [dadosCarregadosId, setDadosCarregadosId] = useState<string | null>(null);

  if (dadosPerfil && usuario?.id !== dadosCarregadosId) {
    setDadosCarregadosId(usuario?.id || null);
    setNome(dadosPerfil.nome || '');
    setEmail(dadosPerfil.email || '');
    setTelefone(formatPhone(dadosPerfil.telefone || ''));
    setCpf(formatCPF(dadosPerfil.cpf || ''));
    setMatricula(dadosPerfil.matricula || '');
  }

  const mutationSalvar = useMutation({
    mutationFn: async () => {
      if (!usuario) throw new Error('Sessão inválida.');

      const dadosAtualizados = ehCliente
        ? { nome, email, telefone, cpf, senha: senha || undefined }
        : { nome, email, matricula, senha: senha || undefined, perfis: usuario.perfis };

      await customerApi.atualizarPerfil(usuario.id, dadosAtualizados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'perfil-logado', usuario?.id] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      fazerLogin(token || '', {
        ...usuario!,
        nome,
        email,
        telefone: ehCliente ? telefone : undefined,
        cpf: ehCliente ? cpf : undefined,
        matricula: !ehCliente ? matricula : undefined,
      });

      showSuccess({
        title: 'Perfil Updated',
        message: 'Seus dados cadastrais foram gravados com sucesso!'
      });
      setSenha('');
    },
    onError: () => {
      showError({
        title: 'Erro na Atualização',
        message: 'Falha ao tentar persistir suas informações no servidor.'
      });
    }
  });

  const handleSalvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim()) {
      showError({ title: 'Dados Inválidos', message: 'O nome e o e-mail são obrigatórios.' });
      return;
    }

    if (ehCliente && (!telefone.trim() || !cpf.trim())) {
      showError({ title: 'Dados Incompletos', message: 'Para clientes, o Telefone e o CPF são obrigatórios.' });
      return;
    }

    if (ehCliente) {
      const rawCPF = cpf.replace(/\D/g, '');
      const rawTelefone = telefone.replace(/\D/g, '');

      if (rawCPF.length !== 11) {
        showError({ title: 'CPF Inválido', message: 'O CPF deve conter exatamente 11 dígitos.' });
        return;
      }

      if (rawTelefone.length !== 11) {
        showError({ title: 'Telefone Inválido', message: 'O telefone deve conter exatamente 11 dígitos.' });
        return;
      }
    }

    if (!ehCliente && !matricula.trim()) {
      showError({ title: 'Dados Incompletos', message: 'Para funcionários, a Matrícula Funcional é obrigatória.' });
      return;
    }

    mutationSalvar.mutate();
  };

  const handleCancelar = () => {
    if (dadosPerfil) {
      setNome(dadosPerfil.nome || '');
      setEmail(dadosPerfil.email || '');
      setTelefone(formatPhone(dadosPerfil.telefone || ''));
      setCpf(formatCPF(dadosPerfil.cpf || ''));
      setMatricula(dadosPerfil.matricula || '');
      setSenha('');
    }
  };

  const handleBackToCatalog = () => {
    navigate('/');
  };

  return {
    nome,
    email,
    telefone,
    cpf,
    matricula,
    senha,
    ehCliente,
    estaCarregando: carregandoDados || mutationSalvar.isPending,
    setNome,
    setEmail,
    setTelefone: (val: string) => setTelefone(formatPhone(val)),
    setCpf: (val: string) => setCpf(formatCPF(val)),
    setMatricula,
    setSenha,
    handleSalvarAlteracoes,
    handleCancelar,
    handleBackToCatalog
  };
};