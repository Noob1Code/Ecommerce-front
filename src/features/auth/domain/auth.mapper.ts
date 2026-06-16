import type { PerfilUsuario, UsuarioAutenticado } from '../store/useAuthStore';
import type {
    ClienteRequestDTO,
    EntradaCadastroCliente,
    EntradaCadastroFuncionario,
    EntradaLogin,
    FuncionarioRequestDTO,
    FuncionarioResponseDTO,
    LoginRequestDTO,
    ResultadoAutenticacao,
    TokenResponseDTO
} from './auth.types';

export const AuthMapper = {
    
    toClienteRequestDTO(entrada: EntradaCadastroCliente): ClienteRequestDTO {
        return {
            nome: entrada.nome,
            email: entrada.email,
            senha: entrada.senha,
            telefone: entrada.telefone || '',
            cpf: entrada.cpf || '',
        };
    },

    toFuncionarioRequestDTO(entrada: EntradaCadastroFuncionario): FuncionarioRequestDTO {
        return {
            nome: entrada.nome,
            email: entrada.email,
            senha: entrada.senha,
            matricula: entrada.matricula,
            roles: entrada.perfis,
        };
    },

    toLoginRequestDTO(entrada: EntradaLogin): LoginRequestDTO {
        return {
            username: entrada.email,
            password: entrada.senha,
        };
    },

    toUsuarioAutenticadoFromFuncionario(dto: FuncionarioResponseDTO): UsuarioAutenticado {
        return {
            id: dto.id,
            nome: dto.nome,
            email: dto.email,
            perfis: dto.roles as PerfilUsuario[],
            matricula: dto.matricula,
        };
    },

    toResultadoAutenticacao(dto: TokenResponseDTO, emailFallback: string): ResultadoAutenticacao {
        return {
            token: dto.token,
            usuario: {
                id: dto.id,
                nome: dto.nome,
                email: emailFallback,
                perfis: dto.roles as PerfilUsuario[],
            },
        };
    }
};