import { useEffect, useState } from 'react';
import { KpiBox, ReportCard, StatusPill, ScoreBar, EmptyState } from '../components/reports/reportWidgets';
import { apiGet } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

interface QualityDimension {
  name: string;
  score: number;
  status: string;
  details: string;
}

interface TrendPoint {
  label: string;
  value: number;
}

interface QualityDashboardData {
  overview: {
    overall_quality_score: number;
    dimensions_scored: number;
    best_dimension: string;
    worst_dimension: string;
  };
  dimensions: QualityDimension[];
  trend: TrendPoint[];
  analysis: string;
}

export function DataQualityPage() {
  const { tenantId } = useAuth();
  const [data, setData] = useState<QualityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const tenantParam = tenantId ? `?tenant_id=${tenantId}` : '';
    apiGet<QualityDashboardData>(`/dashboards/data-quality${tenantParam}`)
      .then(setData)
      .catch(() => setError('Failed to load data quality data'))
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading data quality...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">{error || 'No data'}</div>;

  const ov = data.overview;
  const maxTrend = Math.max(...data.trend.map(t => t.value), 1);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Quality</h1>
        <p className="text-sm text-gray-500 mt-1">Quality dimensions and trends</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiBox label="Overall Quality" value={`${ov.overall_quality_score}%`} tone={ov.overall_quality_score >= 80 ? 'success' : 'warning'} />
        <KpiBox label="Dimensions Scored" value={ov.dimensions_scored} tone="info" />
        <KpiBox label="Best Dimension" value={ov.best_dimension} tone="success" />
        <KpiBox label="Worst Dimension" value={ov.worst_dimension} tone="error" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportCard title="Quality Dimensions" subtitle={`${data.dimensions.length} dimensions scored`}>
          {data.dimensions.length === 0 ? (
            <EmptyState message="No quality dimensions available." />
          ) : (
            <div className="space-y-3">
              {data.dimensions.map((d) => (
                <div key={d.name} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{d.name}</span>
                      <StatusPill status={d.status} />
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{d.score}%</span>
                  </div>
                  <ScoreBar value={d.score} max={100} />
                  <p className="text-xs text-gray-500 mt-1">{d.details}</p>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard title="Quality Trend" subtitle="Score progression over time">
          <div className="flex items-end gap-2 h-48">
            {data.trend.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-700 mb-1">{t.value}%</span>
                <div
                  className="w-full rounded-t bg-blue-500"
                  style={{ height: `${(t.value / maxTrend) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-gray-500 mt-1">{t.label}</span>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      <ReportCard title="Analysis">
        <p className="text-sm text-gray-800 leading-relaxed">{data.analysis}</p>
      </ReportCard>
    </div>
  );
}

export default DataQualityPage;
