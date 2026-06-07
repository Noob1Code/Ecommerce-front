import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import { useProducts } from './useProducts';
import {
  updateSkuStockInApi,
  updateProductMetadataInApi,
  deleteProductInApi,
  deleteSkuInApi,
  activateProductInApi,
  updateSkuPriceInApi
} from '../api/productsApi';

export const useProductBackofficeController = () => {
  const queryClient = useQueryClient();
  const { products: produtos, isLoading: estaCarregando, error: erro } = useProducts();
  const [parametrosBusca, setParametrosBusca] = useSearchParams();
  const termoPesquisa = parametrosBusca.get('search') || '';
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [alteracoesEstoque, setAlteracoesEstoque] = useState<Record<string, number | string>>({});
  const [alteracoesPreco, setAlteracoesPreco] = useState<Record<string, number | string>>({});
  const [alteracoesMetadados, setAlteracoesMetadados] = useState<Record<string, { name: string; description: string }>>({});
  const [estaEnviando, setEstaEnviando] = useState(false);

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

  const obterMetadadosEfetivosProduto = (produtoId: string, nomeAtual: string, descricaoAtual: string) => {
    return alteracoesMetadados[produtoId] || { name: nomeAtual, description: descricaoAtual };
  };

  const handleMudancaMetadados = (produtoId: string, chave: 'name' | 'description', valor: string) => {
    setAlteracoesMetadados((prev) => {
      const atual = prev[produtoId] || {
        name: produtos?.find((p) => p.id === produtoId)?.name || '',
        description: produtos?.find((p) => p.id === produtoId)?.description || '',
      };
      return {
        ...prev,
        [produtoId]: { ...atual, [chave]: valor },
      };
    });
  };

  const handleMudancaPreco = (skuId: string, valor: string) => {
    const valorSaneado = valor.replace(/[^0-9.]/g, '');
    const partes = valorSaneado.split('.');
    const valorFinal = partes.length > 2 ? `${partes[0]}.${partes.slice(1).join('')}` : valorSaneado;

    setAlteracoesPreco((prev) => ({ ...prev, [skuId]: valorFinal }));
  };

  const handleAlternarStatusProduto = async (produtoId: string, nomeProduto: string, estaAtivo: boolean) => {
    const mensagemConfirmacao = estaAtivo
      ? `Tem certeza que deseja INATIVAR o produto pai: ${nomeProduto}?`
      : `Tem certeza que deseja REATIVAR o produto pai: ${nomeProduto}?`;

    if (!window.confirm(mensagemConfirmacao)) return;

    try {
      if (estaAtivo) {
        await deleteProductInApi(produtoId);
      } else {
        await activateProductInApi(produtoId);
      }
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      alert(`Status do produto alterado com sucesso!`);
    } catch (err) {
      alert('Falha ao modificar o status operacional do ativo.');
    }
  };

  const handleExclusaoFisicaSku = async (skuId: string, codigoSku: string) => {
    if (!window.confirm(`CRÍTICO: Tem certeza que deseja EXCLUIR FISICAMENTE a variação [${codigoSku}] do banco de dados?`)) return;
    try {
      await deleteSkuInApi(skuId);
      setAlteracoesEstoque((prev) => {
        const copia = { ...prev };
        delete copia[skuId];
        return copia;
      });
      setAlteracoesPreco((prev) => {
        const copia = { ...prev };
        delete copia[skuId];
        return copia;
      });
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      alert('Variação de SKU removida permanentemente dos registros.');
    } catch (err) {
      alert('Falha ao deletar fisicamente o SKU.');
    }
  };

  const obterContagemItensModificados = (): number => {
    let contagem = 0;
    if (!produtos) return 0;

    Object.entries(alteracoesEstoque).forEach(([skuId, val]) => {
      const novoEstoque = val === '' ? 0 : Number(val);
      let estoqueOriginal = -1;
      produtos.forEach((p) => {
        const match = p.skus.find((s) => s.id === skuId);
        if (match) estoqueOriginal = match.stock;
      });
      if (estoqueOriginal !== -1 && estoqueOriginal !== novoEstoque) contagem++;
    });

    Object.entries(alteracoesPreco).forEach(([skuId, val]) => {
      const novoPreco = val === '' ? 0 : Number(val);
      let precoOriginal = -1;
      produtos.forEach((p) => {
        const match = p.skus.find((s) => s.id === skuId);
        if (match) precoOriginal = match.price;
      });
      if (precoOriginal !== -1 && precoOriginal !== novoPreco) contagem++;
    });

    Object.entries(alteracoesMetadados).forEach(([id, meta]) => {
      const original = produtos.find((p) => p.id === id);
      if (original && (original.name !== meta.name || original.description !== meta.description)) {
        contagem++;
      }
    });

    return contagem;
  };

  const handleEnvioEmLote = async () => {
    setEstaEnviando(true);
    if (!produtos) return;

    const camposInvalidos = Object.values(alteracoesMetadados).some(
      (meta) => meta.name.trim() === '' || meta.description.trim() === ''
    );

    if (camposInvalidos) {
      alert('Erro de Validação: O nome e a descrição do produto não podem ser deixados em branco.');
      setEstaEnviando(false);
      return;
    }

    try {
      const promessasEstoque = Object.entries(alteracoesEstoque)
        .filter(([skuId, val]) => {
          const novoEstoque = val === '' ? 0 : Number(val);
          let original = -1;
          produtos.forEach((p) => {
            const match = p.skus.find((s) => s.id === skuId);
            if (match) original = match.stock;
          });
          return original !== -1 && original !== novoEstoque;
        })
        .map(([skuId, val]) => updateSkuStockInApi(skuId, val === '' ? 0 : Number(val)));

      const promessasPreco = Object.entries(alteracoesPreco)
        .filter(([skuId, val]) => {
          const novoPreco = val === '' ? 0 : Number(val);
          let original = -1;
          produtos.forEach((p) => {
            const match = p.skus.find((s) => s.id === skuId);
            if (match) original = match.price;
          });
          return original !== -1 && original !== novoPreco;
        })
        .map(([skuId, val]) => updateSkuPriceInApi(skuId, Number(val)));

      const promessasMetadados = Object.entries(alteracoesMetadados)
        .filter(([id, meta]) => {
          const original = produtos.find((p) => p.id === id);
          return original && (original.name !== meta.name || original.description !== meta.description);
        })
        .map(([id, meta]) => updateProductMetadataInApi(id, meta.name, meta.description));

      await Promise.all([...promessasEstoque, ...promessasPreco, ...promessasMetadados]);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });

      setAlteracoesEstoque({});
      setAlteracoesPreco({});
      setAlteracoesMetadados({});
      alert('Todas as configurações em lote e preços foram salvos com sucesso!');
    } catch (err) {
      alert('Ocorreu um erro ao aplicar as updates em lote.');
    } finally {
      setEstaEnviando(false);
    }
  };

  const contagemModificados = obterContagemItensModificados();

  const handleMudancaPesquisa = (valor: string) => {
    if (valor.trim()) {
      setParametrosBusca({ search: valor }, { replace: true });
    } else {
      setParametrosBusca({}, { replace: true });
    }
  };

  const limparPesquisa = () => {
    setParametrosBusca({}, { replace: true });
  };

  const handleIncrementarEstoque = (skuId: string, estoqueAtual: number) => {
    const efetivo = obterEstoqueEfetivoSku(skuId, estoqueAtual);
    const numerico = efetivo === '' ? 0 : Number(efetivo);
    setAlteracoesEstoque((prev) => ({ ...prev, [skuId]: numerico + 1 }));
  };

  const handleDecrementarEstoque = (skuId: string, estoqueAtual: number) => {
    const efetivo = obterEstoqueEfetivoSku(skuId, estoqueAtual);
    const numerico = efetivo === '' ? 0 : Number(efetivo);
    setAlteracoesEstoque((prev) => ({ ...prev, [skuId]: Math.max(0, numerico - 1) }));
  };

  const handleMudancaEstoqueInput = (skuId: string, valor: string) => {
    if (valor === '') {
      setAlteracoesEstoque((prev) => ({ ...prev, [skuId]: '' }));
    } else {
      const analisado = parseInt(valor, 10);
      if (!isNaN(analisado) && analisado >= 0) {
        setAlteracoesEstoque((prev) => ({ ...prev, [skuId]: analisado }));
      }
    }
  };

  const handleBlurEstoqueInput = (skuId: string) => {
    if (alteracoesEstoque[skuId] === '') {
      setAlteracoesEstoque((prev) => ({ ...prev, [skuId]: 0 }));
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
  };
};