import type { PerfilUsuario, UsuarioAutenticado } from '../store/useAuthStore';

export interface ClienteRequestDTO {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    cpf: string;
}

export interface ClienteResponseDTO {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    ativo: boolean;
    roles: string[];
    cpf: string;
}

export interface FuncionarioRequestDTO {
    nome: string;
    email: string;
    senha: string;
    matricula: string;
    roles: string[];
}

export interface FuncionarioResponseDTO {
    id: string;
    nome: string;
    email: string;
    ativo: boolean;
    roles: string[];
    matricula: string;
}

export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface TokenResponseDTO {
    token: string;
    id: string;
    nome: string;
    roles: string[];
}

export interface EntradaCadastroCliente {
    nome: string;
    email: string;
    senha: string;
    cpf?: string;
    telefone?: string;
}

export interface EntradaCadastroFuncionario {
    nome: string;
    email: string;
    senha: string;
    matricula: string;
    perfis: PerfilUsuario[];
}

export interface EntradaLogin {
    email: string;
    senha: string;
}

export interface ResultadoAutenticacao {
    token: string;
    usuario: UsuarioAutenticado;
}