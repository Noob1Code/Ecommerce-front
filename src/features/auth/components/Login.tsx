import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { Button, Input, Card, Spinner, ErrorMessage } from '../../../shared/components/ui';

export const Login = () => {
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!email || !password) {
      setValidationError('Please populate all mandatory authentication fields.');
      return;
    }

    login({ email, password });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl bg-white border border-gray-100 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your secure e-commerce application account
          </p>
        </div>

        {validationError && (
          <ErrorMessage message={validationError} onRetry={() => setValidationError(null)} />
        )}

        {error && (
          <ErrorMessage message={error} />
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
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
                setValidationError(null);
              }}
              disabled={isLoading}
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError(null);
              }}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 text-sm font-semibold uppercase tracking-wider"
              variant="primary"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 flex flex-col space-y-2">
          <p className="text-sm text-gray-600">
            Don't possess an account yet?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Create Account
            </Link>
          </p>
          <div>
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              &larr; Return to store catalog
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};