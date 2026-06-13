import { Button, Card, Input, Spinner } from '../../../shared/components/ui';
import { useCreateSkuController } from '../hooks/useCreateSkuController';

interface CreateSkuFormProps {
  product: {
    id: string;
    name: string;
    attributes: Array<{
      id: string;
      attributeId: string;
      attributeName: string;
    }>;
  };
  onClose: () => void;
}

export const CreateSkuForm = ({ product, onClose }: CreateSkuFormProps) => {
  const {
    sku,
    price,
    stock,
    selectedOptions,
    images,
    currentImageUrl,
    validationError,
    isPending,
    setSku,
    setPrice,
    setStock,
    setCurrentImageUrl,
    handleOptionChange,
    handleAddImageUrl,
    handleRemoveImageUrl,
    handleSaveSku,
  } = useCreateSkuController(product.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSku(product.attributes, () => {
      onClose();
    });
  };

  return (
    <Card className="p-6 border border-blue-200 bg-blue-50/10 shadow-lg rounded-xl max-w-2xl mx-auto animate-fade-in mt-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Adicionar Variação de SKU $\rightarrow$ <span className="text-blue-600">{product.name}</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Gere uma nova composição física especificando preço, estoque e opções de atributos.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Banner de Erros de Validação Local ou de Servidor */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center space-x-2">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        {/* Linha 1: Dados Comerciais Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="sku-code-input" className="block text-[11px] font-bold uppercase tracking-wide text-gray-600">
              Código SKU de Fábrica <span className="text-red-500">*</span>
            </label>
            <Input
              id="sku-code-input"
              type="text"
              value={sku}
              disabled={isPending}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Ex: NKE-DRY-BLK-G"
              className="w-full text-xs py-2 rounded-lg border-gray-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sku-price-input" className="block text-[11px] font-bold uppercase tracking-wide text-gray-600">
              Preço de Venda (R$) <span className="text-red-500">*</span>
            </label>
            <Input
              id="sku-price-input"
              type="text"
              value={price}
              disabled={isPending}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full text-xs py-2 rounded-lg border-gray-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sku-stock-input" className="block text-[11px] font-bold uppercase tracking-wide text-gray-600">
              Estoque Inicial <span className="text-red-500">*</span>
            </label>
            <Input
              id="sku-stock-input"
              type="number"
              min={0}
              value={stock}
              disabled={isPending}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="w-full text-xs py-2 rounded-lg border-gray-300 bg-white"
            />
          </div>
        </div>

        {/* Linha 2: Eixos de Atributos Vinculados */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 border-b border-gray-100 pb-1">
              Definição de Opções Obrigatórias
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="space-y-1">
                  <label htmlFor={`attr-select-${attr.id}`} className="block text-xs font-semibold text-gray-700">
                    {attr.attributeName} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={`attr-select-${attr.id}`}
                    type="text"
                    value={selectedOptions[attr.attributeId] || ''}
                    disabled={isPending}
                    onChange={(e) => handleOptionChange(attr.attributeId, e.target.value)}
                    placeholder={`Digite o valor (Ex: ${attr.attributeName === 'Cor' ? 'Preto' : 'G'})`}
                    className="w-full text-xs py-2 rounded-lg border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linha 3: Gerenciador de Galeria de Fotos */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 border-b border-gray-100 pb-1">
            Galeria de Imagens da Variação
          </span>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                aria-label="URL da Imagem do SKU"
                value={currentImageUrl}
                disabled={isPending}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                placeholder="Cole o link HTTP/HTTPS da imagem do produto"
                className="w-full text-xs py-2 rounded-lg border-gray-300"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending || !currentImageUrl.trim()}
              onClick={handleAddImageUrl}
              className="px-3 text-xs font-bold border border-gray-300 hover:bg-gray-50 shrink-0"
            >
              Vincular Link
            </Button>
          </div>

          {/* Listagem Reativa de URLs Inseridas na Composição */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5 pt-1 max-h-24 overflow-y-auto">
              {images.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] text-gray-600 font-mono">
                  <span className="truncate pr-4">
                    [{index + 1}] {url}
                  </span>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRemoveImageUrl(index)}
                    className="text-red-500 hover:text-red-700 font-bold px-1 rounded hover:bg-red-50 disabled:opacity-40"
                    title="Remover imagem"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barra de Controles Inferiores */}
        <div className="flex items-center justify-end space-x-2 border-t border-gray-200 pt-4 mt-5">
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={onClose}
            className="px-3 py-2 text-xs font-bold border border-gray-300 hover:bg-gray-50 text-gray-700 uppercase tracking-wider"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] flex items-center justify-center"
          >
            {isPending ? (
              <div className="flex items-center space-x-1">
                <Spinner className="h-3 w-3 text-white" />
                <span>Salvando...</span>
              </div>
            ) : (
              <span>Gravar SKU</span>
            )}
          </Button>
        </div>

      </form>
    </Card>
  );
};