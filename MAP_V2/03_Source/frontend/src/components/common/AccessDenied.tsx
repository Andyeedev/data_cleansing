import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-error-500" />
        </div>
        <p className="text-6xl font-bold text-neutral-100 mb-2">403</p>
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">
          Access Denied
        </h2>
        <p className="text-neutral-60 mb-6">
          You don't have permission to access this page. Please contact your
          administrator.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-30 text-neutral-100 rounded-lg hover:bg-neutral-20 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
};
