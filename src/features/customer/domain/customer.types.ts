export interface PerfilExibicao {
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    matricula?: string;
}

export interface DadosAtualizacaoPerfil {
    nome: string;
    email: string;
    senha?: string;
    matricula?: string;
    perfis?: string[];
    telefone?: string;
    cpf?: string;
}

export interface UserFormState {
    nome: string;
    email: string;
    documento: string;
    telefone: string;
    senha?: string;
    roles?: string[];
}

export interface BackendPedidoClienteExibicaoDTO {
    id: string;
    nome: string;
    cpf: string;
}

export interface BackendPedidoVariacaoExibicaoDTO {
    id: string;
    nomeProduto: string;
    sku: string;
    detalhes: string;
}

export interface BackendItemPedidoDetalhadoResponseDTO {
    id: string;
    variacao: BackendPedidoVariacaoExibicaoDTO;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface BackendPedidoDetalhadoResponseDTO {
    id: string;
    cliente: BackendPedidoClienteExibicaoDTO;
    status: string;
    valorTotal: number;
    criadoEm: string;
    itens: BackendItemPedidoDetalhadoResponseDTO[];
}

export interface ClienteAdminRequestDTO {
    nome: string;
    email: string;
    telefone: string;
    senha?: string;
    cpf: string;
}

export interface FuncionarioAdminRequestDTO {
    nome: string;
    email: string;
    senha?: string;
    matricula: string;
    roles: string[];
}