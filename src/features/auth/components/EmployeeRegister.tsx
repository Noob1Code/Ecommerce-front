import { useEmployeeRegister } from '../hooks/useEmployeeRegister';
import { Card, Button, Input } from '../../../shared/components/ui';
import type { PerfilUsuario } from '../store/useAuthStore';

export const EmployeeRegister = () => {
  const {
    nome,
    email,
    senha,
    matricula,
    perfisSelecionados,
    carregando,
    setNome,
    setEmail,
    setSenha,
    setMatricula,
    handleAlternarPerfil,
    handleCadastrarFuncionario,
    handleVoltar,
  } = useEmployeeRegister();

  // Matriz de metadados das roles para renderização em lote na interface
  const listaPerfisDisponiveis: { id: PerfilUsuario; rotulo: string; descricao: string }[] = [
    { id: 'ROLE_ESTOQUE', rotulo: 'Estoque', descricao: 'Controle de mercadorias e SKUs' },
    { id: 'ROLE_FATURAMENTO', rotulo: 'Faturamento', descricao: 'Emissão de notas e relatórios financeiros' },
    { id: 'ROLE_ENTREGA', rotulo: 'Logística / Entrega', descricao: 'Despacho e controle de frotas' },
    { id: 'ROLE_ADMIN', rotulo: 'Administrador Geral', descricao: 'Acesso total e gerenciamento de equipe' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabeçalho de Navegação Retrátil */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <button
            type="button"
            onClick={handleVoltar}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center space-x-1"
          >
            &larr; Voltar para o Painel de Estoque
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">Controle de Credenciais</h1>
        </div>
      </div>

      <Card className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Cadastrar Novo Funcionário</h2>
        <p className="text-xs text-gray-500 mb-6 font-mono">POST mapping vinculado à estrutura Set&lt;String&gt; roles do Java</p>
        
        <form onSubmit={handleCadastrarFuncionario} className="space-y-4">
          <div>
            <label htmlFor="nomeFunc" className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
            <Input 
              id="nomeFunc"
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              placeholder="Ex: João Silva da Costa" 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="emailFunc" className="block text-sm font-semibold text-gray-700 mb-1">E-mail Corporativo</label>
            <Input 
              id="emailFunc"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Ex: joao.costa@empresa.com" 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="matriculaFunc" className="block text-sm font-semibold text-gray-700 mb-1">Matrícula Funcional</label>
            <Input 
              id="matriculaFunc"
              type="text" 
              value={matricula} 
              onChange={(e) => setMatricula(e.target.value)} 
              placeholder="Ex: MAT-2026-9912" 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="senhaFunc" className="block text-sm font-semibold text-gray-700 mb-1">Senha Provisória de Acesso</label>
            <Input 
              id="senhaFunc"
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="Mínimo de 6 caracteres" 
              required 
            />
          </div>

          {/* CORREÇÃO VISUAL: Painel de múltipla escolha com Checkboxes estilizados em Tailwind */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Perfis de Acesso Autorizados <span className="text-xs font-normal text-gray-400">(Selecione 1 ou mais)</span>
            </label>
            
            <div className="grid grid-cols-1 gap-2.5">
              {listaPerfisDisponiveis.map((perfil) => {
                const marcado = perfisSelecionados.includes(perfil.id);
                
                return (
                  <button
                    key={perfil.id}
                    type="button"
                    onClick={() => handleAlternarPerfil(perfil.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      marcado
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{perfil.rotulo}</p>
                      <p className="text-xs text-gray-500">{perfil.descricao}</p>
                    </div>
                    
                    {/* Indicador visual redondo estilizado parecido com Checkbox */}
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                      marcado 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {marcado && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" className="w-full py-2.5 font-bold uppercase tracking-wide" disabled={carregando}>
              {carregando ? 'Gravando Registro...' : 'Salvar Registro no Backend'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};