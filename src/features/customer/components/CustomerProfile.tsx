import { Button, Card, Input } from '../../../shared/components/ui';
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
    mensagemSucesso,
    mensagemErro,
    setNome,
    setEmail,
    setTelefone,
    setCpf,
    setMatricula,
    setSenha,
    handleSalvarAlteracoes,
    handleCancelar
  } = useCustomerProfileController();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Dados Cadastrais</h1>
        <p className="mt-2 text-sm text-gray-500">
          {ehCliente
            ? 'Gerencie suas informações pessoais de cliente e contato.'
            : 'Gerencie suas informações e credenciais de acesso corporativo.'}
        </p>
      </div>

      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        {mensagemSucesso && (
          <div className="mb-4 p-4 text-sm font-semibold bg-green-50 border border-green-200 text-green-700 rounded-xl">
            {mensagemSucesso}
          </div>
        )}

        {mensagemErro && (
          <div className="mb-4 p-4 text-sm font-semibold bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {mensagemErro}
          </div>
        )}

        <form onSubmit={handleSalvarAlteracoes} className="space-y-5">
          {/* BLOCO COMUM: Nome e E-mail aparecem para todos os tipos de perfis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome Completo *</label>
              <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome completo" disabled={estaCarregando} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail de Acesso *</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seuemail@provedor.com" disabled={estaCarregando} />
            </div>
          </div>

          {/* RENDEREZALÇÃO DINÂMICA: Exibe os inputs baseados nas permissões e regras da Role */}
          {ehCliente ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div>
                <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700 mb-1.5">CPF do Titular *</label>
                <Input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required disabled={estaCarregando} />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone de Contato *</label>
                <Input id="telefone" type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 99999-9999" required disabled={estaCarregando} />
              </div>
            </div>
          ) : (
            /* Campos Exclusivos do Perfil de FUNCIONÁRIO / STAFF */
            <div className="grid grid-cols-1 gap-4 martial-in fade-in duration-200">
              <div className="max-w-md">
                <label htmlFor="matricula" className="block text-sm font-semibold text-gray-700 mb-1.5">Matrícula Funcional *</label>
                <Input id="matricula" type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ex: MAT-2026-9912" required disabled={estaCarregando} />
              </div>
            </div>
          )}

          {/* CAMPO DE SENHA: Exibido para todos os perfis, mas com texto explicativo de alteração opcional */}
          <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4">
            <div className="max-w-md">
              <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-1">Alterar Senha de Acesso</label>
              <p className="text-[11px] text-gray-400 mb-1.5">Deixe em branco caso queira manter a sua senha atual do sistema.</p>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Nova senha (mínimo 6 caracteres)"
                disabled={estaCarregando}
              />
            </div>
          </div>

          {/* Painel de Controle de Ações do Formulário */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={handleCancelar} disabled={estaCarregando} className="px-4 py-2">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={estaCarregando} className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white">
              {estaCarregando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};