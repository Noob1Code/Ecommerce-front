import { Button, Card, Input, Spinner } from '../../../shared/components/ui';
import { useCreateProductController } from '../hooks/useCreateProductController';

interface CreateProductFormProps {
  onClose: () => void;
}

export const CreateProductForm = ({ onClose }: CreateProductFormProps) => {
  const {
    name,
    description,
    selectedAttributeIds,
    attributes,
    validationError,
    isLoading,
    error,
    handleNameChange,
    handleDescriptionChange,
    handleToggleAttribute,
    handleCreateSubmit,
  } = useCreateProductController();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateSubmit(() => {
      onClose();
    });
  };

  return (
    <Card className="p-4 sm:p-6 border border-gray-200 bg-white shadow-xl rounded-xl max-w-2xl mx-auto animate-in fade-in duration-200 w-full">
      <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-5 sm:mb-6 gap-4 w-full">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Cadastrar Novo Produto Base</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Insira as informações essenciais para abrir o container de novos SKUs.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-40 shrink-0 active:scale-90"
          title="Fechar formulário"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 w-full">

        {(validationError || error) && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2 animate-in fade-in duration-150">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="break-words">{validationError || error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="form-product-name" className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
            Nome do Produto Container *
          </label>
          <Input
            id="form-product-name"
            type="text"
            value={name}
            disabled={isLoading}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ex: Teclado Mecânico Gamer RGB, Monitor UltraWide"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="form-product-desc" className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
            Descrição de Exibição *
          </label>
          <textarea
            id="form-product-desc"
            value={description}
            rows={3}
            disabled={isLoading}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Insira os detalhes comerciais, especificações gerais e diferenciais técnicos do produto base..."
            className="w-full text-base sm:text-sm text-gray-700 px-4 py-3 sm:py-2.5 rounded-xl border border-gray-300 bg-white shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 font-medium leading-normal resize-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        <div className="space-y-2.5 border-t border-gray-100 pt-4 w-full">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
              Atributos de Customização Disponíveis
            </label>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
              Selecione quais eixos de variação este produto pai suportará para as composições de SKU.
            </p>
          </div>

          {isLoading && attributes.length === 0 ? (
            <div className="py-4 flex items-center justify-center space-x-2 text-xs text-gray-400 font-medium bg-gray-50/30 rounded-xl border border-dashed w-full">
              <Spinner className="h-4 w-4 text-gray-400" />
              <span>Sincronizando tabela de atributos...</span>
            </div>
          ) : attributes.length === 0 ? (
            <p className="text-xs text-amber-600 font-bold py-1 bg-amber-50 px-3 rounded-lg border border-amber-200">
              Aviso: Nenhum atributo (Cor, Tamanho, etc.) foi localizado no banco de dados.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-200 w-full">
              {attributes.map((attr) => {
                const isChecked = selectedAttributeIds.includes(attr.id);
                return (
                  <label
                    key={attr.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none active:scale-99 ${isChecked
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold block text-sm text-gray-900 truncate">{attr.nome}</span>
                    </div>

                    <div className="flex h-5 items-center flex-shrink-0 ml-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isLoading}
                        onChange={() => handleToggleAttribute(attr.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-3 border-t border-gray-100 w-full">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md border-none"
          >
            Salvar Produto
          </Button>
        </div>

      </form>
    </Card>
  );
};