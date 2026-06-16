import { Fragment } from 'react';
import { Button, Card, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
import { useUserManagementController } from '../hooks/useUserManagementController';

export const UserManagement = () => {
    const {
        abaAtiva,
        termoPesquisa,
        usuarioIdEmEdicao,
        formEdicao,
        clientesFiltrados,
        funcionariosFiltrados,
        exibirFormCriacao,
        formCriacao,
        carregando,
        erro,
        setAbaAtiva,
        setTermoPesquisa,
        setExibirFormCriacao,
        iniciarEdicaoCliente,
        iniciarEdicaoFuncionario,
        handleMudancaForm,
        handleToggleRoleFuncionario,
        handleMudancaFormCriacao,
        handleToggleRoleCriacao,
        submeterCriacaoFuncionario,
        fecharEdicao,
        salvarAlteracoes,
        handleAlternarStatus
    } = useUserManagementController();

    if (carregando && clientesFiltrados.length === 0 && funcionariosFiltrados.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center px-4">
                <Spinner className="h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

            <div className="border-b border-gray-200 pb-5 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Gerenciamento de Usuários</h1>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">Auditoria completa, edição de perfis e controle de acesso IAM.</p>
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                    {abaAtiva === 'funcionarios' && (
                        <Button
                            type="button"
                            variant={exibirFormCriacao ? 'secondary' : 'primary'}
                            onClick={() => setExibirFormCriacao(!exibirFormCriacao)}
                            className={`w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase rounded-xl shadow-xs transition-colors ${!exibirFormCriacao ? 'bg-green-600 text-white hover:bg-green-700 border-none' : ''}`}
                        >
                            {exibirFormCriacao ? 'Fechar Cadastro' : 'Novo Funcionário'}
                        </Button>
                    )}

                    <div className="border-l border-gray-200 h-6 mx-1 hidden sm:block"></div>

                    <button
                        type="button"
                        onClick={() => { setAbaAtiva('clientes'); setTermoPesquisa(''); fecharEdicao(); setExibirFormCriacao(false); }}
                        className={`flex-1 sm:flex-none text-center px-4 py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${abaAtiva === 'clientes' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Clientes
                    </button>
                    <button
                        type="button"
                        onClick={() => { setAbaAtiva('funcionarios'); setTermoPesquisa(''); fecharEdicao(); }}
                        className={`flex-1 sm:flex-none text-center px-4 py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${abaAtiva === 'funcionarios' ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Funcionários
                    </button>
                </div>
            </div>

            {abaAtiva === 'funcionarios' && exibirFormCriacao && (
                <Card className="p-4 sm:p-6 border border-green-200 bg-green-50/5 rounded-xl mb-8 max-w-3xl animate-in fade-in zoom-in-95 duration-150 shadow-xs">
                    <form onSubmit={submeterCriacaoFuncionario} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 border-b border-gray-200 pb-2 mb-1">
                            <h3 className="text-xs sm:text-sm font-black text-green-700 uppercase tracking-wide">Contratar / Registrar Novo Funcionário</h3>
                        </div>

                        <div>
                            <label htmlFor="create-name" className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nome Completo *</label>
                            <Input id="create-name" type="text" value={formCriacao.nome} onChange={(e) => handleMudancaFormCriacao('nome', e.target.value)} placeholder="Ex: João Silva" required className="w-full text-xs rounded-xl" />
                        </div>

                        <div>
                            <label htmlFor="create-email" className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">E-mail Corporativo *</label>
                            <Input id="create-email" type="email" value={formCriacao.email} onChange={(e) => handleMudancaFormCriacao('email', e.target.value)} placeholder="joao@empresa.com" required className="w-full text-xs rounded-xl" />
                        </div>

                        <div>
                            <label htmlFor="create-matricula" className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Matrícula Funcional *</label>
                            <Input id="create-matricula" type="text" value={formCriacao.matricula} onChange={(e) => handleMudancaFormCriacao('matricula', e.target.value)} placeholder="M-90821" required className="w-full text-xs rounded-xl" />
                        </div>

                        <div>
                            <label htmlFor="create-password" className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Senha de Acesso Inicial *</label>
                            <Input id="create-password" type="password" value={formCriacao.senha} onChange={(e) => handleMudancaFormCriacao('senha', e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="w-full text-xs rounded-xl" />
                        </div>

                        <div className="sm:col-span-2 p-4 bg-white border border-gray-200 rounded-xl space-y-2.5 shadow-2xs">
                            <span className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider">Atribuir Nível de Autoridade IAM *</span>
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
                                {['ROLE_ADMIN', 'ROLE_ESTOQUE', 'ROLE_FATURAMENTO'].map((role) => (
                                    <label key={role} className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg border sm:border-none border-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={formCriacao.roles.includes(role)}
                                            onChange={() => handleToggleRoleCriacao(role)}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                        />
                                        <span>
                                            {role === 'ROLE_ADMIN' && 'Administrador Geral'}
                                            {role === 'ROLE_ESTOQUE' && 'Operador de Estoque'}
                                            {role === 'ROLE_FATURAMENTO' && 'Módulo Financeiro'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 border-t pt-4 border-gray-150">
                            <Button type="button" variant="secondary" onClick={() => setExibirFormCriacao(false)} className="text-xs py-2 px-4 rounded-xl">Cancelar</Button>
                            <Button type="submit" className="text-xs py-2 bg-green-600 text-white hover:bg-green-700 font-bold px-5 rounded-xl shadow-sm border-none">Salvar Contratação</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="mb-6 max-w-md w-full">
                <label htmlFor="user-search" className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">Localizar Usuário Rapidamente</label>
                <Input
                    id="user-search"
                    type="text"
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    placeholder={`Buscar por nome, e-mail ou documento...`}
                    className="w-full text-sm py-2.5 rounded-xl"
                />
            </div>

            {erro && <ErrorMessage message="Erro de barramento ao tentar sincronizar contas com o Spring Boot." />}

            <Card className="overflow-hidden border border-gray-200 bg-white shadow-xs rounded-xl">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[950px] w-full divide-y text-sm text-left table-fixed">
                        <colgroup>
                            <col className="w-[20%]" />
                            <col className="w-[25%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                            <col className="w-[12%]" />
                            <col className="w-[13%]" />
                        </colgroup>
                        <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5">Nome / Identificação</th>
                                <th className="px-6 py-3.5">E-mail</th>
                                <th className="px-6 py-3.5">{abaAtiva === 'clientes' ? 'CPF' : 'Matrícula'}</th>
                                <th className="px-6 py-3.5">{abaAtiva === 'clientes' ? 'Telefone' : 'Perfis (Roles)'}</th>
                                <th className="px-6 py-3.5 text-center">Status</th>
                                <th className="px-6 py-3.5 text-right pr-8">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">

                            {abaAtiva === 'clientes' && clientesFiltrados.map((cliente) => {
                                const emEdicao = usuarioIdEmEdicao === cliente.id;
                                return (
                                    <Fragment key={cliente.id}>
                                        <tr className={`hover:bg-gray-50/50 transition-colors ${!cliente.ativo ? 'bg-red-50/10' : ''}`}>
                                            <td className="px-6 py-4 font-bold text-gray-900 truncate">{cliente.nome}</td>
                                            <td className="px-6 py-4 font-mono text-xs truncate">{cliente.email}</td>
                                            <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">{cliente.cpf || 'Não Informado'}</td>
                                            <td className="px-6 py-4 text-xs whitespace-nowrap">{cliente.telefone || 'Não Informado'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${cliente.ativo ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                                    {cliente.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-8">
                                                <div className="flex justify-end gap-3.5">
                                                    <button type="button" onClick={() => emEdicao ? fecharEdicao() : iniciarEdicaoCliente(cliente)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors active:scale-95">
                                                        {emEdicao ? 'Fechar' : 'Editar'}
                                                    </button>
                                                    <button type="button" onClick={() => handleAlternarStatus(cliente.id, cliente.nome, cliente.ativo)} className={`text-xs font-bold transition-colors active:scale-95 ${cliente.ativo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}>
                                                        {cliente.ativo ? 'Inativar' : 'Reativar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {emEdicao && formEdicao && (
                                            <tr className="bg-blue-50/10">
                                                <td colSpan={6} className="px-6 py-5 border-t border-b border-blue-100">
                                                    <form onSubmit={salvarAlteracoes} className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-100">
                                                        <div className="sm:col-span-2"><h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Alterar Dados do Cliente</h4></div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nome Completo</label>
                                                            <Input type="text" value={formEdicao.nome} onChange={(e) => handleMudancaForm('nome', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">E-mail</label>
                                                            <Input type="email" value={formEdicao.email} onChange={(e) => handleMudancaForm('email', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Documento (CPF)</label>
                                                            <Input type="text" value={formEdicao.documento} onChange={(e) => handleMudancaForm('documento', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Telefone</label>
                                                            <Input type="text" value={formEdicao.telefone} onChange={(e) => handleMudancaForm('telefone', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nova Senha de Acesso (Deixe em branco para não alterar)</label>
                                                            <Input type="password" value={formEdicao.senha || ''} onChange={(e) => handleMudancaForm('senha', e.target.value)} placeholder="••••••••" className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                                                            <Button type="button" variant="secondary" onClick={fecharEdicao} className="text-xs py-2 px-4 rounded-xl">Cancelar</Button>
                                                            <Button type="submit" variant="primary" className="text-xs py-2 px-5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl border-none font-bold shadow-sm">Salvar Alterações</Button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}

                            {abaAtiva === 'funcionarios' && funcionariosFiltrados.map((func) => {
                                const emEdicao = usuarioIdEmEdicao === func.id;
                                return (
                                    <Fragment key={func.id}>
                                        <tr className={`hover:bg-gray-50/50 transition-colors ${!func.ativo ? 'bg-red-50/10' : ''}`}>
                                            <td className="px-6 py-4 font-bold text-gray-900 truncate">{func.nome}</td>
                                            <td className="px-6 py-4 font-mono text-xs truncate">{func.email}</td>
                                            <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">{func.matricula || 'Não Informada'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                    {func.roles?.map((role) => (
                                                        <span key={role} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${role === 'ROLE_ADMIN' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                                            {role.replace('ROLE_', '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${func.ativo ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                                    {func.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-8">
                                                <div className="flex justify-end gap-3.5">
                                                    <button type="button" onClick={() => emEdicao ? fecharEdicao() : iniciarEdicaoFuncionario(func)} className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors active:scale-95">
                                                        {emEdicao ? 'Fechar' : 'Editar'}
                                                    </button>
                                                    <button type="button" onClick={() => handleAlternarStatus(func.id, func.nome, func.ativo)} className={`text-xs font-bold transition-colors active:scale-95 ${func.ativo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}>
                                                        {func.ativo ? 'Inativar' : 'Reativar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {emEdicao && formEdicao && (
                                            <tr className="bg-purple-50/10">
                                                <td colSpan={6} className="px-6 py-5 border-t border-b border-purple-100">
                                                    <form onSubmit={salvarAlteracoes} className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-100">
                                                        <div className="sm:col-span-2"><h4 className="text-xs font-black uppercase text-purple-700 tracking-wider">Alterar Dados e Permissões do Funcionário</h4></div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nome Completo</label>
                                                            <Input type="text" value={formEdicao.nome} onChange={(e) => handleMudancaForm('nome', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">E-mail</label>
                                                            <Input type="email" value={formEdicao.email} onChange={(e) => handleMudancaForm('email', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Matrícula</label>
                                                            <Input type="text" value={formEdicao.documento} onChange={(e) => handleMudancaForm('documento', e.target.value)} required className="w-full text-xs rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nova Senha (Deixe em branco para manter a atual)</label>
                                                            <Input type="password" value={formEdicao.senha || ''} onChange={(e) => handleMudancaForm('senha', e.target.value)} placeholder="••••••••" className="w-full text-xs rounded-xl" />
                                                        </div>

                                                        <div className="sm:col-span-2 p-4 bg-white border border-gray-200 rounded-xl space-y-2 shadow-2xs">
                                                            <span className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider">Atribuição de Papéis Administrativos</span>
                                                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
                                                                {['ROLE_ADMIN', 'ROLE_ESTOQUE', 'ROLE_FATURAMENTO'].map((papel) => (
                                                                    <label key={papel} className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg border sm:border-none border-gray-100">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={formEdicao.roles?.includes(papel)}
                                                                            onChange={() => handleToggleRoleFuncionario(papel)}
                                                                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                                        />
                                                                        <span>
                                                                            {papel === 'ROLE_ADMIN' && 'Administrador Geral'}
                                                                            {papel === 'ROLE_ESTOQUE' && 'Operador de Estoque'}
                                                                            {papel === 'ROLE_FATURAMENTO' && 'Módulo Financeiro'}
                                                                        </span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                                                            <Button type="button" variant="secondary" onClick={fecharEdicao} className="text-xs py-2 px-4 rounded-xl">Cancelar</Button>
                                                            <Button type="submit" variant="primary" className="text-xs py-2 px-5 bg-purple-600 text-white hover:bg-purple-700 rounded-xl border-none font-bold shadow-sm">Salvar Cadastro</Button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}

                            {abaAtiva === 'clientes' && clientesFiltrados.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 font-medium text-gray-400 bg-gray-50/50 rounded-b-xl">Nenhum cliente atende aos critérios da busca.</td></tr>
                            )}
                            {abaAtiva === 'funcionarios' && funcionariosFiltrados.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 font-medium text-gray-400 bg-gray-50/50 rounded-b-xl">Nenhum funcionário encontrado com estes dados.</td></tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};