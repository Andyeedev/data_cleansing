import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: number;
}

export const ErrorPage = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  statusCode,
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-error-500" />
        </div>
        {statusCode && (
          <p className="text-6xl font-bold text-neutral-100 mb-2">{statusCode}</p>
        )}
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">{title}</h2>
        <p className="text-neutral-60 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-30 text-neutral-100 rounded-lg hover:bg-neutral-20 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
