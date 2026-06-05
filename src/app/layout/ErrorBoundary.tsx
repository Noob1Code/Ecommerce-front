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
    console.error('Uncaught layout orchestrator lifecycle error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-6 text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Application Crash Intercepted</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              An unexpected runtime compilation or structure error occurred inside the layout composition stream.
            </p>
            {this.state.error && (
              <pre className="text-left bg-gray-50 p-4 rounded-lg text-xs font-mono text-red-600 overflow-x-auto max-h-40 border border-gray-100">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
            >
              Reinitialize Base Storefront
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}