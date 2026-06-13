import { useState } from 'react';
import type { ProductVariationRequestDTO } from '../api/productsApi';
import { useProductMutations } from './useProductMutations';

interface AtributoDoProduto {
  id: string;
  attributeId: string;
  attributeName: string;
}

export const useCreateSkuController = (productId: string) => {
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { createSkuMutation } = useProductMutations();

  const handleOptionChange = (attributeId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
    if (validationError) setValidationError(null);
  };

  const handleAddImageUrl = () => {
    if (!currentImageUrl.trim()) return;

    if (!currentImageUrl.startsWith('http://') && !currentImageUrl.startsWith('https://')) {
      setValidationError('Erro de Validação: A URL da imagem inserida deve ser um link HTTP ou HTTPS válido.');
      return;
    }

    setImages((prev) => [...prev, currentImageUrl.trim()]);
    setCurrentImageUrl('');
    setValidationError(null);
  };

  const handleRemoveImageUrl = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSku('');
    setPrice('');
    setStock('');
    setSelectedOptions({});
    setImages([]);
    setCurrentImageUrl('');
    setValidationError(null);
  };

  const handleSaveSku = async (atributosDoProduto: AtributoDoProduto[], onSuccessCallback?: () => void) => {
    if (!sku.trim() || !price.trim() || !stock.trim()) {
      setValidationError('Erro de Validação: Os campos Código SKU, Preço de Venda e Volume de Estoque são de preenchimento obrigatório.');
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      setValidationError('Erro de Validação: O Preço comercial deve ser um valor numérico positivo maior que zero.');
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      setValidationError('Erro de Validação: O Volume de Estoque físico não pode assumir valores numéricos negativos.');
      return;
    }
    const requiredAttributeIds = atributosDoProduto?.map((attr) => attr.attributeId) || [];
    const missingAttributes = requiredAttributeIds.filter((id) => !selectedOptions[id] || !selectedOptions[id].trim());

    if (missingAttributes.length > 0) {
      setValidationError('Erro de Validação: É obrigatório definir uma opção para cada um dos eixos de atributo do produto pai.');
      return;
    }

    const payload: ProductVariationRequestDTO = {
      sku: sku.trim(),
      preco: numericPrice,
      estoque: Math.floor(numericStock),
      opcoes: Object.entries(selectedOptions).map(([atributoId, valor]) => ({
        atributoId,
        valor,
      })),
      imagens: images.map((url, index) => ({
        urlImagem: url,
        ordem: index + 1,
      })),
    };

    try {
      await createSkuMutation.mutateAsync({ productId, payload });
      resetForm();
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      alert('Nova variação de SKU associada e gravada com sucesso!');
    } catch  {
      setValidationError('Falha Operacional: Ocorreu um erro de comunicação ao tentar registrar o SKU no servidor.');
    }
  };

  return {
    sku,
    price,
    stock,
    selectedOptions,
    images,
    currentImageUrl,
    validationError,
    isPending: createSkuMutation.isPending,
    setSku,
    setPrice,
    setStock,
    setCurrentImageUrl,
    handleOptionChange,
    handleAddImageUrl,
    handleRemoveImageUrl,
    handleSaveSku,
    resetForm,
  };
};