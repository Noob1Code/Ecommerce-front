import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import type { PerfilUsuario } from '../store/useAuthStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: PerfilUsuario[];
  fallback?: React.ReactNode;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  fallback = null 
}: RoleGuardProps) => {
  const { temQualquerPerfil, estaAutenticado } = useAuthorization();

  if (!estaAutenticado) {
    return <>{fallback}</>;
  }

  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const ehAutorizado = temQualquerPerfil(allowedRoles);

  if (!ehAutorizado) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};