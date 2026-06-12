import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchAttributesFromApi, type AttributeRequestDTO, type AttributeResponseDTO } from '../api/productsApi';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import { useProductMutations } from './useProductMutations';

export const useAttributeManagerController = () => {
    const [nome, setNome] = useState('');
    const [valoresInput, setValoresInput] = useState('');
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [erroValidacao, setErroValidacao] = useState<string | null>(null);
    const { createAttributeMutation, updateAttributeMutation, deleteAttributeMutation } = useProductMutations();
    const { data: atributos = [], isLoading, error } = useQuery<AttributeResponseDTO[]>({
        queryKey: [...PRODUCTS_QUERY_KEYS.all, 'attributes-manager'] as const,
        queryFn: fetchAttributesFromApi,
        staleTime: 1000 * 60 * 5,
    });

    const handleIniciarEdicao = (atributo: AttributeResponseDTO) => {
        setIdEmEdicao(atributo.id);
        setNome(atributo.nome);
        setValoresInput(atributo.valores?.join(', ') || '');
        setErroValidacao(null);
    };

    const handleCancelarEdicao = () => {
        setIdEmEdicao(null);
        setNome('');
        setValoresInput('');
        setErroValidacao(null);
    };

    const handleSalvarAtributo = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim() || !valoresInput.trim()) {
            setErroValidacao('Erro de Validação: O nome do atributo e suas opções de valores são obrigatórios.');
            return;
        }

        const valoresArray = valoresInput
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v.length > 0);

        if (valoresArray.length === 0) {
            setErroValidacao('Erro de Validação: Insira ao menos um valor válido para o atributo.');
            return;
        }

        const payload: AttributeRequestDTO = {
            nome: nome.trim(),
            valores: valoresArray,
        };

        try {
            if (idEmEdicao) {
                await updateAttributeMutation.mutateAsync({ id: idEmEdicao, payload });
                alert('Atributo técnico atualizado com sucesso!');
            } else {
                await createAttributeMutation.mutateAsync(payload);
                alert('Novo eixo de atributo cadastrado com sucesso!');
            }
            handleCancelarEdicao();
        } catch (err) {
            setErroValidacao('Falha Operacional: Erro de comunicação com o servidor de faturamento.');
        }
    };

    const handleExcluirAtributo = async (id: string, nomeAtributo: string) => {
        if (!window.confirm(`Tem certeza que deseja inativar/deletar o atributo [${nomeAtributo}]?`)) return;

        try {
            await deleteAttributeMutation.mutateAsync(id);
            alert('Status do atributo modificado com sucesso!');
        } catch (err) {
            alert('Falha ao tentar remover o atributo selecionado.');
        }
    };

    return {
        atributos,
        nome,
        valoresInput,
        idEmEdicao,
        erroValidacao,
        estaCarregando: isLoading || createAttributeMutation.isPending || updateAttributeMutation.isPending || deleteAttributeMutation.isPending,
        erroServidor: error ? 'Erro ao sincronizar os atributos com o servidor.' : null,
        setNome,
        setValoresInput,
        handleIniciarEdicao,
        handleCancelarEdicao,
        handleSalvarAtributo,
        handleExcluirAtributo,
    };
};