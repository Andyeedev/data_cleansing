import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth tokens
    localStorage.removeItem('map_nexus_auth_token');
    localStorage.removeItem('map_nexus_refresh_token');

    // Redirect to login after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10">
      <div className="text-center">
        <div className="w-16 h-16 bg-neutral-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8 text-neutral-60" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">
          Signing Out
        </h2>
        <p className="text-neutral-60">You are being logged out...</p>
      </div>
    </div>
  );
};
