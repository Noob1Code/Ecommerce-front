import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarFuncionarioApi } from '../api/authApi';
import type { PerfilUsuario } from '../store/useAuthStore';

/**
 * Controlador de Regras de Negócio para o Cadastro de Funcionários
 * Gerencia buffers locais e lógica de seleção de múltiplos perfis de acesso
 */
export const useEmployeeRegister = () => {
  const navigate = useNavigate();

  // Estados locais controlados do formulário administrativo
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [matricula, setMatricula] = useState('');
  
  // CORREÇÃO: Alterado de string única para array, permitindo conter 1 ou mais papéis simultâneos
  const [perfisSelecionados, setPerfisSelecionados] = useState<PerfilUsuario[]>(['ROLE_ESTOQUE']);
  const [carregando, setCarregando] = useState(false);

  /**
   * Adiciona ou remove um perfil da lista de seleção (Toggle)
   */
  const handleAlternarPerfil = (perfil: PerfilUsuario) => {
    setPerfisSelecionados((prev) => {
      if (prev.includes(perfil)) {
        // Se já estiver selecionado, remove da lista
        return prev.filter((p) => p !== perfil);
      } else {
        // Se não estiver selecionado, adiciona mantendo os anteriores
        return [...prev, perfil];
      }
    });
  };

  const handleCadastrarFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !senha.trim() || !matricula.trim()) {
      alert('Erro de Validação: Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de Segurança: Bloqueia o envio se nenhuma Role estiver marcada
    if (perfisSelecionados.length === 0) {
      alert('Erro de Validação: É necessário informar pelo menos uma regra de acesso para o funcionário.');
      return;
    }

    setCarregando(true);
    try {
      await cadastrarFuncionarioApi({
        nome,
        email,
        senha,
        matricula,
        // Envia o array contendo todas as permissões selecionadas de forma dinâmica
        perfis: perfisSelecionados,
      });
      
      alert('Funcionário administrativo cadastrado com sucesso no banco de dados!');
      
      // Limpa os buffers do formulário após o sucesso na persistência
      setNome('');
      setEmail('');
      setSenha('');
      setMatricula('');
      setPerfisSelecionados(['ROLE_ESTOQUE']);
    } catch (err) {
      alert('Ocorreu um erro ao processar o cadastro do funcionário no Spring Boot.');
    } finally {
      setCarregando(false);
    }
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