import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Critical runtime failure intercepted in React tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-5 text-center bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-md animate-in fade-in duration-200 break-words">

            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-2 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Instância Interceptada</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed px-2">
              Ocorreu uma falha de runtime crítica ou compilação incorreta dentro do fluxo de processamento de layout.
            </p>

            {this.state.error && (
              <pre className="text-left bg-gray-50 p-4 rounded-xl text-xs font-mono text-red-600 overflow-x-auto max-h-40 border border-gray-100 break-all select-all shadow-3xs w-full">
                {this.state.error.message}
              </pre>
            )}

            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md active:scale-95 transition-all border-none"
            >
              Reinicializar Aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}