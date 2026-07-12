import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

export const SessionExpiredPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('map_nexus_auth_token');
    localStorage.removeItem('map_nexus_refresh_token');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-warning-500" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">
          Session Expired
        </h2>
        <p className="text-neutral-60 mb-6">
          Your session has expired. Please sign in again to continue.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
};
