import { useState, useEffect } from 'react';
import { useAuthStore } from '../../auth';
import { customerApi } from '../api/customerApi';

export const useCustomerProfileController = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const token = useAuthStore((state) => state.token);
  const ehCliente = usuario?.perfis.includes('ROLE_CLIENTE') ?? false;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

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
      } catch (err) {
        setMensagemErro('Não foi possível sincronizar seus dados cadastrais com o servidor.');
      } finally {
        setEstaCarregando(false);
      }
    };

    carregarDadosCompletosServidor();
  }, [usuario, ehCliente]);

  const handleSalvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso(null);
    setMensagemErro(null);

    if (!nome.trim() || !email.trim()) {
      setMensagemErro('O nome e o e-mail são campos de preenchimento obrigatório.');
      return;
    }

    if (ehCliente && (!telefone.trim() || !cpf.trim())) {
      setMensagemErro('Para clientes, o Telefone e o CPF são obrigatórios.');
      return;
    }

    if (!ehCliente && !matricula.trim()) {
      setMensagemErro('Para funcionários, a Matrícula Funcional é obrigatória.');
      return;
    }

    setEstaCarregando(true);
    try {
      if (!usuario) throw new Error('Nenhuma sessão de usuário ativa localizada.');

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

      setMensagemSucesso('Seus dados cadastrais foram atualizados com sucesso!');
      setSenha('');
    } catch (err) {
      setMensagemErro('Ocorreu uma falha ao tentar atualizar suas informações de conta.');
    } finally {
      setEstaCarregando(false);
    }
  };

  const handleCancelar = async () => {
    if (!usuario) return;
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      setEstaCarregando(true);
      const dadosPerfil = await customerApi.obterPerfil(usuario.id, ehCliente);
      setNome(dadosPerfil.nome || '');
      setEmail(dadosPerfil.email || '');
      setTelefone(dadosPerfil.telefone || '');
      setCpf(dadosPerfil.cpf || '');
      setMatricula(dadosPerfil.matricula || '');
      setSenha('');
    } catch (err) {
      setMensagemErro('Ocorreu um erro ao tentar restaurar os dados originais.');
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
    mensagemSucesso,
    mensagemErro,
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