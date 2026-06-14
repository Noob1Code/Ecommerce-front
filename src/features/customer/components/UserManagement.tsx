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
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner className="h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

            {/* Cabeçalho */}
            <div className="border-b border-gray-200 pb-5 mb-6 sm:flex sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gerenciamento de Usuários</h1>
                    <p className="mt-2 text-sm text-gray-500">Auditoria completa, edição de perfis e controle de acesso IAM.</p>
                </div>

                {/* Ações e Alternador de Abas */}
                <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 items-center">
                    {abaAtiva === 'funcionarios' && (
                        <Button
                            type="button"
                            variant={exibirFormCriacao ? 'secondary' : 'primary'}
                            onClick={() => setExibirFormCriacao(!exibirFormCriacao)}
                            className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl shadow-xs ${!exibirFormCriacao ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                        >
                            {exibirFormCriacao ? 'Fechar Cadastro' : 'Novo Funcionário'}
                        </Button>
                    )}

                    <div className="border-l border-gray-200 h-6 mx-1 hidden sm:block"></div>

                    <button
                        type="button"
                        onClick={() => { setAbaAtiva('clientes'); setTermoPesquisa(''); fecharEdicao(); setExibirFormCriacao(false); }}
                        className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${abaAtiva === 'clientes' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Clientes Cadastrados
                    </button>
                    <button
                        type="button"
                        onClick={() => { setAbaAtiva('funcionarios'); setTermoPesquisa(''); fecharEdicao(); }}
                        className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${abaAtiva === 'funcionarios' ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Corpo de Funcionários
                    </button>
                </div>
            </div>

            {/* PAINEL INLINE: Formulário de Criação de Funcionário */}
            {abaAtiva === 'funcionarios' && exibirFormCriacao && (
                <Card className="p-6 border border-green-200 bg-green-50/5 rounded-xl mb-8 max-w-3xl animate-in fade-in zoom-in-95 duration-150">
                    <form onSubmit={submeterCriacaoFuncionario} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 border-b border-gray-200 pb-2 mb-1">
                            <h3 className="text-sm font-black text-green-700 uppercase tracking-wide">Contratar / Registrar Novo Funcionário</h3>
                        </div>

                        <div>
                            <label htmlFor="create-name" className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nome Completo *</label>
                            <Input id="create-name" type="text" value={formCriacao.nome} onChange={(e) => handleMudancaFormCriacao('nome', e.target.value)} placeholder="Ex: João Silva" required className="w-full text-xs" />
                        </div>

                        <div>
                            <label htmlFor="create-email" className="block text-[10px] font-bold uppercase text-gray-400 mb-1">E-mail Corporativo *</label>
                            <Input id="create-email" type="email" value={formCriacao.email} onChange={(e) => handleMudancaFormCriacao('email', e.target.value)} placeholder="joao@empresa.com" required className="w-full text-xs" />
                        </div>

                        <div>
                            <label htmlFor="create-matricula" className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Matrícula Funcional *</label>
                            <Input id="create-matricula" type="text" value={formCriacao.matricula} onChange={(e) => handleMudancaFormCriacao('matricula', e.target.value)} placeholder="M-90821" required className="w-full text-xs" />
                        </div>

                        <div>
                            <label htmlFor="create-password" className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Senha de Acesso Inicial *</label>
                            <Input id="create-password" type="password" value={formCriacao.senha} onChange={(e) => handleMudancaFormCriacao('senha', e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="w-full text-xs" />
                        </div>

                        {/* Alinhado: Removido ROLE_ENTREGA conforme solicitado */}
                        <div className="sm:col-span-2 p-3.5 bg-white border border-gray-200 rounded-xl space-y-2 shadow-2xs">
                            <span className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider">Atribuir Nível de Autoridade IAM *</span>
                            <div className="flex flex-wrap gap-6">
                                {['ROLE_ADMIN', 'ROLE_ESTOQUE', 'ROLE_FATURAMENTO'].map((role) => (
                                    <label key={role} className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
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
                            <Button type="button" variant="secondary" onClick={() => setExibirFormCriacao(false)} className="text-xs py-1.5">Cancelar</Button>
                            <Button type="submit" className="text-xs py-1.5 bg-green-600 text-white hover:bg-green-700 font-bold px-4 shadow-sm">Salvar Contratação</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Caixa de Pesquisa Unificada */}
            <div className="mb-6 max-w-md">
                <label htmlFor="user-search" className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Localizar Usuário Rapidamente</label>
                <Input
                    id="user-search"
                    type="text"
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    placeholder={`Buscar por nome, e-mail ou documento do ${abaAtiva === 'clientes' ? 'cliente' : 'funcionário'}...`}
                    className="w-full text-sm py-2.5"
                />
            </div>

            {erro && <ErrorMessage message="Erro de barramento ao tentar sincronizar contas com o Spring Boot." />}

            {/* Tabela Principal */}
            <Card className="overflow-hidden border border-gray-200 bg-white shadow-xs rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y text-sm text-left">
                        <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5">Nome / Identificação</th>
                                <th className="px-6 py-3.5">E-mail</th>
                                <th className="px-6 py-3.5">{abaAtiva === 'clientes' ? 'CPF' : 'Matrícula'}</th>
                                {abaAtiva === 'clientes' && <th className="px-6 py-3.5">Telefone</th>}
                                {abaAtiva === 'funcionarios' && <th className="px-6 py-3.5">Perfis (Roles)</th>}
                                <th className="px-6 py-3.5 text-center">Status</th>
                                <th className="px-6 py-3.5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">

                            {/* RENDERIZAÇÃO DA ABA DE CLIENTES */}
                            {abaAtiva === 'clientes' && clientesFiltrados.map((cliente) => {
                                const emEdicao = usuarioIdEmEdicao === cliente.id;
                                return (
                                    <Fragment key={cliente.id}>
                                        <tr className={`hover:bg-gray-50/50 ${!cliente.ativo ? 'bg-red-50/5' : ''}`}>
                                            <td className="px-6 py-4 font-bold text-gray-900">{cliente.nome}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{cliente.email}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{cliente.cpf || 'Não Informado'}</td>
                                            <td className="px-6 py-4 text-xs">{cliente.telefone || 'Não Informado'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${cliente.ativo ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                                    {cliente.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => emEdicao ? fecharEdicao() : iniciarEdicaoCliente(cliente)} className="text-xs font-bold text-blue-600 hover:underline">
                                                        {emEdicao ? 'Fechar' : 'Editar'}
                                                    </button>
                                                    <button type="button" onClick={() => handleAlternarStatus(cliente.id, cliente.nome, cliente.ativo)} className={`text-xs font-bold hover:underline ${cliente.ativo ? 'text-red-600' : 'text-green-600'}`}>
                                                        {cliente.ativo ? 'Inativar' : 'Reativar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Formulário de Edição Expandido para Cliente */}
                                        {emEdicao && formEdicao && (
                                            <tr>
                                                <td colSpan={6} className="bg-blue-50/20 px-6 py-4 border-t border-b border-blue-100">
                                                    <form onSubmit={salvarAlteracoes} className="max-w-2xl grid grid-cols-2 gap-4 animate-in fade-in duration-100">
                                                        <div className="col-span-2"><h4 className="text-xs font-black uppercase text-blue-600">Alterar Dados do Cliente</h4></div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nome Completo</label>
                                                            <Input type="text" value={formEdicao.nome} onChange={(e) => handleMudancaForm('nome', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">E-mail</label>
                                                            <Input type="email" value={formEdicao.email} onChange={(e) => handleMudancaForm('email', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Documento (CPF)</label>
                                                            <Input type="text" value={formEdicao.documento} onChange={(e) => handleMudancaForm('documento', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telefone</label>
                                                            <Input type="text" value={formEdicao.telefone} onChange={(e) => handleMudancaForm('telefone', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nova Senha de Acesso (Deixe em branco para não alterar)</label>
                                                            <Input type="password" value={formEdicao.senha} onChange={(e) => handleMudancaForm('senha', e.target.value)} placeholder="••••••••" className="w-full text-xs" />
                                                        </div>
                                                        <div className="col-span-2 flex justify-end gap-2 pt-2">
                                                            <Button type="button" variant="secondary" onClick={fecharEdicao} className="text-xs py-1.5 px-3">Cancelar</Button>
                                                            <Button type="submit" variant="primary" className="text-xs py-1.5 px-4 bg-blue-600 text-white hover:bg-blue-700">Salvar Alterações</Button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}

                            {/* RENDERIZAÇÃO DA ABA DE FUNCIONÁRIOS */}
                            {abaAtiva === 'funcionarios' && funcionariosFiltrados.map((func) => {
                                const emEdicao = usuarioIdEmEdicao === func.id;
                                return (
                                    <Fragment key={func.id}>
                                        <tr className={`hover:bg-gray-50/50 ${!func.ativo ? 'bg-red-50/5' : ''}`}>
                                            <td className="px-6 py-4 font-bold text-gray-900">{func.nome}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{func.email}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{func.matricula || 'Não Informada'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {func.roles?.map((role) => (
                                                        <span key={role} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${role === 'ROLE_ADMIN' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
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
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => emEdicao ? fecharEdicao() : iniciarEdicaoFuncionario(func)} className="text-xs font-bold text-purple-600 hover:underline">
                                                        {emEdicao ? 'Fechar' : 'Editar'}
                                                    </button>
                                                    <button type="button" onClick={() => handleAlternarStatus(func.id, func.nome, func.ativo)} className={`text-xs font-bold hover:underline ${func.ativo ? 'text-red-600' : 'text-green-600'}`}>
                                                        {func.ativo ? 'Inativar' : 'Reativar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Formulário de Edição Expandido para Funcionário */}
                                        {emEdicao && formEdicao && (
                                            <tr>
                                                <td colSpan={6} className="bg-purple-50/20 px-6 py-4 border-t border-b border-purple-100">
                                                    <form onSubmit={salvarAlteracoes} className="max-w-2xl grid grid-cols-2 gap-4 animate-in fade-in duration-100">
                                                        <div className="col-span-2"><h4 className="text-xs font-black uppercase text-purple-700">Alterar Dados e Permissões do Funcionário</h4></div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nome Completo</label>
                                                            <Input type="text" value={formEdicao.nome} onChange={(e) => handleMudancaForm('nome', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">E-mail</label>
                                                            <Input type="email" value={formEdicao.email} onChange={(e) => handleMudancaForm('email', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Matrícula</label>
                                                            <Input type="text" value={formEdicao.documento} onChange={(e) => handleMudancaForm('documento', e.target.value)} required className="w-full text-xs" />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nova Senha (Deixe em branco para manter a atual)</label>
                                                            <Input type="password" value={formEdicao.senha} onChange={(e) => handleMudancaForm('senha', e.target.value)} placeholder="••••••••" className="w-full text-xs" />
                                                        </div>

                                                        {/* Alinhado: Removido ROLE_ENTREGA conforme solicitado */}
                                                        <div className="col-span-2 p-3 bg-white border border-gray-200 rounded-xl space-y-1.5">
                                                            <span className="block text-[10px] font-bold uppercase text-gray-400">Atribuição de Papéis Administrativos</span>
                                                            <div className="flex gap-4">
                                                                {['ROLE_ADMIN', 'ROLE_ESTOQUE', 'ROLE_FATURAMENTO'].map((papel) => (
                                                                    <label key={papel} className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
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

                                                        <div className="col-span-2 flex justify-end gap-2 pt-2">
                                                            <Button type="button" variant="secondary" onClick={fecharEdicao} className="text-xs py-1.5 px-3">Cancelar</Button>
                                                            <Button type="submit" variant="primary" className="text-xs py-1.5 px-4 bg-purple-600 text-white hover:bg-purple-700">Salvar Cadastro</Button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}

                            {/* Feedback para Busca Sem Resultados */}
                            {abaAtiva === 'clientes' && clientesFiltrados.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 font-medium text-gray-400 bg-gray-50/50">Nenhum cliente atende aos critérios da busca.</td></tr>
                            )}
                            {abaAtiva === 'funcionarios' && funcionariosFiltrados.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 font-medium text-gray-400 bg-gray-50/50">Nenhum funcionário encontrado com estes dados.</td></tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};