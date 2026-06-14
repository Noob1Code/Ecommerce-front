import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
import { RoleGuard } from '../../auth';
import { useProductBackofficeController } from '../hooks/useProductBackofficeController';
import { AttributeManager } from './AttributeManager';
import { CreateProductForm } from './CreateProductForm';
import { CreateSkuForm } from './CreateSkuForm';

export const ProductBackoffice = () => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'atributos'>('produtos');

  const {
    estaCarregando,
    erro,
    termoPesquisa,
    produtosFiltrados,
    filtroStatus,
    estaEnviando,
    contagemModificados,
    listaAtributosGlobais,
    setFiltroStatus,
    obterEstoqueEfetivoSku,
    obterPrecoEfetivoSku,
    obterMetadadosEfetivosProduto,
    handleMudancaMetadados,
    handleToggleAtributoProdutoPai,
    handleMudancaPreco,
    handleAlternarStatusProduto,
    handleExclusaoFisicaSku,
    handleEnvioEmLote,
    handleMudancaPesquisa,
    limparPesquisa,
    handleIncrementarEstoque,
    handleDecrementarEstoque,
    handleMudancaEstoqueInput,
    handleBlurEstoqueInput,
    exibirFormCriacao,
    setExibirFormCriacao,
    produtoIdParaNovoSku,
    setProdutoIdParaNovoSku,
    skuIdEmEdicao,
    dadosEdicaoSku,
    handleIniciarEdicaoSku,
    handleCancelarEdicaoSku,
    handleMudancaCodigoSkuEdicao,
    handleMudancaOpcaoSkuEdicao,
    handleSalvarEdicaoSku,
    podeEditarMetadados
  } = useProductBackofficeController();

  if (estaCarregando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-12 w-12 text-amber-600" />
      </div>
    );
  }

  // Escaneia os SKUs existentes para extrair sugestões automáticas de preenchimento para o datalist
  const obterValoresGrupoOpcao = (product: any, attributeId: string): string[] => {
    const valoresSet = new Set<string>();
    product.skus?.forEach((sku: any) => {
      const match = sku.options?.find((o: any) => o.attributeId === attributeId);
      if (match) valoresSet.add(match.value);
    });
    return Array.from(valoresSet);
  };

  return (
    <RoleGuard
      allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-red-700 mb-2">Acesso Negado</h2>
            <p className="text-sm text-red-600 mb-6">Suas credenciais não possuem privilégios autorizados.</p>
            <Button variant="primary" onClick={() => window.location.assign('/')}>Voltar para a Vitrine</Button>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Topbar Administrativa */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Painel Administrativo do Catálogo</h1>
            <p className="mt-2 text-sm text-gray-500">Controle de produtos pai, amarrações de eixos e SKUs físicos.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">

            {abaAtiva === 'produtos' && (
              <Button
                type="button"
                variant={exibirFormCriacao ? 'secondary' : 'primary'}
                onClick={() => setExibirFormCriacao((prev) => !prev)}
                disabled={estaEnviando}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider shadow-md ${!exibirFormCriacao ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
              >
                {exibirFormCriacao ? 'Fechar Cadastro' : 'Cadastrar Produto'}
              </Button>
            )}

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
              variant={abaAtiva === 'atributos' ? 'primary' : 'secondary'}
              onClick={() => setAbaAtiva((p) => p === 'produtos' ? 'atributos' : 'produtos')}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wider shadow-md ${abaAtiva === 'atributos' ? 'bg-purple-600 text-white' : 'text-purple-700 bg-purple-50'}`}
            >
              {abaAtiva === 'produtos' ? 'Gerenciar Atributos' : 'Voltar para Produtos'}
            </Button>

            {abaAtiva === 'produtos' && (
              <Button
                type="button"
                variant={contagemModificados > 0 ? 'primary' : 'secondary'}
                disabled={contagemModificados === 0 || estaEnviando}
                onClick={handleEnvioEmLote}
                className={`px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-md ${contagemModificados > 0 ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
              >
                {estaEnviando ? 'Salvando...' : `Salvar em Lote (${contagemModificados})`}
              </Button>
            )}
          </div>
        </div>

        {abaAtiva === 'atributos' ? (
          <AttributeManager />
        ) : (
          <>
            {exibirFormCriacao && (
              <div className="mb-10"><CreateProductForm onClose={() => setExibirFormCriacao(false)} /></div>
            )}

            {/* Seção de Filtros */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-end max-w-3xl">
              <div className="w-full sm:w-1/2">
                <label htmlFor="search-input" className="block text-sm font-semibold text-gray-700 mb-1.5">Filtrar Container</label>
                <div className="relative rounded-md shadow-sm">
                  <Input
                    id="search-input"
                    type="text"
                    value={termoPesquisa}
                    onChange={(e) => handleMudancaPesquisa(e.target.value)}
                    placeholder="Buscar nome do produto..."
                    disabled={estaEnviando}
                    className="w-full pl-3 pr-10 py-2.5 text-sm rounded-lg"
                  />
                  {termoPesquisa && (
                    <button type="button" onClick={limparPesquisa} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs font-semibold">
                      Limpar
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="status-select" className="block text-sm font-semibold text-gray-700 mb-1.5">Status Comercial</label>
                <select
                  id="status-select"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as 'todos' | 'ativos' | 'inativos')}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none font-medium text-gray-700 shadow-xs"
                >
                  <option value="todos">Exibir Todos</option>
                  <option value="ativos">Apenas Ativos</option>
                  <option value="inativos">Apenas Inativos</option>
                </select>
              </div>
            </div>

            {erro && <ErrorMessage message={erro} />}

            {/* Listagem de Cards */}
            <div className="space-y-6">
              {produtosFiltrados.map((product) => {
                const { name: nomeAtual, description: descricaoAtual, atributosIds: idsAtributosVinculados } =
                  obterMetadadosEfetivosProduto(product.id, product.name, product.description, product.attributes);

                return (
                  <Card key={product.id} className={`p-6 border rounded-xl bg-white shadow-xs ${!product.isActive ? 'border-red-200 bg-red-50/10' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-5 mb-5 items-start">
                      <div className="md:col-span-1 space-y-3">
                        <div>
                          <label htmlFor={`name-${product.id}`} className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome do Produto</label>
                          <Input
                            id={`name-${product.id}`}
                            type="text"
                            value={nomeAtual}
                            disabled={estaEnviando || !product.isActive || !podeEditarMetadados}
                            onChange={(e) => handleMudancaMetadados(product.id, 'name', e.target.value)}
                            className="text-base font-bold text-gray-900 border"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono">UUID: {product.id}</p>
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor={`desc-${product.id}`} className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição Comercial</label>
                        <textarea
                          id={`desc-${product.id}`}
                          value={descricaoAtual}
                          rows={2}
                          disabled={estaEnviando || !product.isActive || !podeEditarMetadados}
                          onChange={(e) => handleMudancaMetadados(product.id, 'description', e.target.value)}
                          className="w-full text-sm p-2 rounded-lg border border-gray-200 bg-gray-50/50 resize-none focus:outline-none text-gray-700 font-medium"
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-end items-center gap-2 pt-4">
                        <button
                          type="button"
                          disabled={estaEnviando || !product.isActive}
                          onClick={() => setProdutoIdParaNovoSku(produtoIdParaNovoSku === product.id ? null : product.id)}
                          className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-3 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          {produtoIdParaNovoSku === product.id ? 'Fechar SKU' : 'Adicionar SKU'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAlternarStatusProduto(product.id, product.name, product.isActive)}
                          className={`text-xs font-bold rounded-lg px-3 py-2 border transition-colors ${product.isActive ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-600 hover:text-white' : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-600 hover:text-white'}`}
                        >
                          {product.isActive ? 'Inativar' : 'Reativar'}
                        </button>
                      </div>
                    </div>

                    {/* Checkboxes para Vinculação de Atributos */}
                    {product.isActive && (
                      <div className="mb-5 p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Eixos de Atributos Vinculados a este Produto Container
                        </span>
                        <div className="flex flex-wrap gap-4">
                          {listaAtributosGlobais.map((attr) => {
                            const vinculado = idsAtributosVinculados.includes(attr.id);
                            return (
                              <label key={attr.id} className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={vinculado}
                                  disabled={estaEnviando || !podeEditarMetadados}
                                  onChange={() => handleToggleAtributoProdutoPai(product.id, attr.id)}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer focus:ring-blue-500"
                                />
                                <span>{attr.nome}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {produtoIdParaNovoSku === product.id && product.isActive && (
                      <div className="mb-6 border-b border-dashed pb-6">
                        <CreateSkuForm product={product} onClose={() => setProdutoIdParaNovoSku(null)} />
                      </div>
                    )}

                    {/* Sub-tabela de Variações */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2.5 text-left font-bold text-gray-500">SKU</th>
                            <th className="px-4 py-2.5 text-left font-bold text-gray-500">Opções</th>
                            <th className="px-4 py-2.5 text-left font-bold text-gray-500">Preço Original</th>
                            <th className="px-4 py-2.5 text-left font-bold text-gray-500">Preço Novo</th>
                            <th className="px-4 py-2.5 text-center font-bold text-gray-500">Estoque</th>
                            <th className="px-4 py-2.5 text-right font-bold text-gray-500">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                          {product.skus?.map((sku) => {
                            const estEfetivo = obterEstoqueEfetivoSku(sku.id, sku.stock);
                            const prcEfetivo = obterPrecoEfetivoSku(sku.id, sku.price);
                            const emEdicao = skuIdEmEdicao === sku.id;
                            
                            return (
                              <Fragment key={sku.id}>
                                <tr className="hover:bg-gray-50/40">
                                  <td className="px-4 py-2.5 font-mono font-bold text-gray-700">{sku.skuCode}</td>
                                  <td className="px-4 py-2.5 text-gray-500 font-medium">{sku.options?.map((o) => `${o.attributeName}: ${o.value}`).join(' | ')}</td>
                                  <td className="px-4 py-2.5 text-gray-400 line-through">{sku.price}</td>
                                  <td className="px-4 py-2.5">
                                    <input
                                      type="text"
                                      value={prcEfetivo}
                                      disabled={estaEnviando || !product.isActive}
                                      onChange={(e) => handleMudancaPreco(sku.id, e.target.value)}
                                      className="w-20 p-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-semibold"
                                    />
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center justify-center gap-1">
                                      <button type="button" onClick={() => handleDecrementarEstoque(sku.id, sku.stock)} className="h-6 w-6 border rounded bg-gray-50 font-bold select-none">-</button>
                                      <input
                                        type="number"
                                        value={estEfetivo}
                                        onChange={(e) => handleMudancaEstoqueInput(sku.id, e.target.value)}
                                        onBlur={() => handleBlurEstoqueInput(sku.id)}
                                        className="w-14 text-center border rounded text-xs font-semibold focus:outline-none"
                                      />
                                      <button type="button" onClick={() => handleIncrementarEstoque(sku.id, sku.stock)} className="h-6 w-6 border rounded bg-gray-50 font-bold select-none">+</button>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        type="button" 
                                        disabled={estaEnviando || !product.isActive}
                                        onClick={() => emEdicao ? handleCancelarEdicaoSku() : handleIniciarEdicaoSku(sku)} 
                                        className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors font-bold"
                                      >
                                        {emEdicao ? 'Fechar' : 'Editar'}
                                      </button>
                                      <button type="button" onClick={() => handleExclusaoFisicaSku(sku.id, sku.skuCode)} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition-colors font-bold">Excluir</button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Painel Expandido Inline para alteração híbrida (Seleção + Escrita Livre) */}
                                {emEdicao && dadosEdicaoSku && (
                                  <tr>
                                    <td colSpan={6} className="bg-blue-50/20 p-4 border-t border-b border-blue-100">
                                      <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
                                        <h4 className="text-xs font-bold uppercase text-blue-600 tracking-wide">Editar Características da Variação</h4>
                                        
                                        <div>
                                          <label htmlFor={`edit-code-${sku.id}`} className="block text-xs font-bold text-gray-500 uppercase mb-1">Código Identificador (SKU)</label>
                                          <Input 
                                            id={`edit-code-${sku.id}`}
                                            type="text" 
                                            value={dadosEdicaoSku.skuCode} 
                                            onChange={(e) => handleMudancaCodigoSkuEdicao(e.target.value)} 
                                            className="w-full text-xs" 
                                          />
                                        </div>

                                        <div className="space-y-3">
                                          {product.attributes.map((attr) => {
                                            const listaSugestoesId = `sugestoes-${sku.id}-${attr.id}`;
                                            return (
                                              <div key={attr.id} className="space-y-1">
                                                <label htmlFor={`edit-input-${sku.id}-${attr.id}`} className="block text-[11px] font-bold text-gray-500 uppercase">
                                                  {attr.attributeName}
                                                </label>
                                                
                                                {/* Combinação Híbrida: Input de texto associado a um DataList de sugestões existentes */}
                                                <input 
                                                  id={`edit-input-${sku.id}-${attr.id}`}
                                                  type="text"
                                                  list={listaSugestoesId}
                                                  value={dadosEdicaoSku.options[attr.attributeId] || ''} 
                                                  onChange={(e) => handleMudancaOpcaoSkuEdicao(attr.attributeId, e.target.value)}
                                                  placeholder="Selecione na lista ou digite um novo valor livre..."
                                                  className="w-full p-2 border rounded-lg text-xs bg-white font-medium text-gray-700 focus:outline-none shadow-2xs border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                />

                                                {/* Alimentação dinâmica das opções que o banco de dados já possui */}
                                                <datalist id={listaSugestoesId}>
                                                  {obterValoresGrupoOpcao(product, attr.attributeId).map((val) => (
                                                    <option key={val} value={val} />
                                                  ))}
                                                </datalist>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        <div className="flex gap-2 justify-end pt-2">
                                          <Button type="button" variant="secondary" onClick={handleCancelarEdicaoSku} className="text-xs py-1.5 px-3">
                                            Cancelar
                                          </Button>
                                          <Button 
                                            type="button" 
                                            variant="primary" 
                                            onClick={() => handleSalvarEdicaoSku(sku.id)} 
                                            className="text-xs py-1.5 px-3 bg-blue-600 text-white hover:bg-blue-700"
                                          >
                                            Salvar Alterações
                                          </Button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
};