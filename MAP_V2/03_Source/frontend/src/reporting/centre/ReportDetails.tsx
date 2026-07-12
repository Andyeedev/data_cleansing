import { FileText, Download, Share2, Star, Clock, User, Tag, Calendar } from 'lucide-react';

interface ReportDetailsProps {
  reportId?: string;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ reportId = 'r1' }) => {
  const report = {
    id: reportId,
    name: 'Executive Dashboard Report',
    description: 'Monthly executive summary with KPIs and strategic insights',
    category: 'executive',
    status: 'completed',
    format: ['html', 'pdf'],
    owner: 'John Smith',
    createdAt: '2026-06-15',
    updatedAt: '2026-07-01',
    lastGenerated: '2026-07-01',
    isFavourite: true,
    isShared: true,
    tags: ['monthly', 'executive', 'kpi'],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">{report.name}</h1>
          <p className="text-neutral-60">{report.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-neutral-30 rounded-lg hover:bg-neutral-50">
            <Star className={`w-5 h-5 ${report.isFavourite ? 'fill-warning-500 text-warning-500' : 'text-neutral-400'}`} />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-neutral-30 rounded-lg text-sm hover:bg-neutral-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-neutral-30 rounded-lg text-sm hover:bg-neutral-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-neutral-100 mb-4">Report Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-neutral-50" />
                <span className="text-neutral-60">Category:</span>
                <span className="font-medium text-neutral-100 capitalize">{report.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-neutral-50" />
                <span className="text-neutral-60">Owner:</span>
                <span className="font-medium text-neutral-100">{report.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-neutral-50" />
                <span className="text-neutral-60">Created:</span>
                <span className="font-medium text-neutral-100">{report.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-neutral-50" />
                <span className="text-neutral-60">Last Generated:</span>
                <span className="font-medium text-neutral-100">{report.lastGenerated}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-neutral-100 mb-4">Preview</h2>
            <div className="bg-neutral-50 rounded-lg p-8 text-center text-neutral-50">
              <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-30" />
              <p>Report preview would appear here</p>
              <button className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
                Open Full Preview
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-neutral-100 mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-60">Status</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">{report.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-60">Formats</span>
                <span className="text-sm font-medium text-neutral-100 uppercase">{report.format.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-60">Shared</span>
                <span className="text-sm font-medium text-neutral-100">{report.isShared ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-neutral-100 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-60">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
