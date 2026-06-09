import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { Button, Input, Card, Spinner, ErrorMessage } from '../../../shared/components/ui';

export const Login = () => {
  const { login, estaCarregando, erro } = useLogin();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroValidacao(null);

    if (!email || !senha) {
      setErroValidacao('Por favor, preencha todos os campos obrigatórios de autenticação.');
      return;
    }

    login({ email, senha });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl bg-white border border-gray-100 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Acessar Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Insira suas credenciais para acessar o sistema
          </p>
        </div>

        {erroValidacao && (
          <ErrorMessage message={erroValidacao} onRetry={() => setErroValidacao(null)} />
        )}

        {erro && (
          <ErrorMessage message={erro} />
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de E-mail *
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErroValidacao(null);
              }}
              disabled={estaCarregando}
              placeholder="seu.nome@provedor.com"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha de Acesso *
            </label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErroValidacao(null);
              }}
              disabled={estaCarregando}
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={estaCarregando}
              className="w-full flex justify-center py-3 text-sm font-semibold uppercase tracking-wider"
              variant="primary"
            >
              {estaCarregando ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Autenticando usuário...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 flex flex-col space-y-2">
          <p className="text-sm text-gray-600">
            Ainda não possui uma conta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Cadastre-se aqui
            </Link>
          </p>
          <div>
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              &larr; Voltar para a vitrine do catálogo
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};