import { useAttributeManagerController } from '../hooks/useAttributeManagerController';
import { Button, Input, Card } from '../../../shared/components/ui';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-1">
        <Card className="p-5 border border-gray-200 bg-white rounded-xl">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {idEmEdicao ? 'Editar Nome do Atributo' : 'Cadastrar Atributo'}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Crie eixos como Cor ou Tamanho. Os valores serão digitados livremente em cada SKU.
          </p>

          <form onSubmit={handleSalvarAtributo} className="space-y-4">
            {erroValidacao && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
                {erroValidacao}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="attr-name-input" className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                Nome do Atributo <span className="text-red-500">*</span>
              </label>
              <Input
                id="attr-name-input"
                type="text"
                value={nome}
                disabled={estaCarregando}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Cor, Tamanho, Switch, Voltagem"
                className="w-full text-xs py-2 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              {idEmEdicao && (
                <Button type="button" variant="secondary" onClick={handleCancelarEdicao} className="px-3 py-1.5 text-xs font-bold">
                  Cancelar
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={estaCarregando} className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700">
                {idEmEdicao ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border border-gray-200 bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50 font-bold text-sm text-gray-900">
            Eixos de Atributos Cadastrados no Sistema Java
          </div>

          {atributos.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">Nenhum atributo cadastrado no banco.</div>
          ) : (
            <table className="min-w-full divide-y text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Identificador (UUID)</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nome do Eixo</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {atributos.map((attr) => (
                  <tr key={attr.id} className="hover:bg-gray-50/40">
                    <td className="px-4 py-3 font-mono text-gray-400 select-all">{attr.id}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-sm">{attr.nome}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button type="button" onClick={() => handleIniciarEdicao(attr)} className="text-blue-600 font-bold hover:text-blue-800">
                        Editar
                      </button>
                      <button type="button" onClick={() => handleExcluirAtributo(attr.id, attr.nome)} className="text-red-600 font-bold hover:text-red-800">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};