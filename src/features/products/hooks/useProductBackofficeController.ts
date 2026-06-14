import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  alterarStatusProdutoEmApi,
  deleteSkuInApi,
  fetchAttributesFromApi,
  updateProductMetadataInApi,
  updateSkuDetailsInApi,
  updateSkuPriceInApi,
  updateSkuStockInApi
} from '../api/productsApi';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import type { ProductSku } from '../domain/product.types'; // Importação do contrato rígido de domínio
import { useProducts } from './useProducts';

interface AtributoMinimo {
  id: string;
  attributeId: string;
  attributeName?: string;
}

export const useProductBackofficeController = () => {
  const queryClient = useQueryClient();
  const { products: produtos, isLoading: estaCarregando, error: erro } = useProducts();
  const [parametrosBusca, setParametrosBusca] = useSearchParams();
  const termoPesquisa = parametrosBusca.get('search') || '';
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [alteracoesEstoque, setAlteracoesEstoque] = useState<Record<string, number | string>>({});
  const [alteracoesPreco, setAlteracoesPreco] = useState<Record<string, number | string>>({});
  const [alteracoesMetadados, setAlteracoesMetadados] = useState<Record<string, { name: string; description: string; atributosIds: string[] }>>({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [exibirFormCriacao, setExibirFormCriacao] = useState(false);
  const [produtoIdParaNovoSku, setProdutoIdParaNovoSku] = useState<string | null>(null);

  const [skuIdEmEdicao, setSkuIdEmEdicao] = useState<string | null>(null);
  const [dadosEdicaoSku, setDadosEdicaoSku] = useState<{ skuCode: string; options: Record<string, string> } | null>(null);

  const { data: listaAtributosGlobais = [] } = useQuery({
    queryKey: ['products', 'global-attributes-list'] as const,
    queryFn: fetchAttributesFromApi,
    staleTime: 1000 * 60 * 5,
  });

  const produtosFiltrados = useMemo(() => {
    if (!produtos) return [];
    return produtos.filter((produto) => {
      const correspondeBusca = produto.name.toLowerCase().includes(termoPesquisa.toLowerCase());
      const correspondeStatus =
        filtroStatus === 'todos' ||
        (filtroStatus === 'ativos' && produto.isActive) ||
        (filtroStatus === 'inativos' && !produto.isActive);
      return correspondeBusca && correspondeStatus;
    });
  }, [produtos, termoPesquisa, filtroStatus]);

  const obterEstoqueEfetivoSku = (skuId: string, estoqueAtual: number): number | string => {
    return alteracoesEstoque[skuId] !== undefined ? alteracoesEstoque[skuId] : estoqueAtual;
  };

  const obterPrecoEfetivoSku = (skuId: string, precoAtual: number): number | string => {
    return alteracoesPreco[skuId] !== undefined ? alteracoesPreco[skuId] : precoAtual;
  };

  const obterMetadadosEfetivosProduto = (
    produtoId: string,
    nomeOriginal: string,
    descricaoOriginal: string,
    atributosOriginais: AtributoMinimo[]
  ) => {
    return alteracoesMetadados[produtoId] || {
      name: nomeOriginal,
      description: descricaoOriginal,
      atributosIds: atributosOriginais.map((a) => a.attributeId || a.id)
    };
  };

  const handleMudancaMetadados = (produtoId: string, chave: 'name' | 'description', valor: string) => {
    setAlteracoesMetadados((prev) => {
      const original = produtos?.find((p) => p.id === produtoId);
      const atual = prev[produtoId] || {
        name: original?.name || '',
        description: original?.description || '',
        atributosIds: original?.attributes.map((a) => a.attributeId) || []
      };
      return { ...prev, [produtoId]: { ...atual, [chave]: valor } };
    });
  };

  const handleToggleAtributoProdutoPai = (produtoId: string, atributoId: string) => {
    setAlteracoesMetadados((prev) => {
      const original = produtos?.find((p) => p.id === produtoId);
      const atual = prev[produtoId] || {
        name: original?.name || '',
        description: original?.description || '',
        atributosIds: original?.attributes.map((a) => a.attributeId) || []
      };

      const novosIds = atual.atributosIds.includes(atributoId)
        ? atual.atributosIds.filter((id) => id !== atributoId)
        : [...atual.atributosIds, atributoId];

      return { ...prev, [produtoId]: { ...atual, atributosIds: novosIds } };
    });
  };

  const handleMudancaPreco = (skuId: string, valor: string) => {
    const valorSaneado = valor.replace(/[^0-9.]/g, '');
    setAlteracoesPreco((prev) => ({ ...prev, [skuId]: valorSaneado }));
  };

  const handleAlternarStatusProduto = async (produtoId: string, nomeProduto: string, estaAtivo: boolean) => {
    const msg = estaAtivo ? `Deseja inativar o produto: ${nomeProduto}?` : `Deseja reativar o produto: ${nomeProduto}?`;
    if (!window.confirm(msg)) return;
    try {
      await alterarStatusProdutoEmApi(produtoId);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      alert('Status alterado com sucesso!');
    } catch {
      alert('Erro ao modificar o status.');
    }
  };

  const handleExclusaoFisicaSku = async (skuId: string, codigoSku: string) => {
    if (!window.confirm(`Deseja remover permanentemente o SKU ${codigoSku}?`)) return;
    try {
      await deleteSkuInApi(skuId);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      alert('Variação de SKU removida com sucesso!');
    } catch {
      alert('Erro ao excluir SKU do banco.');
    }
  };

  // CORREÇÃO: Uso do ProductSku tipado estritamente em vez de 'any'
  const handleIniciarEdicaoSku = (sku: ProductSku) => {
    setSkuIdEmEdicao(sku.id);
    const opcoesIniciais: Record<string, string> = {};
    sku.options?.forEach((o) => {
      opcoesIniciais[o.attributeId] = o.value;
    });
    setDadosEdicaoSku({
      skuCode: sku.skuCode,
      options: opcoesIniciais
    });
  };

  const handleCancelarEdicaoSku = () => {
    setSkuIdEmEdicao(null);
    setDadosEdicaoSku(null);
  };

  const handleMudancaCodigoSkuEdicao = (codigo: string) => {
    if (!dadosEdicaoSku) return;
    setDadosEdicaoSku({ ...dadosEdicaoSku, skuCode: codigo });
  };

  const handleMudancaOpcaoSkuEdicao = (atributoId: string, valor: string) => {
    if (!dadosEdicaoSku) return;
    setDadosEdicaoSku({
      ...dadosEdicaoSku,
      options: { ...dadosEdicaoSku.options, [atributoId]: valor }
    });
  };

  const handleSalvarEdicaoSku = async (skuId: string) => {
    if (!dadosEdicaoSku) return;
    setEstaEnviando(true);
    try {
      const opcoesDto = Object.entries(dadosEdicaoSku.options).map(([atributoId, valor]) => ({
        atributoId,
        valor
      }));

      await updateSkuDetailsInApi(skuId, dadosEdicaoSku.skuCode, opcoesDto);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });

      setSkuIdEmEdicao(null);
      setDadosEdicaoSku(null);
      alert('Configuração de atributos do SKU salva com sucesso!');
    } catch {
      alert('Erro ao tentar atualizar as características da variação.');
    } finally {
      setEstaEnviando(false);
    }
  };

  const contagemModificados = useMemo(() => {
    let contagem = 0;
    if (!produtos) return 0;

    Object.entries(alteracoesEstoque).forEach(([skuId, val]) => {
      let original = -1;
      produtos.forEach((p) => { const m = p.skus.find((s) => s.id === skuId); if (m) original = m.stock; });
      if (original !== -1 && original !== (val === '' ? 0 : Number(val))) contagem++;
    });

    Object.entries(alteracoesPreco).forEach(([skuId, val]) => {
      let original = -1;
      produtos.forEach((p) => { const m = p.skus.find((s) => s.id === skuId); if (m) original = m.price; });
      if (original !== -1 && original !== (val === '' ? 0 : Number(val))) contagem++;
    });

    Object.entries(alteracoesMetadados).forEach(([id, meta]) => {
      const orig = produtos.find((p) => p.id === id);
      if (orig) {
        const origIds = orig.attributes.map((a) => a.attributeId).sort().join(',');
        const novosIds = [...meta.atributosIds].sort().join(',');
        if (orig.name !== meta.name || orig.description !== meta.description || origIds !== novosIds) {
          contagem++;
        }
      }
    });

    return contagem;
  }, [produtos, alteracoesEstoque, alteracoesPreco, alteracoesMetadados]);

  const handleEnvioEmLote = async () => {
    setEstaEnviando(true);
    if (!produtos) return;

    try {
      const promessasEstoque = Object.entries(alteracoesEstoque).map(([skuId, val]) =>
        updateSkuStockInApi(skuId, val === '' ? 0 : Number(val))
      );

      const promessasPreco = Object.entries(alteracoesPreco).map(([skuId, val]) =>
        updateSkuPriceInApi(skuId, Number(val))
      );

      const promessasMetadados = Object.entries(alteracoesMetadados).map(([id, meta]) =>
        updateProductMetadataInApi(id, meta.name, meta.description, meta.atributosIds)
      );

      await Promise.all([...promessasEstoque, ...promessasPreco, ...promessasMetadados]);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });

      setAlteracoesEstoque({});
      setAlteracoesPreco({});
      setAlteracoesMetadados({});
      alert('Todas as modificações foram integradas e salvas com sucesso!');
    } catch {
      alert('Erro ao tentar salvar alterações em lote.');
    } finally {
      setEstaEnviando(false);
    }
  };

  const handleMudancaPesquisa = (v: string) => {
    if (v.trim()) setParametrosBusca({ search: v }, { replace: true });
    else setParametrosBusca({}, { replace: true });
  };

  const limparPesquisa = () => {
    setParametrosBusca({}, { replace: true });
  };

  const handleIncrementarEstoque = (id: string, atual: number) => {
    setAlteracoesEstoque(prev => ({ ...prev, [id]: (prev[id] !== undefined ? Number(prev[id]) : atual) + 1 }));
  };

  const handleDecrementarEstoque = (id: string, atual: number) => {
    setAlteracoesEstoque(prev => ({ ...prev, [id]: Math.max(0, (prev[id] !== undefined ? Number(prev[id]) : atual) - 1) }));
  };

  const handleMudancaEstoqueInput = (id: string, v: string) => {
    setAlteracoesEstoque(prev => ({ ...prev, [id]: v === '' ? '' : Math.max(0, parseInt(v, 10)) }));
  };

  const handleBlurEstoqueInput = (id: string) => {
    if (alteracoesEstoque[id] === '') {
      setAlteracoesEstoque(prev => ({ ...prev, [id]: 0 }));
    }
  };

  return {
    produtos,
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
    podeEditarMetadados: true
  };
};