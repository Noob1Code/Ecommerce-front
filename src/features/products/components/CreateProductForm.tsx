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
    <Card className="p-6 border border-gray-200 bg-white shadow-xl rounded-xl max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Cadastrar Novo Produto Base</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Insira as informações essenciais para abrir o container de novos SKUs.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
          title="Fechar formulário"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Mensagens operacionais de erro de validação ou de rede */}
        {(validationError || error) && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center space-x-2">
            <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Input: Nome do Produto */}
        <div className="space-y-1.5">
          <label htmlFor="form-product-name" className="block text-xs font-bold uppercase tracking-wide text-gray-700">
            Nome do Produto Container <span className="text-red-500">*</span>
          </label>
          <Input
            id="form-product-name"
            type="text"
            value={name}
            disabled={isLoading}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ex: Camiseta Nike Dri-Fit, Tênis Running Sport"
            className="w-full text-sm py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Input: Descrição do Catálogo */}
        <div className="space-y-1.5">
          <label htmlFor="form-product-desc" className="block text-xs font-bold uppercase tracking-wide text-gray-700">
            Descrição de Exibição <span className="text-red-500">*</span>
          </label>
          <textarea
            id="form-product-desc"
            value={description}
            rows={3}
            disabled={isLoading}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Insira os detalhes comerciais, especificações gerais e diferenciais técnicas do produto base..."
            className="w-full text-sm text-gray-700 px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400 font-normal leading-normal shadow-2xs resize-none"
          />
        </div>

        {/* Seleção Dinâmica de Atributos de Suporte */}
        <div className="space-y-2.5 border-t border-gray-100 pt-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700">
              Atributos de Customização Disponíveis
            </label>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Selecione quais eixos de variação este produto pai suportará para as composições de SKU.
            </p>
          </div>

          {isLoading && attributes.length === 0 ? (
            <div className="py-4 flex items-center justify-center space-x-2 text-xs text-gray-400">
              <Spinner className="h-4 w-4 text-gray-400" />
              <span>Sincronizando tabela de atributos...</span>
            </div>
          ) : attributes.length === 0 ? (
            <p className="text-xs text-amber-600 font-medium py-1">
              Aviso: Nenhum atributo (Cor, Tamanho, etc.) foi localizado no banco de dados.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-lg border border-gray-150">
              {attributes.map((attr) => {
                const isChecked = selectedAttributeIds.includes(attr.id);
                return (
                  <label
                    key={attr.id}
                    className={`flex items-start p-2.5 rounded-lg border transition-all cursor-pointer select-none ${isChecked
                      ? 'border-blue-500 bg-blue-50/40 text-blue-900 ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isLoading}
                        onChange={() => handleToggleAttribute(attr.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                      />
                    </div>
                    <div className="ml-3 text-xs">
                      <span className="font-bold block">{attr.nome}</span>
                      <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Barra de Ações Inferior */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-5 mt-6">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold border border-gray-300 hover:bg-gray-50 text-gray-700 uppercase tracking-wider shadow-2xs"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center space-x-1.5">
                <Spinner className="h-3.5 w-3.5 text-white" />
                <span>Processando...</span>
              </div>
            ) : (
              <span>Salvar Produto</span>
            )}
          </Button>
        </div>

      </form>
    </Card>
  );
};