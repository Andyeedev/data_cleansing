import { FileText } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';

export const ReportHeader = () => {
  const { reportConfig } = useReportViewer();

  if (!reportConfig) return null;

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 print:bg-primary-600">
      <div className="flex items-center gap-4 mb-4">
        <FileText className="w-10 h-10 text-primary-20" />
        <div>
          <h1 className="text-3xl font-bold">{reportConfig.name}</h1>
          <p className="text-primary-20 mt-1">{reportConfig.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-primary-30">
        <span>Author: {reportConfig.author}</span>
        <span>Version: {reportConfig.version}</span>
        <span className="px-2 py-0.5 bg-primary-700 rounded text-xs uppercase">
          {reportConfig.type}
        </span>
        <span className="px-2 py-0.5 bg-primary-700 rounded text-xs uppercase">
          {reportConfig.classification}
        </span>
      </div>
    </div>
  );
};
