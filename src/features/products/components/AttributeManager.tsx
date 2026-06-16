import { Button, Card, Input } from '../../../shared/components/ui';
import { useAttributeManagerController } from '../hooks/useAttributeManagerController';

export const AttributeManager = () => {
  const {
    atributos,
    nome,
    idEmEdicao,
    erroValidacao,
    estaCarregando,
    setNome,
    handleIniciarEdicao,
    handleCancelarEdicao,
    handleSalvarAtributo,
    handleExcluirAtributo,
  } = useAttributeManagerController();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200 py-4">
      <div className="lg:col-span-1">
        <Card className="p-4 sm:p-5 border border-gray-200 bg-white rounded-xl shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-1 tracking-tight">
            {idEmEdicao ? 'Editar Nome do Atributo' : 'Cadastrar Atributo'}
          </h3>
          <p className="text-xs text-gray-400 font-medium mb-5 leading-relaxed">
            Crie eixos como Cor ou Tamanho. Os valores serão digitados livremente na configuração de cada SKU.
          </p>

          <form onSubmit={handleSalvarAtributo} className="space-y-4">
            {erroValidacao && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-in fade-in duration-150">
                {erroValidacao}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="attr-name-input" className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
                Nome do Atributo <span className="text-red-500">*</span>
              </label>
              <Input
                id="attr-name-input"
                type="text"
                value={nome}
                disabled={estaCarregando}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Cor, Tamanho, Switch, Voltagem"
                className="w-full text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 flex-row">
              {idEmEdicao && (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={estaCarregando}
                  onClick={handleCancelarEdicao}
                  className="px-4 py-2 text-xs font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                isLoading={estaCarregando}
                className="px-5 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl active:scale-95 transition-transform border-none shadow-xs"
              >
                {idEmEdicao ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-bold text-sm text-gray-900 tracking-tight">
            Eixos de Atributos Cadastrados no Sistema Java
          </div>

          {atributos.length === 0 ? (
            <div className="p-8 text-center text-xs font-medium text-gray-400 bg-white">
              Nenhum eixo de especificação técnica localizado no banco.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[600px] w-full divide-y divide-gray-100 text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5 w-[45%]">Identificador (UUID)</th>
                    <th className="px-5 py-3.5 w-[35%]">Nome do Eixo</th>
                    <th className="px-5 py-3.5 w-[20%] text-right pr-6">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
                  {atributos.map((attr) => (
                    <tr key={attr.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-gray-400 select-all text-[11px] truncate max-w-[220px]" title={attr.id}>
                        {attr.id}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">
                        {attr.nome}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-4 pr-6">
                        <button
                          type="button"
                          disabled={estaCarregando}
                          onClick={() => handleIniciarEdicao(attr)}
                          className="text-blue-600 font-bold hover:text-blue-800 transition-colors text-xs active:scale-95"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={estaCarregando}
                          onClick={() => handleExcluirAtributo(attr.id, attr.nome)}
                          className="text-red-600 font-bold hover:text-red-800 transition-colors text-xs active:scale-95"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};