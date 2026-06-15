import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { useAuthStore } from '../../auth';
import { customerApi } from '../api/customerApi';

export const useCustomerProfileController = () => {
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
    setTelefone(dadosPerfil.telefone || '');
    setCpf(dadosPerfil.cpf || '');
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
      setTelefone(dadosPerfil.telefone || '');
      setCpf(dadosPerfil.cpf || '');
      setMatricula(dadosPerfil.matricula || '');
      setSenha('');
    }
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
    setTelefone,
    setCpf,
    setMatricula,
    setSenha,
    handleSalvarAlteracoes,
    handleCancelar
  };
};