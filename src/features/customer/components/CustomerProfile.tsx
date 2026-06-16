import { Button, Card, Input, Spinner } from '../../../shared/components/ui';
import { useCustomerProfileController } from '../hooks/useCustomerProfileController';

export const CustomerProfile = () => {
  const {
    nome,
    email,
    telefone,
    cpf,
    matricula,
    senha,
    ehCliente,
    estaCarregando,
    setNome,
    setEmail,
    setTelefone,
    setCpf,
    setMatricula,
    setSenha,
    handleSalvarAlteracoes,
    handleCancelar,
    handleBackToCatalog
  } = useCustomerProfileController();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <button
          type="button"
          onClick={handleBackToCatalog}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center space-x-1 active:scale-95 transition-transform mb-2"
        >
          &larr; Voltar para o Catálogo
        </button>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
          Meus Dados Cadastrais
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
          {ehCliente
            ? 'Gerencie suas informações pessoais de cliente e contato.'
            : 'Gerencie suas informações e credenciais de acesso corporativo.'}
        </p>
      </div>

      <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <form onSubmit={handleSalvarAlteracoes} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Nome Completo *
              </label>
              <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome completo" disabled={estaCarregando} className="rounded-xl" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                E-mail de Acesso *
              </label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seuemail@provedor.com" disabled={estaCarregando} className="rounded-xl" />
            </div>
          </div>

          {ehCliente ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div>
                <label htmlFor="cpf" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  CPF do Titular *
                </label>
                <Input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required disabled={estaCarregando} className="rounded-xl" maxLength={14} />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Telefone de Contato *
                </label>
                <Input id="telefone" type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 99999-9999" required disabled={estaCarregando} className="rounded-xl" maxLength={15} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-200">
              <div className="w-full sm:max-w-md">
                <label htmlFor="matricula" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Matrícula Funcional *
                </label>
                <Input id="matricula" type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ex: MAT-2026-9912" required disabled={estaCarregando} className="rounded-xl" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4">
            <div className="w-full sm:max-w-md">
              <label htmlFor="senha" className="block text-xs font-bold text-gray-500 uppercase mb-0.5">
                Alterar Senha de Acesso
              </label>
              <p className="text-[11px] text-gray-400 mb-1.5 normal-case">
                Deixe em branco caso queira manter a sua senha atual do sistema.
              </p>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Nova senha (mínimo 6 caracteres)"
                disabled={estaCarregando}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-3 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelar}
              disabled={estaCarregando}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={estaCarregando}
              className="w-full sm:w-auto px-5 py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl active:scale-95 transition-transform flex justify-center items-center border-none"
            >
              {estaCarregando ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Salvando...</span>
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
};