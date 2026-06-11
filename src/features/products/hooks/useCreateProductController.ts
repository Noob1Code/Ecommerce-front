// src/features/products/hooks/useCreateProductController.ts

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAttributesFromApi, type ProductRequestDTO } from '../api/productsApi';
import { useProductMutations } from './useProductMutations';

export const useCreateProductController = () => {
  // 1. Estados locais para controlo dos inputs do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 2. Resgata a mutação de criação estruturada no React Query
  const { createProductMutation } = useProductMutations();

  /**
   * Procura dinamicamente todos os atributos estruturados disponíveis no servidor.
   * Corresponde ao @GetMapping do AtributoController no Spring Boot.
   */
  const { data: attributes = [], isLoading: isLoadingAttributes, error: attributesError } = useQuery({
    queryKey: ['products', 'attributes'] as const,
    queryFn: async () => {
      return fetchAttributesFromApi();
    },
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos para tabelas de domínio estáticas
  });

  const handleNameChange = (value: string) => {
    setName(value);
    if (validationError) setValidationError(null);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (validationError) setValidationError(null);
  };

  /**
   * Gere a seleção e remoção de atributos numa matriz de IDs (Checkbox Toggle).
   */
  const handleToggleAttribute = (attributeId: string) => {
    setSelectedAttributeIds((prev) =>
      prev.includes(attributeId)
        ? prev.filter((id) => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedAttributeIds([]);
    setValidationError(null);
  };

  /**
   * Valida as regras de negócio locais e despacha o payload DTO limpo para o servidor.
   */
  const handleCreateSubmit = async (onSuccessCallback?: () => void) => {
    if (name.trim() === '' || description.trim() === '') {
      setValidationError('Erro de Validação: Os campos Nome e Descrição são inteiramente obrigatórios.');
      return;
    }

    const payload: ProductRequestDTO = {
      nome: name,
      descricao: description,
      atributosIds: selectedAttributeIds,
    };

    try {
      await createProductMutation.mutateAsync(payload);
      resetForm();
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      alert('Produto base criado com sucesso no catálogo!');
    } catch (err) {
      setValidationError('Falha Operacional: Não foi possível registar o novo produto no servidor.');
    }
  };

  return {
    name,
    description,
    selectedAttributeIds,
    attributes,
    validationError,
    isLoading: isLoadingAttributes || createProductMutation.isPending,
    error: attributesError ? 'Erro ao carregar os atributos de variação.' : null,
    handleNameChange,
    handleDescriptionChange,
    handleToggleAttribute,
    handleCreateSubmit,
    resetForm,
  };
};