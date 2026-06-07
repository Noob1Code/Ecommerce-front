import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';
import { useProducts } from './useProducts';
import { updateSkuStockInApi, updateProductMetadataInApi, deleteProductInApi, deleteSkuInApi } from '../api/productsApi';

export const useProductBackofficeController = () => {
  const queryClient = useQueryClient();
  const { products, isLoading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // A URL é mantida como a única Fonte Verdadeira de dados para a busca por texto
  const searchQuery = searchParams.get('search') || '';
  
  // Buffers locais de modificações temporárias em lote
  const [stockChanges, setStockChanges] = useState<Record<string, number | string>>({});
  const [metadataChanges, setMetadataChanges] = useState<Record<string, { name: string; description: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AJUSTE: Removida a trava rígida '&& product.isActive' para permitir visualização de inativos no admin
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Recupera o estoque modificado do buffer ou retorna o valor original estável do cache
  const getSkuEffectiveStock = (skuId: string, currentStock: number): number | string => {
    return stockChanges[skuId] !== undefined ? stockChanges[skuId] : currentStock;
  };

  // Recupera os metadados modificados do buffer ou retorna o valor original do cache
  const getProductEffectiveMetadata = (productId: string, currentName: string, currentDesc: string) => {
    return metadataChanges[productId] || { name: currentName, description: currentDesc };
  };

  // Sincroniza as alterações de digitação de Nome e Descrição com o buffer local
  const handleMetadataChange = (productId: string, key: 'name' | 'description', value: string) => {
    setMetadataChanges((prev) => {
      const current = prev[productId] || {
        name: products.find((p) => p.id === productId)?.name || '',
        description: products.find((p) => p.id === productId)?.description || '',
      };
      return {
        ...prev,
        [productId]: { ...current, [key]: value },
      };
    });
  };

  // Tratador assíncrono para a inativação lógica do Produto Pai (Soft Delete)
  const handleProductInactivation = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to logically INACTIVATE the parent product: ${productName}?`)) return;
    try {
      await deleteProductInApi(productId);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      alert('Product parent container successfully inactivated!');
    } catch (err) {
      alert('Failed to inactivate product asset.');
    }
  };

  // Tratador assíncrono para a exclusão física da variação de SKU (Hard Delete)
  const handleSkuPhysicalDeletion = async (skuId: string, skuCode: string) => {
    if (!window.confirm(`CRITICAL: Are you sure you want to PHYSICALLY DELETE the SKU variation [${skuCode}] from the database?`)) return;
    try {
      await deleteSkuInApi(skuId);
      setStockChanges((prev) => {
        const copy = { ...prev };
        delete copy[skuId];
        return copy;
      });
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      alert('SKU variation physically erased from database records.');
    } catch (err) {
      alert('Failed to physically delete SKU variation.');
    }
  };

  // Calcula dinamicamente o volume total de modificações pendentes de envio
  const getModifiedItemsCount = (): number => {
    let count = 0;
    
    Object.entries(stockChanges).forEach(([skuId, val]) => {
      const newStock = val === '' ? 0 : Number(val);
      let originalStock = -1;
      products.forEach((p) => {
        const match = p.skus.find((s) => s.id === skuId);
        if (match) originalStock = match.stock;
      });
      if (originalStock !== -1 && originalStock !== newStock) count++;
    });

    Object.entries(metadataChanges).forEach(([id, meta]) => {
      const original = products.find((p) => p.id === id);
      if (original && (original.name !== meta.name || original.description !== meta.description)) {
        count++;
      }
    });

    return count;
  };

  // Orquestrador de submissões concorrentes em lote com validação de segurança contra campos em branco
  const handleBatchSubmit = async () => {
    setIsSubmitting(true);

    // Validação Arquitetural: Bloqueia preventivamente strings vazias ou preenchidas apenas com espaços em branco
    const hasInvalidFields = Object.values(metadataChanges).some(
      (meta) => meta.name.trim() === '' || meta.description.trim() === ''
    );

    if (hasInvalidFields) {
      alert('Validation Error: Product name and description cannot be left empty or contain only whitespace characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      const stockPromises = Object.entries(stockChanges)
        .filter(([skuId, val]) => {
          const newStock = val === '' ? 0 : Number(val);
          let originalStock = -1;
          products.forEach((p) => {
            const match = p.skus.find((s) => s.id === skuId);
            if (match) originalStock = match.stock;
          });
          return originalStock !== -1 && originalStock !== newStock;
        })
        .map(([skuId, val]) => {
          const newStock = val === '' ? 0 : Number(val);
          return updateSkuStockInApi(skuId, newStock);
        });

      const metadataPromises = Object.entries(metadataChanges)
        .filter(([id, meta]) => {
          const original = products.find((p) => p.id === id);
          return original && (original.name !== meta.name || original.description !== meta.description);
        })
        .map(([id, meta]) => updateProductMetadataInApi(id, meta.name, meta.description));

      await Promise.all([...stockPromises, ...metadataPromises]);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });

      setStockChanges({});
      setMetadataChanges({});
      alert('All batch configurations and CRUD updates saved successfully!');
    } catch (err) {
      alert('An error occurred while deploying batch updates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modifiedCount = getModifiedItemsCount();

  // Atualiza síncronamente os parâmetros da URL para manter a integridade da busca
  const handleSearchChange = (value: string) => {
    if (value.trim()) {
      setSearchParams({ search: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const clearSearch = () => {
    setSearchParams({}, { replace: true });
  };

  return {
    products,
    isLoading,
    error,
    searchQuery,
    filteredProducts,
    stockChanges,
    isSubmitting,
    modifiedCount,
    getSkuEffectiveStock,
    getProductEffectiveMetadata,
    handleMetadataChange,
    handleProductInactivation,
    handleSkuPhysicalDeletion,
    handleBatchSubmit,
    handleSearchChange,
    clearSearch,
    setStockChanges
  };
};