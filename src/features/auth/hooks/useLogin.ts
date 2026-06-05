import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const { mutate: login, isPending, error } = useMutation({
    mutationFn: loginUserApi,
    onSuccess: (result) => {
      // Store both the explicit JWT and normalized domain profile data synchronously
      loginUser(result.token, result.user);
      navigate('/');
    },
  });

  return {
    login,
    isLoading: isPending,
    error: error ? error.message : null,
  };
};