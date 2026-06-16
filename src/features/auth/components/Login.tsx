import { Link } from 'react-router-dom';
import { Button, Card, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
import { useLogin } from '../hooks/useLogin';

export const Login = () => {
  const {
    email,
    senha,
    erroValidacao,
    estaCarregando,
    erro,
    setEmail,
    setSenha,
    setErroValidacao,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl bg-white border border-gray-100 rounded-xl">

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Acessar Conta
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-medium max-w-xs mx-auto">
            Insira suas credenciais para acessar o sistema
          </p>
        </div>

        {erroValidacao && (
          <ErrorMessage message={erroValidacao} onRetry={() => setErroValidacao(null)} />
        )}

        {erro && (
          <ErrorMessage message={erro} />
        )}

        <form className="mt-6 sm:mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-xs font-bold text-gray-500 uppercase mb-1">
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
              className="rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-xs font-bold text-gray-500 uppercase mb-1">
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
              className="rounded-xl"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={estaCarregando}
              className="w-full flex justify-center py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-transform bg-blue-600 text-white hover:bg-blue-700"
              variant="primary"
            >
              {estaCarregando ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Autenticando usuário...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 flex flex-col space-y-3">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Ainda não possui uma conta?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Cadastre-se aqui
            </Link>
          </p>
          <div className="pt-0.5">
            <Link to="/" className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors">
              &larr; Voltar para a vitrine
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};