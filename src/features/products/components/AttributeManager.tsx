import { Button, Card, Input } from '../../../shared/components/ui';
import { useAttributeManagerController } from '../hooks/useAttributeManagerController';

export const AttributeManager = () => {
    const {
        atributos,
        nome,
        valoresInput,
        idEmEdicao,
        erroValidacao,
        estaCarregando,
        erroServidor,
        setNome,
        setValoresInput,
        handleIniciarEdicao,
        handleCancelarEdicao,
        handleSalvarAtributo,
        handleExcluirAtributo,
    } = useAttributeManagerController();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">

            {/* Formulário de Criação/Edição */}
            <div className="lg:col-span-1">
                <Card className="p-5 border border-gray-200 bg-white shadow-sm rounded-xl">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                        {idEmEdicao ? 'Editar Atributo Estrutural' : 'Cadastrar Novo Atributo'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                        Defina eixos técnicos globais para as composições físicas dos SKUs de hardware.
                    </p>

                    <form onSubmit={handleSalvarAtributo} className="space-y-4">
                        {erroValidacao && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
                                {erroValidacao}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="attr-name" className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                                Nome do Atributo <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="attr-name"
                                type="text"
                                value={nome}
                                disabled={estaCarregando}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Cor, Tamanho, Voltagem, Layout"
                                className="w-full text-xs py-2 bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="attr-values" className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                                Opções de Valores (Separados por vírgula) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="attr-values"
                                value={valoresInput}
                                disabled={estaCarregando}
                                onChange={(e) => setValoresInput(e.target.value)}
                                placeholder="Ex: Preto, Branco, Azul (ou) P, M, G, GG"
                                rows={3}
                                className="w-full text-xs px-3 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 leading-normal font-normal shadow-2xs resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                            {idEmEdicao && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleCancelarEdicao}
                                    disabled={estaCarregando}
                                    className="px-3 py-1.5 text-xs font-bold uppercase"
                                >
                                    Cancelar
                                </Button>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={estaCarregando}
                                className="px-4 py-1.5 text-xs font-bold uppercase bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                            >
                                {estaCarregando ? 'Salvando...' : idEmEdicao ? 'Atualizar' : 'Salvar Atributo'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Listagem de Atributos Cadastrados (Tabela CRUD) */}
            <div className="lg:col-span-2">
                <Card className="border border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-900">Eixos de Atributos Registrados no Catálogo</h3>
                    </div>

                    {erroServidor && <div className="p-4 text-xs text-red-600 font-medium">{erroServidor}</div>}

                    {atributos.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400">Nenhum atributo localizado no servidor Java.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Valores Mapeados</th>
                                        <th className="px-4 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-right font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {atributos.map((attr) => (
                                        <tr key={attr.id} className={`hover:bg-gray-50/50 ${!attr.ativo ? 'bg-red-50/10 text-gray-400' : ''}`}>
                                            <td className="px-4 py-3 font-bold text-gray-900">{attr.nome}</td>
                                            <td className="px-4 py-3 text-gray-600 font-medium">
                                                <div className="flex flex-wrap gap-1">
                                                    {attr.valores?.map((v, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 border rounded-md text-[10px] font-semibold text-gray-600">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold">
                                                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${attr.ativo ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                                                    }`}>
                                                    {attr.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    disabled={estaCarregando}
                                                    onClick={() => handleIniciarEdicao(attr)}
                                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-40"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={estaCarregando}
                                                    onClick={() => handleExcluirAtributo(attr.id, attr.nome)}
                                                    className={`text-xs font-bold ${attr.ativo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                >
                                                    {attr.ativo ? 'Inativar' : 'Reativar'}
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