import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { Button, Input, Card, Spinner, ErrorMessage } from '../../../shared/components/ui';

export const Register = () => {
  const { registrarCliente, estaCarregando, erro } = useRegister();

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    telefone: '',
  });

  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErroValidacao(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formulario.nome || !formulario.email || !formulario.senha) {
      setErroValidacao('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formulario.senha !== formulario.confirmarSenha) {
      setErroValidacao('As senhas informadas não coincidem.');
      return;
    }

    if (formulario.senha.length < 6) {
      setErroValidacao('A senha provisória deve conter no mínimo 6 caracteres.');
      return;
    }

    registrarCliente({
      nome: formulario.nome,
      email: formulario.email,
      senha: formulario.senha,
      cpf: formulario.cpf || undefined,
      telefone: formulario.telefone || undefined,
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl bg-white border border-gray-100 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Criar Nova Conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Cadastre-se para realizar pedidos e acompanhar suas compras
          </p>
        </div>

        {erroValidacao && (
          <div className="p-3 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {erroValidacao}
          </div>
        )}

        {erro && (
          <ErrorMessage message={erro} />
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <Input
              id="nome"
              name="nome"
              type="text"
              required
              value={formulario.nome}
              onChange={handleChange}
              disabled={estaCarregando}
              placeholder="Ex: João Silva da Costa"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de E-mail *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formulario.email}
              onChange={handleChange}
              disabled={estaCarregando}
              placeholder="exemplo@provedor.com"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF (Opcional)
              </label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                value={formulario.cpf}
                onChange={handleChange}
                disabled={estaCarregando}
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (Opcional)
              </label>
              <Input
                id="telefone"
                name="telefone"
                type="text"
                value={formulario.telefone}
                onChange={handleChange}
                disabled={estaCarregando}
                placeholder="(00) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <Input
              id="senha"
              name="senha"
              type="password"
              required
              value={formulario.senha}
              onChange={handleChange}
              disabled={estaCarregando}
              placeholder="No mínimo 6 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha *
            </label>
            <Input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              required
              value={formulario.confirmarSenha}
              onChange={handleChange}
              disabled={estaCarregando}
              placeholder="Repita a sua senha"
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
                  <span>Criando conta cadastral...</span>
                </div>
              ) : (
                'Finalizar Cadastro'
              )}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Já possui uma conta ativa?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};