import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-error-500" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-100 mb-2">
              Something went wrong
            </h2>

            <p className="text-neutral-60 mb-6">
              An unexpected error occurred. Please try again or contact support if the
              problem persists.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-neutral-20 rounded-lg text-left">
                <p className="text-sm text-neutral-80 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 bg-primary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-neutral-30 text-neutral-100 py-2 px-4 rounded-lg font-medium hover:bg-neutral-40 transition-colors"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </div>

            <p className="mt-6 text-sm text-neutral-60">
              Support Reference: ERR_{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
