import type { PerfilUsuario } from '../store/useAuthStore';
import { useAuthStore } from '../store/useAuthStore';

export const useAuthorization = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);

  const temQualquerPerfil = (perfisPermitidos: PerfilUsuario[]): boolean => {
    if (!usuario || !usuario.perfis) return false;
    
    return perfisPermitidos.some((perfil) => usuario.perfis.includes(perfil));
  };

  return {
    estaAutenticado,
    usuario,
    temQualquerPerfil,
  };
};