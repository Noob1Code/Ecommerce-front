import { useEffect, useState } from 'react';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { useAuthStore } from '../../auth';
import { customerApi } from '../api/customerApi';

export const useCustomerProfileController = () => {
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
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    const carregarDadosCompletosServidor = async () => {
      if (!usuario) return;

      try {
        setEstaCarregando(true);
        const dadosPerfil = await customerApi.obterPerfil(usuario.id, ehCliente);
        setNome(dadosPerfil.nome || '');
        setEmail(dadosPerfil.email || '');
        setTelefone(dadosPerfil.telefone || '');
        setCpf(dadosPerfil.cpf || '');
        setMatricula(dadosPerfil.matricula || '');
      } catch {
        showError({
          title: 'Erro de Sincronia',
          message: 'Não foi possível carregar seus dados cadastrais do servidor.'
        });
      } finally {
        setEstaCarregando(false);
      }
    };

    carregarDadosCompletosServidor();
  }, [usuario, ehCliente, showError]);

  const handleSalvarAlteracoes = async (e: React.FormEvent) => {
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

    setEstaCarregando(true);
    try {
      if (!usuario) throw new Error('Sessão inválida.');

      const dadosAtualizados = ehCliente
        ? { nome, email, telefone, cpf, senha: senha || undefined }
        : { nome, email, matricula, senha: senha || undefined, perfis: usuario.perfis };

      await customerApi.atualizarPerfil(usuario.id, dadosAtualizados);

      fazerLogin(token || '', {
        ...usuario,
        nome,
        email,
        telefone: ehCliente ? telefone : undefined,
        cpf: ehCliente ? cpf : undefined,
        matricula: !ehCliente ? matricula : undefined,
      });

      showSuccess({
        title: 'Perfil Atualizado',
        message: 'Seus dados cadastrais foram gravados com sucesso!'
      });
      setSenha('');
    } catch {
      showError({ title: 'Erro na Atualização', message: 'Falha ao tentar persistir suas informações no servidor.' });
    } finally {
      setEstaCarregando(false);
    }
  };

  const handleCancelar = async () => {
    if (!usuario) return;
    try {
      setEstaCarregando(true);
      const dadosPerfil = await customerApi.obterPerfil(usuario.id, ehCliente);
      setNome(dadosPerfil.nome || '');
      setEmail(dadosPerfil.email || '');
      setTelefone(dadosPerfil.telefone || '');
      setCpf(dadosPerfil.cpf || '');
      setMatricula(dadosPerfil.matricula || '');
      setSenha('');
    } catch {
      showError({ title: 'Erro ao Restaurar', message: 'Falha ao recuperar dados originais.' });
    } finally {
      setEstaCarregando(false);
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
    estaCarregando,
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