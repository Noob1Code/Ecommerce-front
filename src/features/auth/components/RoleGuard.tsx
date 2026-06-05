import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import type { UserRole } from '../store/useAuthStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  fallback = null 
}: RoleGuardProps) => {
  const { hasAnyRole, isAuthenticated } = useAuthorization();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const isAuthorized = hasAnyRole(allowedRoles);

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};