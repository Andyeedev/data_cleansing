import React from 'react';
import { FileText } from 'lucide-react';
import { useReport } from './ReportContext';

export const ReportHeader: React.FC = () => {
  const { config, metadata } = useReport();

  if (!config) return null;

  return (
    <header className="bg-primary-600 text-neutral-100 p-6 print:bg-primary-600">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <FileText className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">{config.name}</h1>
            <p className="text-primary-20 text-sm">{config.description}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-primary-20">{config.author}</p>
          <p className="text-primary-30">v{config.version}</p>
          {metadata && (
            <p className="text-primary-30">
              {new Date(metadata.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 max-w-6xl mx-auto text-xs">
        <span className="px-2 py-1 bg-primary-700 rounded">{config.type.toUpperCase()}</span>
        <span className="px-2 py-1 bg-primary-700 rounded">{config.classification.toUpperCase()}</span>
        <span className="px-2 py-1 bg-primary-700 rounded">{config.format.toUpperCase()}</span>
      </div>
    </header>
  );
};
