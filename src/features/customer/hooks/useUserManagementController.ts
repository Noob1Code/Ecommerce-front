import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import type { ClienteResponseDTO, FuncionarioResponseDTO } from '../../auth';
import { customerApi } from '../api/customerApi';
import { CustomerMapper } from '../domain/customer.mapper';
import type { ClienteAdminRequestDTO, FuncionarioAdminRequestDTO, UserFormState } from '../domain/customer.types';

export const useUserManagementController = () => {
    const showSuccess = useNotificationModalStore((state) => state.showSuccess);
    const showError = useNotificationModalStore((state) => state.showError);
    const showConfirm = useNotificationModalStore((state) => state.showConfirm);
    const queryClient = useQueryClient();

    const [abaAtiva, setAbaAtiva] = useState<'clientes' | 'funcionarios'>('clientes');
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [usuarioIdEmEdicao, setUsuarioIdEmEdicao] = useState<string | null>(null);
    const [formEdicao, setFormEdicao] = useState<UserFormState | null>(null);
    const [exibirFormCriacao, setExibirFormCriacao] = useState(false);

    const [formCriacao, setFormCriacao] = useState({
        nome: '',
        email: '',
        matricula: '',
        senha: '',
        roles: [] as string[]
    });

    const { data: clientes = [], isLoading: carregandoClientes, error: erroClientes } = useQuery<ClienteResponseDTO[], Error>({
        queryKey: ['iam', 'clientes-list'] as const,
        queryFn: customerApi.listarClientesParaAdmin,
        staleTime: 1000 * 60 * 2,
    });

    const { data: funcionarios = [], isLoading: carregandoFuncionarios, error: erroFuncionarios } = useQuery<FuncionarioResponseDTO[], Error>({
        queryKey: ['iam', 'funcionarios-list'] as const,
        queryFn: customerApi.listarFuncionariosParaAdmin,
        staleTime: 1000 * 60 * 2,
    });

    const mutacaoCriarFuncionario = useMutation({
        mutationFn: customerApi.criarFuncionarioPorAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['iam', 'funcionarios-list'] });
            setExibirFormCriacao(false);
            setFormCriacao({ nome: '', email: '', matricula: '', senha: '', roles: [] });
            showSuccess({
                title: 'Funcionário Registrado',
                message: 'Novo funcionário registrado com sucesso no sistema!'
            });
        },
        onError: () => {
            showError({
                title: 'Falha no Cadastro',
                message: 'Ocorreu uma falha ao tentar cadastrar o funcionário. Verifique os dados.'
            });
        }
    });

    const mutacaoAtualizarCliente = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ClienteAdminRequestDTO }) =>
            customerApi.atualizarClientePorAdmin(id, payload),
        onSuccess: (_, variaveis) => {
            queryClient.invalidateQueries({ queryKey: ['iam', 'clientes-list'] });
            queryClient.invalidateQueries({ queryKey: ['customer', 'perfil-logado', variaveis.id] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            fecharEdicao();
            showSuccess({
                title: 'Cadastro Updated',
                message: 'Cadastro do cliente atualizado com sucesso!'
            });
        },
        onError: () => {
            showError({
                title: 'Falha na Atualização',
                message: 'Falha ao tentar atualizar dados do cliente.'
            });
        }
    });

    const mutacaoStatusCliente = useMutation({
        mutationFn: customerApi.alterarStatusClientePorAdmin,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['iam', 'clientes-list'] });
            queryClient.invalidateQueries({ queryKey: ['customer', 'perfil-logado', id] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            showSuccess({
                title: 'Status Modificado',
                message: 'Status do cliente modificado com sucesso!'
            });
        },
        onError: () => {
            showError({
                title: 'Falha na Alteração',
                message: 'Falha ao alterar o status do cliente.'
            });
        }
    });

    const mutacaoAtualizarFuncionario = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FuncionarioAdminRequestDTO }) =>
            customerApi.atualizarFuncionarioPorAdmin(id, payload),
        onSuccess: (_, variaveis) => {
            queryClient.invalidateQueries({ queryKey: ['iam', 'funcionarios-list'] });
            queryClient.invalidateQueries({ queryKey: ['customer', 'perfil-logado', variaveis.id] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            fecharEdicao();
            showSuccess({
                title: 'Cadastro Atualizado',
                message: 'Cadastro do funcionário atualizado com sucesso!'
            });
        },
        onError: () => {
            showError({
                title: 'Falha na Atualização',
                message: 'Falha ao tentar atualizar dados do funcionário.'
            });
        }
    });

    const mutacaoStatusFuncionario = useMutation({
        mutationFn: customerApi.alterarStatusFuncionarioPorAdmin,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['iam', 'funcionarios-list'] });
            queryClient.invalidateQueries({ queryKey: ['customer', 'perfil-logado', id] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            showSuccess({
                title: 'Status Modificado',
                message: 'Status do funcionário modificado com sucesso!'
            });
        },
        onError: () => {
            showError({
                title: 'Falha na Alteração',
                message: 'Falha ao alterar o status do funcionário.'
            });
        }
    });

    const clientesFiltrados = useMemo(() => {
        if (!clientes) return [];
        return clientes.filter((c) =>
            c.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            c.email.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            (c.cpf && c.cpf.includes(termoPesquisa))
        );
    }, [clientes, termoPesquisa]);

    const funcionariosFiltrados = useMemo(() => {
        if (!funcionarios) return [];
        return funcionarios.filter((f) =>
            f.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            f.email.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            (f.matricula && f.matricula.includes(termoPesquisa))
        );
    }, [funcionarios, termoPesquisa]);

    const iniciarEdicaoCliente = (cliente: ClienteResponseDTO) => {
        setUsuarioIdEmEdicao(cliente.id);
        setFormEdicao({
            nome: cliente.nome,
            email: cliente.email,
            documento: cliente.cpf || '',
            telefone: cliente.telefone || '',
            senha: ''
        });
    };

    const iniciarEdicaoFuncionario = (func: FuncionarioResponseDTO) => {
        setUsuarioIdEmEdicao(func.id);
        setFormEdicao({
            nome: func.nome,
            email: func.email,
            documento: func.matricula || '',
            telefone: '',
            senha: '',
            roles: Array.from(func.roles || [])
        });
    };

    const handleMudancaForm = (campo: keyof UserFormState, valor: string | string[]) => {
        setFormEdicao((prev) => (prev ? { ...prev, [campo]: valor } : null));
    };

    const handleToggleRoleFuncionario = (role: string) => {
        if (!formEdicao || !formEdicao.roles) return;
        const jaPossui = formEdicao.roles.includes(role);
        const novasRoles = jaPossui
            ? formEdicao.roles.filter((r) => r !== role)
            : [...formEdicao.roles, role];
        handleMudancaForm('roles', novasRoles);
    };

    const handleMudancaFormCriacao = (campo: string, valor: string | string[]) => {
        setFormCriacao((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleToggleRoleCriacao = (role: string) => {
        const jaPossui = formCriacao.roles.includes(role);
        const novasRoles = jaPossui
            ? formCriacao.roles.filter((r) => r !== role)
            : [...formCriacao.roles, role];
        handleMudancaFormCriacao('roles', novasRoles);
    };

    const submeterCriacaoFuncionario = (e: React.FormEvent) => {
        e.preventDefault();
        if (formCriacao.roles.length === 0) {
            showError({
                title: 'Ação Abortada',
                message: 'É obrigatório associar pelo menos um perfil de acesso ao novo funcionário.'
            });
            return;
        }

        const dto: FuncionarioAdminRequestDTO = {
            nome: formCriacao.nome,
            email: formCriacao.email,
            senha: formCriacao.senha.trim(),
            matricula: formCriacao.matricula,
            roles: formCriacao.roles
        };

        mutacaoCriarFuncionario.mutate(dto);
    };

    const fecharEdicao = () => {
        setUsuarioIdEmEdicao(null);
        setFormEdicao(null);
    };

    const salvarAlteracoes = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioIdEmEdicao || !formEdicao) return;

        if (abaAtiva === 'clientes') {
            const dtoCliente = CustomerMapper.toClienteAdminRequestDTO(formEdicao);
            mutacaoAtualizarCliente.mutate({ id: usuarioIdEmEdicao, payload: dtoCliente });
        } else {
            const dtoFuncionario = CustomerMapper.toFuncionarioAdminRequestDTO(formEdicao);
            mutacaoAtualizarFuncionario.mutate({ id: usuarioIdEmEdicao, payload: dtoFuncionario });
        }
    };

    const handleAlternarStatus = (id: string, nome: string, ativo: boolean) => {
        const acao = ativo ? 'inativar' : 'reativar';
        const tituloModal = ativo ? 'Inativar Acesso' : 'Reativar Acesso';

        showConfirm({
            title: tituloModal,
            message: `Deseja realmente ${acao} o acesso de: ${nome}?`,
            onConfirm: () => {
                if (abaAtiva === 'clientes') {
                    mutacaoStatusCliente.mutate(id);
                } else {
                    mutacaoStatusFuncionario.mutate(id);
                }
            }
        });
    };

    return {
        abaAtiva,
        termoPesquisa,
        usuarioIdEmEdicao,
        formEdicao,
        clientesFiltrados,
        funcionariosFiltrados,
        exibirFormCriacao,
        formCriacao,
        carregando: carregandoClientes ||
            carregandoFuncionarios ||
            mutacaoAtualizarCliente.isPending ||
            mutacaoAtualizarFuncionario.isPending ||
            mutacaoStatusCliente.isPending ||
            mutacaoStatusFuncionario.isPending ||
            mutacaoCriarFuncionario.isPending,
        erro: erroClientes || erroFuncionarios,
        setAbaAtiva,
        setTermoPesquisa,
        setExibirFormCriacao,
        iniciarEdicaoCliente,
        iniciarEdicaoFuncionario,
        handleMudancaForm,
        handleToggleRoleFuncionario,
        handleMudancaFormCriacao,
        handleToggleRoleCriacao,
        submeterCriacaoFuncionario,
        fecharEdicao,
        salvarAlteracoes,
        handleAlternarStatus
    };
};