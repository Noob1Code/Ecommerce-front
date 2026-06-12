import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarFuncionarioApi } from '../api/authApi';
import type { PerfilUsuario } from '../store/useAuthStore';

export const useEmployeeRegister = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [matricula, setMatricula] = useState('');
  const [perfisSelecionados, setPerfisSelecionados] = useState<PerfilUsuario[]>(['ROLE_ESTOQUE']);
  const [carregando, setCarregando] = useState(false);
  const handleAlternarPerfil = (perfil: PerfilUsuario) => {
    setPerfisSelecionados((prev) => {
      if (prev.includes(perfil)) {
        return prev.filter((p) => p !== perfil);
      } else {
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
        perfis: perfisSelecionados,
      });
      
      alert('Funcionário administrativo cadastrado com sucesso no banco de dados!');
      setNome('');
      setEmail('');
      setSenha('');
      setMatricula('');
      setPerfisSelecionados(['ROLE_ESTOQUE']);
    } catch {
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