import type {
    ClienteAdminRequestDTO,
    DadosAtualizacaoPerfil,
    FuncionarioAdminRequestDTO,
    UserFormState
} from './customer.types';

export const CustomerMapper = {

    toFuncionarioUpdatePayload(dados: DadosAtualizacaoPerfil) {
        return {
            nome: dados.nome,
            email: dados.email,
            matricula: dados.matricula || '',
            roles: dados.perfis || [],
            senha: dados.senha?.trim() ? dados.senha.trim() : undefined
        };
    },

    toClienteUpdatePayload(dados: DadosAtualizacaoPerfil) {
        return {
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone || '',
            cpf: dados.cpf || '',
            senha: dados.senha?.trim() ? dados.senha.trim() : undefined
        };
    },

    toClienteAdminRequestDTO(form: UserFormState): ClienteAdminRequestDTO {
        return {
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
            cpf: form.documento,
            senha: form.senha?.trim() ? form.senha.trim() : undefined
        };
    },

    toFuncionarioAdminRequestDTO(form: UserFormState): FuncionarioAdminRequestDTO {
        return {
            nome: form.nome,
            email: form.email,
            matricula: form.documento,
            roles: form.roles || [],
            senha: form.senha?.trim() ? form.senha.trim() : undefined
        };
    }
};