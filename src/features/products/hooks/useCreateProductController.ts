import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchAttributesFromApi, type ProductRequestDTO } from '../api/productsApi';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import { useProductMutations } from './useProductMutations';

export const useCreateProductController = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { createProductMutation } = useProductMutations();
  const { data: attributes = [], isLoading: isLoadingAttributes, error: attributesError } = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEYS.all, 'attributes'] as const,
    queryFn: async () => {
      return fetchAttributesFromApi();
    },
    staleTime: 1000 * 60 * 10,
  });

  const handleNameChange = (value: string) => {
    setName(value);
    if (validationError) setValidationError(null);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (validationError) setValidationError(null);
  };

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
    } catch {
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