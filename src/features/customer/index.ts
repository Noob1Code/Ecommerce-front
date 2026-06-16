// Componentes de Tela (Views consumidas pelas Rotas Globais)
export { CustomerOrders } from './components/CustomerOrders';
export { CustomerProfile } from './components/CustomerProfile';
export { UserManagement } from './components/UserManagement';
// Ganchos Controladores Reativos (Se necessários externamente)
export { useCustomerOrdersController } from './hooks/useCustomerOrdersController';
export { useCustomerProfileController } from './hooks/useCustomerProfileController';
export { useUserManagementController } from './hooks/useUserManagementController';
// Modelos e Tipos de Domínio compartilhados com outras Features (Ex: Checkout)
export type {
    BackendPedidoDetalhadoResponseDTO, DadosAtualizacaoPerfil, PerfilExibicao
} from './domain/customer.types';
