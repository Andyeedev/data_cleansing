import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export const ComingSoon = ({
  title = 'Coming Soon',
  description = 'This feature is under development and will be available soon.',
}: ComingSoonProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8 text-warning-500" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">{title}</h2>
        <p className="text-neutral-60 mb-6">{description}</p>
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
