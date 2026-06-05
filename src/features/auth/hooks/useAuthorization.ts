import { useAuthStore, type UserRole } from '../store/useAuthStore';

export const useAuthorization = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasRole = (role: UserRole): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.roles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return roles.some((role) => user.roles.includes(role));
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return roles.every((role) => user.roles.includes(role));
  };

  // Pre-computed security shortcuts derived cleanly from the application state
  const isAdmin = hasRole('ROLE_ADMIN');
  const isCustomer = hasRole('ROLE_CLIENTE');
  
  // Salesperson / Operations role group (Handles stock, billing, and order fulfillment)
  const isOperationalStaff = hasAnyRole([
    'ROLE_ADMIN', 
    'ROLE_ESTOQUE', 
    'ROLE_ENTREGA', 
    'ROLE_FATURAMENTO'
  ]);

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isCustomer,
    isOperationalStaff,
  };
};