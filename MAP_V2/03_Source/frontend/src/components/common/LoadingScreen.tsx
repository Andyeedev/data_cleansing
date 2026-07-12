import { LoadingSpinner } from './LoadingSpinner';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">M</span>
        </div>
        <LoadingSpinner size="lg" text="Loading MAP Nexus..." />
      </div>
    </div>
  );
};
