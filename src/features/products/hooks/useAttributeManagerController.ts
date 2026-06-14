import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import { fetchAttributesFromApi, type AttributeRequestDTO, type AttributeResponseDTO } from '../api/productsApi';
import { useProductMutations } from './useProductMutations';

export const useAttributeManagerController = () => {
  const showSuccess = useNotificationModalStore((state) => state.showSuccess);
  const showError = useNotificationModalStore((state) => state.showError);
  const showConfirm = useNotificationModalStore((state) => state.showConfirm);
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

      showSuccess({
        title: 'Atributo Processado',
        message: `O atributo global "${payload.nome}" foi salvo e integrado com sucesso ao catálogo.`
      });
    } catch {
      setErroValidacao('Erro de salvamento no servidor.');
      showError({
        title: 'Falha de Salvamento',
        message: 'Não foi possível registrar o atributo devido a uma inconsistência no servidor.'
      });
    }
  };

  const handleExcluirAtributo = (id: string, nomeAtributo: string) => {
    showConfirm({
      title: 'Remover Atributo Global',
      message: `Tem certeza que deseja apagar permanentemente o atributo "${nomeAtributo}"? Esta ação removerá o eixo de amarração de SKUs existentes.`,
      onConfirm: async () => {
        try {
          await deleteAttributeMutation.mutateAsync(id);
          showSuccess({
            title: 'Atributo Removido',
            message: `O atributo "${nomeAtributo}" foi deletado com sucesso do banco de dados.`
          });
        } catch {
          showError({
            title: 'Erro de Exclusão',
            message: 'Não foi possível completar a remoção. Verifique se existem produtos utilizando este atributo.'
          });
        }
      }
    });
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