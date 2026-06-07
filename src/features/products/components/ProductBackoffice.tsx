import { useNavigate } from 'react-router-dom';
import { useProductBackofficeController } from '../hooks/useProductBackofficeController';
import { useAuthStore, RoleGuard } from '../../auth';
import { Spinner, ErrorMessage, Card, Button, Input } from '../../../shared/components/ui';

export const ProductBackoffice = () => {
  const navigate = useNavigate();
  const usuarioLogado = useAuthStore((state) => state.usuario);
  const ehAdmin = usuarioLogado?.perfis.includes('ROLE_ADMIN') ?? false;
  const ehEstoque = usuarioLogado?.perfis.includes('ROLE_ESTOQUE') ?? false;
  const podeEditarMetadados = ehAdmin || ehEstoque;

  const {
    estaCarregando,
    erro,
    termoPesquisa,
    produtosFiltrados,
    filtroStatus,
    estaEnviando,
    contagemModificados,
    setFiltroStatus,
    alteracoesEstoque,
    alteracoesPreco,
    obterEstoqueEfetivoSku,
    obterPrecoEfetivoSku,
    obterMetadadosEfetivosProduto,
    handleMudancaMetadados,
    handleMudancaPreco,
    handleAlternarStatusProduto,
    handleExclusaoFisicaSku,
    handleEnvioEmLote,
    handleMudancaPesquisa,
    limparPesquisa,
    handleIncrementarEstoque,
    handleDecrementarEstoque,
    handleMudancaEstoqueInput,
    handleBlurEstoqueInput
  } = useProductBackofficeController();

  if (estaCarregando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-amber-600" />
      </div>
    );
  }

  return (
    <RoleGuard 
      allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']} 
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-red-700 mb-2">Acesso Negado</h2>
            <p className="text-sm text-red-600 mb-6">
              Suas credenciais não possuem privilégios autorizados para visualizar o painel do backoffice.
            </p>
            <Button variant="primary" onClick={() => window.location.assign('/')}>
              Retornar para a Vitrine
            </Button>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Barra Superior de Título */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Painel Administrativo de Estoque</h1>
            <p className="mt-2 text-sm text-gray-500">
              Modifique detalhes de containers, gerencie estoques e altere preços de SKUs em lote.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
            {/* Botão de Recursos Humanos: Protegido rigidamente apenas para ROLE_ADMIN */}
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/backoffice/funcionarios')}
                className="px-4 py-3 text-sm font-bold border border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50"
              >
                Gerenciar Funcionários
              </Button>
            </RoleGuard>

            <Button
              type="button"
              variant={contagemModificados > 0 ? 'primary' : 'secondary'}
              disabled={contagemModificados === 0 || estaEnviando}
              onClick={handleEnvioEmLote}
              className={`px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all shadow-md ${
                contagemModificados > 0 ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white' : ''
              }`}
            >
              {estaEnviando ? 'Salvando alterações...' : `Salvar Alterações (${contagemModificados} modificações)`}
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-end max-w-3xl">
          <div className="w-full sm:w-1/2">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Filtrar Itens por Nome
            </label>
            <div className="relative rounded-md shadow-sm">
              <Input
                id="search"
                name="search"
                type="text"
                value={termoPesquisa}
                onChange={(e) => handleMudancaPesquisa(e.target.value)}
                placeholder="Buscar nome do produto..."
                disabled={estaEnviando}
                className="w-full pl-3 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none"
              />
              {termoPesquisa && (
                <button type="button" onClick={limparPesquisa} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <label htmlFor="statusFilter" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Filtrar por Status Comercial
            </label>
            <select
              id="statusFilter"
              value={filtroStatus}
              disabled={estaEnviando}
              onChange={(e) => setFiltroStatus(e.target.value as 'todos' | 'ativos' | 'inativos')}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none font-medium text-gray-700 shadow-xs"
            >
              <option value="todos">Exibir Todos os Produtos</option>
              <option value="ativos">Apenas Produtos Ativos</option>
              <option value="inativos">Apenas Produtos Inativos</option>
            </select>
          </div>
        </div>

        {erro && <ErrorMessage message={erro} />}

        {produtosFiltrados.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500 font-medium">Nenhum produto localizado.</p>
          </div>
        )}

        {/* Grade de Produtos */}
        <div className="space-y-6">
          {produtosFiltrados.map((product) => {
            const { name: nomeAtual, description: descricaoAtual } = obterMetadadosEfetivosProduto(product.id, product.name, product.description);
            const produtoModificado = nomeAtual !== product.name || descricaoAtual !== product.description;

            return (
              <Card 
                key={product.id} 
                className={`p-6 border shadow-sm rounded-xl transition-all ${
                  !product.isActive 
                    ? 'border-red-200 bg-red-50/20' 
                    : produtoModificado 
                      ? 'border-amber-400 ring-1 ring-amber-400 bg-white' 
                      : 'border-gray-200 bg-white'
                }`}
              >
                {/* Edição de Metadados do Produto Pai */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-5 mb-5 items-start">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor={`name-${product.id}`} className="block text-xs font-bold uppercase tracking-wide text-gray-500">
                        Nome do Produto Container
                      </label>
                      {!product.isActive && (
                        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 uppercase tracking-wider">
                          Inativo
                        </span>
                      )}
                    </div>
                    {/* ALINHAMENTO DE PERMISSÃO: O campo agora aceita a digitação do estoquista (podeEditarMetadados) */}
                    <Input
                      type="text"
                      id={`name-${product.id}`}
                      value={nomeAtual}
                      disabled={estaEnviando || !product.isActive || !podeEditarMetadados} 
                      onChange={(e) => handleMudancaMetadados(product.id, 'name', e.target.value)}
                      className={`text-base font-bold text-gray-900 border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                        (!product.isActive || !podeEditarMetadados) ? 'text-gray-500 bg-gray-100 cursor-not-allowed' : 'bg-gray-50/50'
                      }`}
                    />
                    <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {product.id}</p>
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor={`desc-${product.id}`} className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                      Descrição do Catálogo
                    </label>
                    {/* ALINHAMENTO DE PERMISSÃO: A caixa de descrição agora aceita a digitação do estoquista (podeEditarMetadados) */}
                    <textarea
                      id={`desc-${product.id}`} 
                      value={descricaoAtual}
                      rows={2}
                      disabled={estaEnviando || !product.isActive || !podeEditarMetadados} 
                      onChange={(e) => handleMudancaMetadados(product.id, 'description', e.target.value)}
                      className={`w-full text-sm text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none leading-tight ${
                        (!product.isActive || !podeEditarMetadados) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50/50'
                      }`}
                    />
                  </div>

                  {/* Tanto ADMIN quanto ESTOQUE podem alterar o status do produto pai */}
                  <div className="md:col-span-1 flex justify-end pt-5 md:pt-4">
                    <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}>
                      <button 
                        type="button"
                        onClick={() => handleAlternarStatusProduto(product.id, product.name, product.isActive)}
                        className={`text-xs font-semibold hover:text-white rounded-lg px-4 py-2 transition-all shadow-sm border ${
                          product.isActive
                            ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-600'
                            : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-600'
                        }`}
                      >
                        {product.isActive ? 'Inativar Produto (Soft)' : 'Reativar Produto (Ativar)'}
                      </button>
                    </RoleGuard>
                  </div>
                </div>

                {/* Sub-tabela de Variações de SKU */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Código SKU</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Configurações/Opções</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Preço Original</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Alterar Preço (R$)</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500">Ajustar Estoque</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {product.skus.map((sku) => {
                        const estoqueEfetivo = obterEstoqueEfetivoSku(sku.id, sku.stock);
                        const precoEfetivo = obterPrecoEfetivoSku(sku.id, sku.price);
                        
                        const estoqueModificado = alteracoesEstoque[sku.id] !== undefined && alteracoesEstoque[sku.id] !== sku.stock;
                        const precoModificado = alteracoesPreco[sku.id] !== undefined && alteracoesPreco[sku.id] !== sku.price;
                        
                        const estoqueNumerico = estoqueEfetivo === '' ? 0 : Number(estoqueEfetivo);

                        return (
                          <tr 
                            key={sku.id} 
                            className={`transition-colors ${
                              !product.isActive 
                                ? 'bg-gray-50/30 text-gray-400' 
                                : (estoqueModificado || precoModificado) 
                                  ? 'bg-amber-50/40 hover:bg-amber-50/70' 
                                  : 'hover:bg-gray-50/50'
                            }`}
                          >
                            <td className="px-4 py-3 font-mono font-semibold text-gray-700">
                              {sku.skuCode}
                              {(estoqueModificado || precoModificado) && product.isActive && (
                                <span className="ml-2 inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 animate-pulse">
                                  Pendente
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">
                              {sku.options.map((opt) => `${opt.attributeName}: ${opt.value}`).join(' | ')}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-400 line-through">{sku.formattedPrice}</td>
                            
                            {/* Ajuste de Preços: Permitido para ADMIN e ESTOQUE conforme regras RBAC */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  aria-label={`Preço para o SKU ${sku.skuCode}`}
                                  value={precoEfetivo}
                                  disabled={estaEnviando || !product.isActive}
                                  onChange={(e) => handleMudancaPreco(sku.id, e.target.value)}
                                  placeholder="0.00"
                                  className={`w-24 px-2 py-1 text-sm font-semibold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 text-left ${
                                    precoModificado 
                                      ? 'border-amber-500 ring-2 ring-amber-500 text-amber-950 font-bold bg-white' 
                                      : 'border-gray-300 bg-white'
                                  }`}
                                />
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  aria-label={`Diminuir estoque de ${sku.skuCode}`}
                                  disabled={estaEnviando || estoqueNumerico <= 0 || !product.isActive}
                                  onClick={() => handleDecrementarEstoque(sku.id, sku.stock)}
                                  className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold disabled:opacity-40 select-none"
                                >
                                  -
                                </button>
                                
                                <input
                                  type="number"
                                  aria-label={`Volume de estoque de ${sku.skuCode}`}
                                  min={0}
                                  value={estoqueEfetivo}
                                  disabled={estaEnviando || !product.isActive}
                                  onChange={(e) => handleMudancaEstoqueInput(sku.id, e.target.value)}
                                  onBlur={() => handleBlurEstoqueInput(sku.id)}
                                  className={`w-20 text-center py-1 text-sm font-semibold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    estoqueModificado 
                                      ? 'border-amber-500 ring-2 ring-amber-500 text-amber-950 font-bold bg-white' 
                                      : 'border-gray-300 bg-white'
                                  }`}
                                />

                                <button
                                  type="button"
                                  aria-label={`Incrementar estoque de ${sku.skuCode}`}
                                  disabled={estaEnviando || !product.isActive}
                                  onClick={() => handleIncrementarEstoque(sku.id, sku.stock)}
                                  className="h-8 w-8 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            
                            {/* Tanto ADMIN quanto ESTOQUE podem remover fisicamente a variação de SKU */}
                            <td className="px-4 py-3 text-right">
                              <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}>
                                <button
                                  type="button"
                                  disabled={estaEnviando || !product.isActive}
                                  onClick={() => handleExclusaoFisicaSku(sku.id, sku.skuCode)}
                                  className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-40"
                                >
                                  Excluir Variação
                                </button>
                              </RoleGuard>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </RoleGuard>
  );
};