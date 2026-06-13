import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchAttributesFromApi, type AttributeRequestDTO, type AttributeResponseDTO } from '../api/productsApi';
import { useProductMutations } from './useProductMutations';

export const useAttributeManagerController = () => {
  const [nome, setNome] = useState('');
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const { createAttributeMutation, updateAttributeMutation, deleteAttributeMutation } = useProductMutations();

  const { data: atributos = [], isLoading, error } = useQuery<AttributeResponseDTO[]>({
    queryKey: ['products', 'attributes-manager-clean'],
    queryFn: fetchAttributesFromApi,
    staleTime: 1000 * 60 * 5,
  });

  const handleIniciarEdicao = (atributo: AttributeResponseDTO) => {
    setIdEmEdicao(atributo.id);
    setNome(atributo.nome);
    setErroValidacao(null);
  };

  const handleCancelarEdicao = () => {
    setIdEmEdicao(null);
    setNome('');
    setErroValidacao(null);
  };

  const handleSalvarAtributo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setErroValidacao('O nome do atributo é obrigatório.');
      return;
    }

    const payload: AttributeRequestDTO = { nome: nome.trim() };

    try {
      if (idEmEdicao) {
        await updateAttributeMutation.mutateAsync({ id: idEmEdicao, payload });
      } else {
        await createAttributeMutation.mutateAsync(payload);
      }
      handleCancelarEdicao();
      alert('Atributo processado com sucesso!');
    } catch {
      setErroValidacao('Erro de salvamento no servidor.');
    }
  };

  const handleExcluirAtributo = async (id: string, nomeAtributo: string) => {
    if (!window.confirm(`Deseja deletar permanentemente o atributo ${nomeAtributo}?`)) return;
    try {
      await deleteAttributeMutation.mutateAsync(id);
      alert('Atributo removido!');
    } catch {
      alert('Erro ao excluir.');
    }
  };

  return {
    atributos,
    nome,
    idEmEdicao,
    erroValidacao,
    estaCarregando: isLoading || createAttributeMutation.isPending || updateAttributeMutation.isPending || deleteAttributeMutation.isPending,
    erroServidor: error ? 'Erro de rede.' : null,
    setNome,
    handleIniciarEdicao,
    handleCancelarEdicao,
    handleSalvarAtributo,
    handleExcluirAtributo,
  };
};