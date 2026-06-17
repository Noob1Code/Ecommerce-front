import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ErrorMessage, Input, Spinner } from '../../../shared/components/ui';
import { RoleGuard } from '../../auth';
import type { Product } from '../domain/product.types';
import { useProductBackofficeController } from '../hooks/useProductBackofficeController';
import { AttributeManager } from './AttributeManager';
import { CreateProductForm } from './CreateProductForm';
import { CreateSkuForm } from './CreateSkuForm';

export const ProductBackoffice = () => {
  const navigate = useNavigate();
  const [abaAtiva, setABAAtiva] = useState<'produtos' | 'atributos'>('produtos');

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
    handleUploadImagemEdicaoSku,
    handleRemoverImagemEdicaoSku,
    handleSalvarEdicaoSku,
    podeEditarMetadados
  } = useProductBackofficeController();

  if (estaCarregando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 w-full">
        <Spinner className="h-12 w-12 text-blue-600" />
      </div>
    );
  }

  const obterValoresGrupoOpcao = (product: Product, attributeId: string): string[] => {
    const valoresSet = new Set<string>();
    product.skus?.forEach((sku) => {
      const match = sku.options?.find((o) => o.attributeId === attributeId);
      if (match) valoresSet.add(match.value);
    });
    return Array.from(valoresSet);
  };

  return (
    <RoleGuard
      allowedRoles={['ROLE_ADMIN', 'ROLE_ESTOQUE']}
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center w-full">
          <Card className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 shadow-sm w-full">
            <h2 className="text-xl font-bold text-red-700 mb-2">Acesso Negado</h2>
            <p className="text-sm text-red-600 mb-6">Suas credenciais não possuem privilégios autorizados.</p>
            <Button variant="primary" className="w-full sm:w-auto" onClick={() => window.location.assign('/')}>Voltar para a Vitrine</Button>
          </Card>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-12 w-full">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 pb-5 mb-6 text-center sm:text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Painel do Catálogo</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">Controle de produtos pai, amarrações de eixos e SKUs físicos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2.5 w-full lg:w-auto">
            {abaAtiva === 'produtos' && (
              <Button
                type="button"
                variant={exibirFormCriacao ? 'secondary' : 'primary'}
                onClick={() => setExibirFormCriacao((prev) => !prev)}
                disabled={estaEnviando}
                className={`w-full lg:w-auto px-4 py-2.5 text-xs font-bold uppercase rounded-xl shadow-xs border-none ${!exibirFormCriacao ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
              >
                {exibirFormCriacao ? 'Fechar Cadastro' : 'Cadastrar Produto'}
              </Button>
            )}

            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/backoffice/usuarios')}
                className="w-full lg:w-auto px-4 py-2.5 text-xs font-bold border border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-xl"
              >
                Gerenciar Usuários
              </Button>
            </RoleGuard>

            <Button
              type="button"
              variant={abaAtiva === 'atributos' ? 'primary' : 'secondary'}
              onClick={() => setABAAtiva((p) => p === 'produtos' ? 'atributos' : 'produtos')}
              className={`w-full lg:w-auto px-4 py-2.5 text-xs font-bold uppercase rounded-xl shadow-xs border-none ${abaAtiva === 'atributos' ? 'bg-purple-600 text-white' : 'text-purple-700 bg-purple-50 hover:bg-purple-100/50'}`}
            >
              {abaAtiva === 'produtos' ? 'Gerenciar Atributos' : 'Voltar para Produtos'}
            </Button>

            {abaAtiva === 'produtos' && (
              <Button
                type="button"
                variant={contagemModificados > 0 ? 'primary' : 'secondary'}
                disabled={contagemModificados === 0 || estaEnviando}
                isLoading={estaEnviando}
                onClick={handleEnvioEmLote}
                className={`w-full lg:w-auto px-5 py-2.5 text-xs font-bold uppercase rounded-xl shadow-md border-none ${contagemModificados > 0 ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
              >
                Salvar em Lote ({contagemModificados})
              </Button>
            )}
          </div>
        </div>

        {abaAtiva === 'atributos' ? (
          <AttributeManager />
        ) : (
          <>
            {exibirFormCriacao && (
              <div className="mb-8 w-full"><CreateProductForm onClose={() => setExibirFormCriacao(false)} /></div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center max-w-3xl w-full text-left">
              <div className="w-full sm:w-1/2">
                <label htmlFor="search-input" className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Filtrar Container</label>
                <div className="relative rounded-xl shadow-xs w-full">
                  <Input
                    id="search-input"
                    type="text"
                    value={termoPesquisa}
                    onChange={(e) => handleMudancaPesquisa(e.target.value)}
                    placeholder="Buscar nome do produto..."
                    disabled={estaEnviando}
                    className="w-full pr-14 text-sm rounded-xl"
                  />
                  {termoPesquisa && (
                    <button type="button" onClick={limparPesquisa} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-wider active:scale-90 transition-transform">
                      Limpar
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="status-select" className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Status Comercial</label>
                <select
                  id="status-select"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as 'todos' | 'ativos' | 'inativos')}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none font-semibold text-gray-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="todos">Exibir Todos</option>
                  <option value="ativos">Apenas Ativos</option>
                  <option value="inativos">Apenas Inativos</option>
                </select>
              </div>
            </div>

            {erro && <ErrorMessage message={erro} />}

            <div className="space-y-6 w-full">
              {produtosFiltrados.map((product) => {
                const { name: nomeAtual, description: descricaoAtual, atributosIds: idsAtributosVinculados } =
                  obterMetadadosEfetivosProduto(product.id, product.name, product.description, product.attributes);

                return (
                  <Card key={product.id} className={`p-4 sm:p-5 border rounded-xl bg-white shadow-xs transition-colors w-full ${!product.isActive ? 'border-red-200 bg-red-50/10' : 'border-gray-200'}`}>

                    <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 mb-4 md:grid md:grid-cols-3 md:items-end text-left w-full">
                      <div className="w-full space-y-1.5 min-w-0">
                        <div>
                          <label htmlFor={`name-${product.id}`} className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nome do Produto</label>
                          <Input
                            id={`name-${product.id}`}
                            type="text"
                            value={nomeAtual}
                            disabled={estaEnviando || !product.isActive || !podeEditarMetadados}
                            onChange={(e) => handleMudancaMetadados(product.id, 'name', e.target.value)}
                            className="text-sm font-bold text-gray-900 rounded-xl w-full"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono break-all">UUID: {product.id}</p>
                      </div>

                      <div className="w-full">
                        <label htmlFor={`desc-${product.id}`} className="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Descrição Comercial</label>
                        <textarea
                          id={`desc-${product.id}`}
                          value={descricaoAtual}
                          rows={2}
                          disabled={estaEnviando || !product.isActive || !podeEditarMetadados}
                          onChange={(e) => handleMudancaMetadados(product.id, 'description', e.target.value)}
                          className="w-full text-base sm:text-sm p-2.5 rounded-xl border border-gray-300 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 font-medium transition-all shadow-3xs"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full md:justify-end">
                        <button
                          type="button"
                          disabled={estaEnviando || !product.isActive}
                          onClick={() => setProdutoIdParaNovoSku(produtoIdParaNovoSku === product.id ? null : product.id)}
                          className="w-full sm:w-auto text-center text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-xl px-4 py-3 sm:py-2.5 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-3xs cursor-pointer"
                        >
                          {produtoIdParaNovoSku === product.id ? 'Fechar SKU' : 'Adicionar SKU'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAlternarStatusProduto(product.id, product.name, product.isActive)}
                          className={`w-full sm:w-auto text-center text-xs font-bold rounded-xl px-4 py-3 sm:py-2.5 border transition-all active:scale-95 shadow-3xs cursor-pointer ${product.isActive ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-600 hover:text-white' : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-600 hover:text-white'}`}
                        >
                          {product.isActive ? 'Inativar' : 'Reativar'}
                        </button>
                      </div>
                    </div>

                    {product.isActive && (
                      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 shadow-3xs w-full text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Eixos de Atributos Vinculados a este Produto Container
                        </span>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          {listaAtributosGlobais.map((attr) => {
                            const vinculado = idsAtributosVinculados.includes(attr.id);
                            return (
                              <label key={attr.id} className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-white sm:bg-transparent p-1.5 sm:p-0 rounded-lg border sm:border-none border-gray-100">
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
                      <div className="mb-5 border-b border-dashed border-gray-200 pb-5 w-full">
                        <CreateSkuForm product={{ id: product.id, name: product.name, attributes: product.attributes }} onClose={() => setProdutoIdParaNovoSku(null)} />
                      </div>
                    )}

                    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 scrollbar-thin">
                      <table className="w-full divide-y divide-gray-100 text-xs text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="px-4 py-3 min-w-[120px]">SKU</th>
                            <th className="px-4 py-3 min-w-[150px]">Opções</th>
                            <th className="px-4 py-3 w-24">Preço Base</th>
                            <th className="px-4 py-3 w-28">Preço Novo</th>
                            <th className="px-4 py-3 text-center w-36">Estoque</th>
                            <th className="px-4 py-3 text-right pr-6 w-28">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
                          {product.skus?.map((sku) => {
                            const estEfetivo = obterEstoqueEfetivoSku(sku.id, sku.stock);
                            const prcEfetivo = obterPrecoEfetivoSku(sku.id, sku.price);
                            const emEdicao = skuIdEmEdicao === sku.id;

                            return (
                              <Fragment key={sku.id}>
                                <tr className="hover:bg-gray-50/40 transition-colors">
                                  <td className="px-4 py-3 font-mono font-bold text-gray-900 truncate max-w-[120px]" title={sku.skuCode}>{sku.skuCode}</td>
                                  <td className="px-4 py-3 text-gray-500 font-medium truncate max-w-[150px]" title={sku.options?.map((o) => `${o.attributeName}: ${o.value}`).join(' | ')}>{sku.options?.map((o) => `${o.attributeName}: ${o.value}`).join(' | ')}</td>
                                  <td className="px-4 py-3 text-gray-400 line-through whitespace-nowrap">{sku.price}</td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={prcEfetivo}
                                      disabled={estaEnviando || !product.isActive}
                                      onChange={(e) => handleMudancaPreco(sku.id, e.target.value)}
                                      className="w-20 p-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-bold text-gray-900 shadow-3xs transition-all"
                                    />
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2 px-1">
                                      <button type="button" onClick={() => handleDecrementarEstoque(sku.id, sku.stock)} className="h-6 w-6 border border-gray-300 rounded-md bg-gray-50 text-gray-600 font-bold select-none shadow-3xs active:scale-90 transition-transform flex items-center justify-center">-</button>
                                      <input
                                        type="number"
                                        value={estEfetivo}
                                        onChange={(e) => handleMudancaEstoqueInput(sku.id, e.target.value)}
                                        onBlur={() => handleBlurEstoqueInput(sku.id)}
                                        className="w-12 text-center border border-gray-300 rounded-md py-0.5 text-xs font-bold text-gray-900 focus:outline-none shadow-3xs"
                                      />
                                      <button type="button" onClick={() => handleIncrementarEstoque(sku.id, sku.stock)} className="h-6 w-6 border border-gray-300 rounded-md bg-gray-50 text-gray-600 font-bold select-none shadow-3xs active:scale-90 transition-transform flex items-center justify-center">+</button>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right pr-6 whitespace-nowrap">
                                    <div className="flex justify-end gap-3 font-bold text-xs">
                                      <button
                                        type="button"
                                        disabled={estaEnviando || !product.isActive}
                                        onClick={() => emEdicao ? handleCancelarEdicaoSku() : handleIniciarEdicaoSku(sku)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors active:scale-95 cursor-pointer"
                                      >
                                        {emEdicao ? 'Fechar' : 'Editar'}
                                      </button>
                                      <button type="button" onClick={() => handleExclusaoFisicaSku(sku.id, sku.skuCode)} className="text-red-600 hover:text-red-800 transition-colors active:scale-95 cursor-pointer">Excluir</button>
                                    </div>
                                  </td>
                                </tr>

                                {emEdicao && dadosEdicaoSku && (
                                  <tr className="bg-blue-50/5">
                                    <td colSpan={6} className="px-4 py-4 border-t border-b border-blue-100">
                                      <div className="space-y-4 max-w-xl animate-in fade-in duration-150 text-left w-full">
                                        <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Editar Características da Variação</h4>

                                        <div>
                                          <label htmlFor={`edit-code-${sku.id}`} className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Código Identificador (SKU)</label>
                                          <Input
                                            id={`edit-code-${sku.id}`}
                                            type="text"
                                            value={dadosEdicaoSku.skuCode}
                                            onChange={(e) => handleMudancaCodigoSkuEdicao(e.target.value)}
                                            className="w-full text-xs rounded-xl"
                                          />
                                        </div>

                                        <div className="space-y-3.5 w-full">
                                          {product.attributes.map((attr) => {
                                            const listaSugestoesId = `sugestoes-${sku.id}-${attr.id}`;
                                            return (
                                              <div key={attr.id} className="space-y-1.5 w-full">
                                                <label htmlFor={`edit-input-${sku.id}-${attr.id}`} className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                  {attr.attributeName}
                                                </label>

                                                <input
                                                  id={`edit-input-${sku.id}-${attr.id}`}
                                                  type="text"
                                                  list={listaSugestoesId}
                                                  value={dadosEdicaoSku.options[attr.attributeId] || ''}
                                                  onChange={(e) => handleMudancaOpcaoSkuEdicao(attr.attributeId, e.target.value)}
                                                  placeholder="Selecione na lista ou digite um novo valor livre..."
                                                  className="w-full text-base sm:text-sm p-2.5 border border-gray-300 rounded-xl bg-white font-semibold text-gray-700 focus:outline-none shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                                />

                                                <datalist id={listaSugestoesId}>
                                                  {obterValoresGrupoOpcao(product, attr.attributeId).map((val) => (
                                                    <option key={val} value={val} />
                                                  ))}
                                                </datalist>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        <div className="space-y-2 w-full">
                                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gerenciar Galeria da Variação</label>

                                          <div className="flex items-center justify-center w-full">
                                            <label className={`flex flex-col items-center justify-center w-full h-20 border border-dashed border-blue-300 rounded-xl cursor-pointer bg-white hover:bg-blue-50/40 transition-colors ${estaEnviando ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                                              <div className="flex flex-col items-center justify-center pt-1.5 pb-1.5">
                                                <p className="text-xs text-blue-600 font-bold">Anexar Nova Foto a esta variação</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Selecione arquivos locais</p>
                                              </div>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={estaEnviando}
                                                onChange={(e) => {
                                                  if (e.target.files && e.target.files[0]) {
                                                    handleUploadImagemEdicaoSku(e.target.files[0]);
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>

                                          {dadosEdicaoSku.images && dadosEdicaoSku.images.length > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 w-full">
                                              {dadosEdicaoSku.images.map((url, idx) => (
                                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-white shrink-0">
                                                  <img src={url} alt="Preview SKU" className="w-full h-full object-cover" />
                                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <button
                                                      type="button"
                                                      disabled={estaEnviando}
                                                      onClick={() => handleRemoverImagemEdicaoSku(idx)}
                                                      className="bg-red-600 text-white rounded px-1.5 py-0.5 text-[9px] font-bold hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                                                    >
                                                      Excluir
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex flex-col-reverse sm:flex-row gap-2.5 justify-end pt-2 w-full">
                                          <Button type="button" variant="secondary" onClick={handleCancelarEdicaoSku} className="w-full sm:w-auto text-xs py-2 px-4 rounded-xl">
                                            Cancelar
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => handleSalvarEdicaoSku(sku.id)}
                                            className="w-full sm:w-auto text-xs py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl border-none font-bold shadow-sm"
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