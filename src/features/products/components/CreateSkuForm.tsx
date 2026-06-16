import { Button, Card, Input } from '../../../shared/components/ui';
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
    handleFileUpload,
  } = useCreateSkuController(product.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSku(product.attributes, () => {
      onClose();
    });
  };

  return (
    <Card className="p-4 sm:p-6 border border-gray-200 bg-white shadow-xl rounded-xl max-w-2xl mx-auto animate-in fade-in duration-200 mt-4">
      <div className="flex items-start justify-between border-b border-gray-100 pb-3 mb-5 gap-4">
        <div>
          <h3 className="text-base font-black text-gray-900 tracking-tight">
            Adicionar Variação de SKU &rarr; <span className="text-blue-600 font-extrabold">{product.name}</span>
          </h3>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
            Gere uma nova composição física especificando preço, estoque e opções de atributos.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-40 shrink-0 active:scale-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2 animate-in fade-in duration-150">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="break-words">{validationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="sku-code-input" className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
              Código SKU de Fábrica *
            </label>
            <Input
              id="sku-code-input"
              type="text"
              value={sku}
              disabled={isPending}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Ex: NKE-DRY-BLK-G"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="sku-price-input" className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
              Preço de Venda (R$) *
            </label>
            <Input
              id="sku-price-input"
              type="text"
              value={price}
              disabled={isPending}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="sku-stock-input" className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
              Estoque Inicial *
            </label>
            <Input
              id="sku-stock-input"
              type="number"
              min={0}
              value={stock}
              disabled={isPending}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="rounded-xl"
            />
          </div>
        </div>

        {product.attributes && product.attributes.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-2xs">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 pb-1.5">
              Definição de Opções Obrigatórias
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="space-y-1.5">
                  <label htmlFor={`attr-select-${attr.id}`} className="block text-xs font-bold text-gray-700">
                    {attr.attributeName} *
                  </label>
                  <Input
                    id={`attr-select-${attr.id}`}
                    type="text"
                    value={selectedOptions[attr.attributeId] || ''}
                    disabled={isPending}
                    onChange={(e) => handleOptionChange(attr.attributeId, e.target.value)}
                    placeholder={`Digite o valor (Ex: ${attr.attributeName === 'Cor' ? 'Preto' : 'G'})`}
                    className="rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-2xs">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 pb-1.5">
            Galeria de Imagens da Variação
          </span>

          <div className="flex flex-col sm:flex-row gap-2.5 items-end sm:items-center">
            <div className="flex-1 w-full">
              <Input
                type="text"
                aria-label="URL da Imagem do SKU"
                value={currentImageUrl}
                disabled={isPending}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                placeholder="Cole o link HTTP/HTTPS da imagem do produto"
                className="rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <Button
                type="button"
                variant="secondary"
                disabled={isPending || !currentImageUrl.trim()}
                onClick={handleAddImageUrl}
                className="flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 text-xs font-bold rounded-xl active:scale-95 transition-all"
              >
                Vincular Link
              </Button>
              <label className={`flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 text-xs font-bold text-center rounded-xl border bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center active:scale-95 select-none ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <span>Fazer Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isPending}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5 pt-1 max-h-28 overflow-y-auto pr-1">
              {images.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-xl text-[10px] text-gray-600 font-mono gap-4 shadow-3xs">
                  <span className="truncate pr-2 select-all">
                    [{index + 1}] {url}
                  </span>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRemoveImageUrl(index)}
                    className="text-red-600 font-bold hover:text-red-800 transition-colors px-2 py-0.5 rounded-md hover:bg-red-50 disabled:opacity-40 shrink-0 text-xs active:scale-95"
                    title="Remover imagem"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-3 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md border-none"
          >
            Gravar SKU
          </Button>
        </div>

      </form>
    </Card>
  );
};