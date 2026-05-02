// src/shared/components/layout/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service like Sentry here
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Oops, something went wrong!</h2>
          <p className="text-gray-500">We are sorry, but the application encountered an unexpected error.</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.replace('/')}
          >
            Go back to Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}