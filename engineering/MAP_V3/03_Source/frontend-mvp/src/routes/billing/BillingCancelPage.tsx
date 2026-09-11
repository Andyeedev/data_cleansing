import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { PageContainer } from '../../components/PageContainer/PageContainer';

export function BillingCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/billing/subscription'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout Cancelled</h1>
        <p className="text-sm text-gray-500 mb-6">No changes were made to your subscription. Redirecting...</p>
        <button
          onClick={() => navigate('/billing/subscription')}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          View Subscription
        </button>
      </div>
    </PageContainer>
  );
}
