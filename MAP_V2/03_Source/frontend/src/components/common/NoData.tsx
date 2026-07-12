import { Database } from 'lucide-react';

interface NoDataProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export const NoData = ({
  title = 'No Data Available',
  message = 'There is no data to display at this time.',
  action,
}: NoDataProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-neutral-20 rounded-full flex items-center justify-center mb-4">
        <Database className="w-8 h-8 text-neutral-60" />
      </div>
      <h3 className="text-lg font-medium text-neutral-100 mb-2">{title}</h3>
      <p className="text-sm text-neutral-60 mb-4 text-center max-w-sm">
        {message}
      </p>
      {action}
    </div>
  );
};
