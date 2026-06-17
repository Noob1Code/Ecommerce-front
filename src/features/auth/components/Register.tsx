import { Link } from 'react-router-dom';
import { Button, Card, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
import { useRegister } from '../hooks/useRegister';

export const Register = () => {
  const {
    formulario,
    erroValidacao,
    estaCarregando,
    erro,
    handleChange,
    handleSubmit,
    setErroValidacao,
  } = useRegister();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
      <Card className="w-full max-w-md p-5 sm:p-8 space-y-4 sm:space-y-6 shadow-xl bg-white border border-gray-100 rounded-xl">

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Criar Nova Conta
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-medium max-w-xs mx-auto px-2">
            Cadastre-se para realizar pedidos e acompanhar suas compras
          </p>
        </div>

        {erroValidacao && (
          <div
            className="p-3 text-xs sm:text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl cursor-pointer active:scale-98 transition-transform"
            onClick={() => setErroValidacao(null)}
          >
            {erroValidacao}
          </div>
        )}

        {erro && (
          <ErrorMessage message={erro} />
        )}

        <form className="mt-4 sm:mt-8 space-y-3.5 sm:space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome" className="block text-xs font-bold text-gray-500 uppercase mb-1 px-0.5">
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
              className="rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase mb-1 px-0.5">
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
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="cpf" className="block text-xs font-bold text-gray-500 uppercase mb-1 px-0.5">
                CPF *
              </label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                required
                value={formulario.cpf}
                onChange={handleChange}
                disabled={estaCarregando}
                placeholder="000.000.000-00"
                className="rounded-xl"
                maxLength={14}
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-xs font-bold text-gray-500 uppercase mb-1 px-0.5">
                Telefone *
              </label>
              <Input
                id="telefone"
                name="telefone"
                type="text"
                required
                value={formulario.telefone}
                onChange={handleChange}
                disabled={estaCarregando}
                placeholder="(00) 99999-9999"
                className="rounded-xl"
                maxLength={15}
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-xs font-bold text-gray-500 uppercase mb-1 px-0.5">
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
              className="rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-xs font-bold text-gray-500 uppercase mb-1 px-0.5">
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
              className="rounded-xl"
            />
          </div>

          <div className="pt-1 sm:pt-2">
            <Button
              type="submit"
              disabled={estaCarregando}
              className="w-full flex justify-center py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-transform bg-blue-600 text-white hover:bg-blue-700"
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
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Já possui uma conta ativa?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};