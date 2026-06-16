import { useState } from 'react';
import { useNotificationModalStore } from '../../../shared/store/useNotificationModalStore';
import type { ProductVariationRequestDTO } from '../api/productsApi';
import { useProductMutations } from './useProductMutations';

interface AtributoDoProduto {
  id: string;
  attributeId: string;
  attributeName: string;
}

export const useCreateSkuController = (productId: string) => {
  const showSuccess = useNotificationModalStore((state) => state.showSuccess);
  const showError = useNotificationModalStore((state) => state.showError);

  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { createSkuMutation, uploadImageMutation } = useProductMutations();

  const handleOptionChange = (attributeId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
    if (validationError) setValidationError(null);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Erro de IHC: O arquivo selecionado deve ser uma imagem válida (PNG, JPG, WEBP).');
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setValidationError('Erro de IHC: A imagem selecionada é muito grande. O limite máximo permitido é de 10MB.');
      return;
    }

    try {
      const response = await uploadImageMutation.mutateAsync(file);
      setImages((prev) => [...prev, response.url]);
      setValidationError(null);
    } catch {
      showError({
        title: 'Falha no Upload',
        message: 'Não foi possível processar o upload do arquivo de imagem para o servidor de arquivos.'
      });
    }
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
      setValidationError('Erro de Validação: O Volume de Estoque físico não pode assume valores numéricos negativos.');
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

      showSuccess({
        title: 'Variação Cadastrada',
        message: `A nova variação SKU "${payload.sku}" foi associada e gravada com sucesso ao produto pai no banco de dados!`
      });
    } catch {
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
    isPending: createSkuMutation.isPending || uploadImageMutation.isPending,
    setSku,
    setPrice,
    setStock,
    setCurrentImageUrl,
    handleOptionChange,
    handleAddImageUrl,
    handleRemoveImageUrl,
    handleSaveSku,
    handleFileUpload,
    resetForm,
  };
};