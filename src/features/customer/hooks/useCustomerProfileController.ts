import { useState, useEffect } from 'react';
// CORREÇÃO ARQUITETURAL: Importando a partir do arquivo de fachada da feature (index.ts público)
import { useAuthStore } from '../../auth';
import { customerApi } from '../api/customerApi';

export const useCustomerProfileController = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const fazerLogin = useAuthStore((state) => state.fazerLogin);
  const token = useAuthStore((state) => state.token);

  // Buffers locais controlados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // Sincroniza os buffers locais com os metadados estáveis da sessão do usuário
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
      setCpf(usuario.cpf || '');
    }
  }, [usuario]);

  const handleSalvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemSucesso(null);
    setMensagemErro(null);

    if (!nome.trim() || !email.trim()) {
      setMensagemErro('O nome e o e-mail são campos de preenchimento obrigatório.');
      return;
    }

    setEstaCarregando(true);
    try {
      if (!usuario) throw new Error('Nenhuma sessão de usuário localizada.');

      // Persiste a mutação na camada de dados
      await customerApi.atualizarPerfil(usuario.id, { nome, email, telefone, cpf });

      // Atualiza sincronizadamente o estado e o disco local através da store global
      fazerLogin(token || '', {
        ...usuario,
        nome,
        email,
        telefone,
        cpf
      });

      setMensagemSucesso('Seus dados cadastrais foram atualizados com sucesso!');
    } catch (err) {
      setMensagemErro('Ocorreu uma falha ao tentar atualizar suas informações de conta.');
    } finally {
      setEstaCarregando(false);
    }
  };

  const handleCancelar = () => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
      setCpf(usuario.cpf || '');
      setMensagemSucesso(null);
      setMensagemErro(null);
    }
  };

  return {
    nome,
    email,
    telefone,
    cpf,
    estaCarregando,
    mensagemSucesso,
    mensagemErro,
    setNome,
    setEmail,
    setTelefone,
    setCpf,
    handleSalvarAlteracoes,
    handleCancelar
  };
};